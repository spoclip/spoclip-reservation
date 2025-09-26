import { memo } from 'react';

import { Callout } from '@radix-ui/themes';
import { useQuery, useSuspenseQueries } from '@tanstack/react-query';
import { formatDate, isAfter } from 'date-fns';
import { AlertCircle } from 'lucide-react';

import {
  getCurrentRecordingEndDate,
  getCurrentRecordingStartDate,
  isOverHalfInterval,
} from '@/libs/recording';
import { HomeRoute } from '@/libs/routes';
import { getCourtQuery, getGymQuery } from '@/services/gym';
import { getRecordingBaseInfoQuery } from '@/services/recording/query';

export default memo(function RecordingInfo() {
  const now = new Date();

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
  const currentRecordingStartDate = getCurrentRecordingStartDate({
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

  const { data } = useQuery(
    getRecordingBaseInfoQuery({
      courtUuid,
      gymUuid,
      startTime: currentRecordingStartDate.toISOString(),
      endTime: currentRecordingEndDate.toISOString(),
    }),
  );

  // when data is undefined, it means there is no recording
  if (!data) return null;

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
        if (isOverHalf && data.recordingStatus !== 'RECORDING') {
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
        if (data.recordingStatus === 'RECORDING') {
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
});
