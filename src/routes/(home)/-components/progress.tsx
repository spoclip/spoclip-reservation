import { Progress } from '@radix-ui/themes';
import { differenceInSeconds } from 'date-fns';

import { useRecordingInfoQuery } from '@/routes/(home)/-hook/use-recording-info-query';
import { useIntervalNow } from '@/hooks/use-now';

function RecordingProgress() {
  const { now } = useIntervalNow();
  const { baseInfo, currentRecordingEndDate } = useRecordingInfoQuery();

  if (!baseInfo?.isRecording) return null;

  const max = differenceInSeconds(
    currentRecordingEndDate,
    baseInfo?.recording.triggeredAt,
  );
  const value = differenceInSeconds(now, baseInfo?.recording.triggeredAt);

  const clampedValue = Math.max(0, Math.min(value, max));

  return (
    <Progress
      value={clampedValue}
      max={max}
      style={{ height: 26 }}
      size="3"
      variant="soft"
      color="green"
      radius="small"
    />
  );
}

export default RecordingProgress;
