import { useNow } from '@/hooks/use-now';
import { getCurrentRecordingEndDate } from '@/libs/recording';
import { HomeRoute } from '@/libs/routes';
import { getCourtQuery, getGymQuery } from '@/services/gym';
import { Callout } from '@radix-ui/themes';
import { useSuspenseQueries } from '@tanstack/react-query';
import { isAfter } from 'date-fns';
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
    operationStartHour: gym.todayOperatingTime.openHour,
    operationEndHour: gym.todayOperatingTime.closeHour,
  });

  const isAfterOperationEnd = isAfter(now, currentRecordingEndDate);
  return (
    <>
      {isAfterOperationEnd && (
        <Callout.Root color="red">
          <Callout.Icon>
            <AlertCircle size={16} />
          </Callout.Icon>
          <Callout.Text>영업 시간 외 녹화는 불가능합니다.</Callout.Text>
        </Callout.Root>
      )}
    </>
  );
}
