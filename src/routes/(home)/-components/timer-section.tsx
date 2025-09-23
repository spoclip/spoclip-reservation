import { useNow } from '@/hooks/use-now';
import { getNextRecordingEndTime } from '@/libs/recording';
import {
  MOCK_OPERAION_END_HOUR,
  MOCK_RECORDING_INTERVAL_IN_MINUTES,
} from '@/mock';
import { MOCK_OPERAION_START_HOUR } from '@/mock';
import { Flex, Text } from '@radix-ui/themes';
import { formatDate } from 'date-fns';

function TimerSection() {
  return (
    <Flex mx="auto" width="fit-content" gap="2" align="center">
      <NowTimer />
      <Text size="8">~</Text>
      <EndTimer />
    </Flex>
  );
}

function NowTimer() {
  const { now } = useNow({ interval: 1000 });
  return <Text size="8">{formatDate(now, 'HH:mm:ss')}</Text>;
}

function EndTimer() {
  const nextRecordingEndDate = getNextRecordingEndTime({
    recordingIntervalInMinute: MOCK_RECORDING_INTERVAL_IN_MINUTES,
    operationStartHour: MOCK_OPERAION_START_HOUR,
    operationEndHour: MOCK_OPERAION_END_HOUR,
  });

  return <Text size="8">{formatDate(nextRecordingEndDate, 'HH:mm:ss')}</Text>;
}

export default TimerSection;
