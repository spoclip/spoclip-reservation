import { Box, Button } from '@radix-ui/themes';

import { useRecordingInfoQuery } from '@/routes/(home)/-hook/use-recording-info-query';

function RecordingButton() {
  const { baseInfo, isOverHalf, outOfOperatingTime } = useRecordingInfoQuery();

  if (baseInfo?.isRecording || isOverHalf || outOfOperatingTime) return;

  return (
    <Box flexGrow="1" asChild>
      <Button type="submit" size="4">
        녹화하기
      </Button>
    </Box>
  );
}

export default RecordingButton;
