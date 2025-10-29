import { Box, Button } from '@radix-ui/themes';

function RecordingButton() {
  return (
    <Box flexGrow="1" asChild>
      <Button type="submit" size="4">
        녹화 요청 하기
      </Button>
    </Box>
  );
}

export default RecordingButton;
