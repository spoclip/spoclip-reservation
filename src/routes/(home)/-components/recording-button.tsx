import { Box, Button } from '@radix-ui/themes';

import { useRecordingInfoQuery } from '@/routes/(home)/-hook/use-recording-info-query';
import { isOverHalfInterval } from '@/libs/recording';
import { useManualNow } from '@/stores/now';

function RecordingButton() {
  const { now } = useManualNow();
  const { gym, court, baseInfo } = useRecordingInfoQuery();

  const isOverHalfTime = isOverHalfInterval({
    now: now,
    recordingIntervalInMinute: court.recordingInterval,
    operatingStartHour: gym.todayOperatingTime.openHour,
    operatingEndHour: gym.todayOperatingTime.closeHour,
  });

  if (baseInfo?.isRecording) return;

  return (
    <Box flexGrow="1" asChild>
      <Button type="submit" size="4" disabled={isOverHalfTime}>
        녹화하기
      </Button>
    </Box>
  );
}

export default RecordingButton;
