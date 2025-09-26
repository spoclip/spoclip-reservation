import { useNow } from '@/hooks/use-now';
import { getCurrentRecordingEndDate } from '@/libs/recording';
import { HomeRoute } from '@/libs/routes';
import { getCourtQuery, getGymQuery } from '@/services/gym';
import { Flex, Text } from '@radix-ui/themes';
import { useSuspenseQueries } from '@tanstack/react-query';
import { formatDate, isAfter } from 'date-fns';

export default function Timer() {
  return (
    <Flex mx="auto" width="100%" justify="between" gap="1" align="center">
      <NowTimer />
      <Text size="5">~</Text>
      <EndTimer />
    </Flex>
  );
}

function NowTimer() {
  const { now } = useNow({ interval: 1000 });
  const { gymUuid, courtUuid } = HomeRoute.useSearch();

  const [{ data: gym }, { data: court }] = useSuspenseQueries({
    queries: [getGymQuery({ gymUuid }), getCourtQuery({ courtUuid })],
  });

  const currentRecordingEndDate = getCurrentRecordingEndDate({
    now,
    recordingIntervalInMinute: court.recordingInterval,
    operatingStartHour: gym.todayOperatingTime.openHour,
    operatingEndHour: gym.todayOperatingTime.closeHour,
  });

  const isAfterOperationEnd = isAfter(now, currentRecordingEndDate);

  const displayedDate = isAfterOperationEnd ? currentRecordingEndDate : now;

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

function EndTimer() {
  const { now } = useNow({ interval: 1000 });
  const { courtUuid, gymUuid } = HomeRoute.useSearch();
  const [{ data: court }, { data: gym }] = useSuspenseQueries({
    queries: [getCourtQuery({ courtUuid }), getGymQuery({ gymUuid })],
  });

  const nextRecordingEndDate = getCurrentRecordingEndDate({
    now,
    recordingIntervalInMinute: court.recordingInterval,
    operatingStartHour: gym.todayOperatingTime.openHour,
    operatingEndHour: gym.todayOperatingTime.closeHour,
  });

  const isAfterOperationEnd = isAfter(now, nextRecordingEndDate);

  return (
    <Text
      size="7"
      weight="bold"
      style={{ color: isAfterOperationEnd ? 'var(--gray-8)' : 'inherit' }}
    >
      {formatDate(nextRecordingEndDate, 'HH:mm:ss')}
    </Text>
  );
}
