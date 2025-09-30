import { memo } from 'react';

import { Callout } from '@radix-ui/themes';
import { formatDate } from 'date-fns';
import { AlertCircle } from 'lucide-react';

import { useRecordingInfoQuery } from '@/routes/(home)/-hook/use-recording-info-query';

export default memo(function RecordingInfo() {
  const { currentRecordingEndDate, baseInfo, outOfOperatingTime, isOverHalf } =
    useRecordingInfoQuery();

  return (
    <>
      {(() => {
        if (outOfOperatingTime) {
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
              <Callout.Text>
                {baseInfo.recording.userName}님이 녹화 중입니다.
              </Callout.Text>
            </Callout.Root>
          );
        }
        return null;
      })()}
    </>
  );
});
