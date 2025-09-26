import { memo } from 'react';

import { Callout } from '@radix-ui/themes';
import { formatDate, isAfter } from 'date-fns';
import { AlertCircle } from 'lucide-react';

import { useRecordingInfoQuery } from '@/routes/(home)/-hook/use-recording-info-query';
import { isOverHalfInterval } from '@/libs/recording';
import { useManualNow } from '@/stores/now';

export default memo(function RecordingInfo() {
  const { now } = useManualNow();
  const { gym, court, currentRecordingEndDate, baseInfo } =
    useRecordingInfoQuery();

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
        if (isOverHalf && !baseInfo?.isRecording) {
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
        if (baseInfo?.isRecording) {
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
