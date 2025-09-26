import { useNow } from '@/hooks/use-now';
import {
  getCurrentRecordingEndDate,
  isOverHalfInterval,
} from '@/libs/recording';
import { HomeRoute } from '@/libs/routes';
import { getCourtQuery, getGymQuery } from '@/services/gym';
import { Callout } from '@radix-ui/themes';
import { useSuspenseQueries } from '@tanstack/react-query';
import { formatDate, isAfter } from 'date-fns';
import { AlertCircle } from 'lucide-react';

export default function RecordingInfo() {
  const { now } = useNow();

  const { courtUuid, gymUuid } = HomeRoute.useSearch();
  const [{ data: court }, { data: gym }] = useSuspenseQueries({
    queries: [getCourtQuery({ courtUuid }), getGymQuery({ gymUuid })],
  });
  const currentRecordingEndDate = getCurrentRecordingEndDate({
    now,
    recordingIntervalInMinute: court.recordingInterval,
    operatingStartHour: gym.todayOperatingTime.openHour,
    operatingEndHour: gym.todayOperatingTime.closeHour,
  });

  const isAfterOperationEnd = isAfter(now, currentRecordingEndDate);
  const isOverHalf = isOverHalfInterval({
    now,
    recordingIntervalInMinute: court.recordingInterval,
    operatingStartHour: gym.todayOperatingTime.openHour,
    operatingEndHour: gym.todayOperatingTime.closeHour,
  });

  return (
    <>
      {(() => {
        if (isAfterOperationEnd) {
          return (
            <Callout.Root color="red">
              <Callout.Icon>
                <AlertCircle size={16} />
              </Callout.Icon>
              <Callout.Text>영업 시간 외 녹화는 불가능합니다.</Callout.Text>
            </Callout.Root>
          );
        }
        if (isOverHalf && !court.isRecording) {
          return (
            <Callout.Root color="yellow">
              <Callout.Icon>
                <AlertCircle size={16} />
              </Callout.Icon>
              <Callout.Text>
                {formatDate(currentRecordingEndDate, 'HH:mm')} 부터 녹화
                가능합니다.
              </Callout.Text>
            </Callout.Root>
          );
        }
        if (court.isRecording) {
          return (
            <Callout.Root color="green">
              <Callout.Icon>
                <AlertCircle size={16} />
              </Callout.Icon>
              <Callout.Text>녹화 중입니다.</Callout.Text>
            </Callout.Root>
          );
        }
        return null;
      })()}
    </>
  );
}
