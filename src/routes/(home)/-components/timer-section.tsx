import { Flex, Text } from '@radix-ui/themes';
import { formatDate } from 'date-fns';

import { useRecordingInfoQuery } from '@/routes/(home)/-hook/use-recording-info-query';
import { useNow } from '@/hooks/use-now';

export default function Timer() {
  const { outOfOperatingTime, baseInfo, isOverHalf } = useRecordingInfoQuery();

  if (!baseInfo?.isRecording && !isOverHalf) return null;
  if (outOfOperatingTime) return null;

  return (
    <Flex mx="auto" width="100%" justify="between" gap="1" align="center">
      <StartTimer />
      <Text size="5">~</Text>
      <EndTimer />
    </Flex>
  );
}

function StartTimer() {
  const { baseInfo } = useRecordingInfoQuery();

  if (!baseInfo?.isRecording) return <NowTimer />;

  return (
    <Text size="7" weight="bold">
      {formatDate(baseInfo?.recording.triggeredAt, 'HH시 mm분')}
    </Text>
  );
}

function NowTimer() {
  const { now } = useNow({ interval: 1000 });
  return (
    <Text size="6" weight="bold">
      {formatDate(now, 'HH시 mm분')}
    </Text>
  );
}

function EndTimer() {
  const { currentRecordingEndDate } = useRecordingInfoQuery();

  return (
    <Text size="6" weight="bold">
      {formatDate(currentRecordingEndDate, 'HH시 mm분')}
    </Text>
  );
}
