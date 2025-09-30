import { Flex, Text } from '@radix-ui/themes';
import { formatDate, isAfter } from 'date-fns';

import { useRecordingInfoQuery } from '@/routes/(home)/-hook/use-recording-info-query';
import { useNow } from '@/hooks/use-now';
import { useManualNow } from '@/stores/now';

export default function Timer() {
  const { outOfOperatingTime } = useRecordingInfoQuery();

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
  const { now } = useManualNow();
  const { baseInfo, currentRecordingEndDate } = useRecordingInfoQuery();

  const isAfterOperationEnd = isAfter(now, currentRecordingEndDate);

  const displayedDate = isAfterOperationEnd ? currentRecordingEndDate : now;

  if (!baseInfo?.isRecording) return <NowTimer />;

  return (
    <Text
      size="7"
      weight="bold"
      style={{ color: isAfterOperationEnd ? 'var(--gray-8)' : 'inherit' }}
    >
      {formatDate(displayedDate, 'HH:mm:ss')}
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
