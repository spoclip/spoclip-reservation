import { Progress } from '@radix-ui/themes';
import { differenceInSeconds } from 'date-fns';

import { useRecordingInfoQuery } from '@/routes/(home)/-hook/use-recording-info-query';
import { isOverHalfInterval } from '@/libs/recording';
import { useManualNow } from '@/stores/now';

function RecordingProgress() {
  const { now } = useManualNow();
  const { court, gym, baseInfo, currentRecordingEndDate } =
    useRecordingInfoQuery();

  if (!baseInfo?.isRecording) return null;

  const max = differenceInSeconds(
    baseInfo?.recording.triggeredAt,
    currentRecordingEndDate,
  );
  const value = differenceInSeconds(now, baseInfo?.recording.triggeredAt);

  const clampedValue = Math.max(0, Math.min(value, max));

  const isOverHalf = isOverHalfInterval({
    now,
    recordingIntervalInMinute: court.recordingInterval,
    operatingStartHour: gym.todayOperatingTime.openHour,
    operatingEndHour: gym.todayOperatingTime.closeHour,
  });

  return (
    <Progress
      value={clampedValue}
      max={max}
      style={{ height: 40 }}
      size="3"
      color={isOverHalf && !court.isRecording ? 'yellow' : 'green'}
    />
  );
}

export default RecordingProgress;
