import { Flex, Text } from '@radix-ui/themes';
import { formatDate } from 'date-fns';

import useRecordingTimeQuery from '@/routes/(home)/-hook/use-recording-time';

export default function Timer() {
  return (
    <Flex mx="auto" width="100%" justify="between" gap="1" align="center">
      <StartTimer />
      <Text size="4">~</Text>
      <EndTimer />
    </Flex>
  );
}

function StartTimer() {
  const { currentRecordingStartDate } = useRecordingTimeQuery();
  return (
    <Text size="6" weight="bold">
      {formatDate(currentRecordingStartDate, 'HH시 mm분')}
    </Text>
  );
}

function EndTimer() {
  const { currentRecordingEndDate } = useRecordingTimeQuery();

  return (
    <Text size="6" weight="bold">
      {formatDate(currentRecordingEndDate, 'HH시 mm분')}
    </Text>
  );
}
