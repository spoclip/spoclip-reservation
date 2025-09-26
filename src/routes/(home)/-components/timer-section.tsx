import { Flex, Text } from '@radix-ui/themes';
import { useSuspenseQueries } from '@tanstack/react-query';
import { formatDate, isAfter } from 'date-fns';

import { useNow } from '@/hooks/use-now';
import { getCurrentRecordingEndDate } from '@/libs/recording';
import { HomeRoute } from '@/libs/routes';
import { getCourtQuery, getGymQuery } from '@/services/gym';
import { useManualNow } from '@/stores/now';
import { useRecordingInfoQuery } from '../-hook/use-recording-info-query';

export default function Timer() {
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
    <Text size="7" weight="bold">
      {formatDate(now, 'HH:mm:ss')}
    </Text>
  );
}

function EndTimer() {
  const { now } = useNow({ interval: 1000 });
  const { currentRecordingEndDate } = useRecordingInfoQuery();

  const isAfterOperationEnd = isAfter(now, currentRecordingEndDate);

  return (
    <Text
      size="7"
      weight="bold"
      style={{ color: isAfterOperationEnd ? 'var(--gray-8)' : 'inherit' }}
    >
      {formatDate(currentRecordingEndDate, 'HH:mm:ss')}
    </Text>
  );
}
