import { getRecordingHistoryQuery } from '@/services/recording/query';
import { useSuspenseQuery } from '@tanstack/react-query';
import { HomeRoute } from '@/libs/routes';
import type { GetRecordingHistoryResponse } from '@/services/recording/types';
import { Box, Button, Card, Flex, Text } from '@radix-ui/themes';
import { differenceInMinutes, formatDate } from 'date-fns';
import { useNow } from '@/hooks/use-now';
import { formatTimeUntilExpiration } from '@/libs/date-utils';
import { ChevronRight } from 'lucide-react';

function HistoryList() {
  const { gymUuid, courtUuid } = HomeRoute.useSearch();
  const { data } = useSuspenseQuery(
    getRecordingHistoryQuery({
      gymUuid,
      courtUuid,
      triggeredAt: new Date().toISOString(),
    }),
  );

  return (
    <div>
      {data.map((item) => (
        <HistoryItem key={item.uuid} item={item} />
      ))}
    </div>
  );
}

function HistoryItem({
  item,
}: {
  item: GetRecordingHistoryResponse['data'][number];
}) {
  return (
    <Card>
      <Flex justify="between">
        <Flex direction="column" gap="2" width="100%">
          <Flex justify="between" align="end">
            <Text size="3">{formatDate(item.date, 'yyyy년 MM월 dd일')}</Text>
            <Text>{item.userName}</Text>
          </Flex>
          <Text size="3" weight="bold">
            {formatDate(item.startTime, 'HH:mm')} ~{' '}
            {formatDate(item.endTime, 'HH:mm')}{' '}
            {`(${differenceInMinutes(item.endTime, item.startTime)}분)`}
          </Text>
          <ExpirationTime expiresAt={item.expiresAt} />
          <Box asChild>
            <Button variant="soft" size="3">
              나에게 보내기 <ChevronRight />
            </Button>
          </Box>
        </Flex>
      </Flex>
    </Card>
  );
}

function ExpirationTime({ expiresAt }: { expiresAt: string }) {
  const { now } = useNow();
  const expirationTime = formatTimeUntilExpiration(new Date(expiresAt), now);

  return (
    <Text color="red" size="2">
      {expirationTime}
    </Text>
  );
}

export default HistoryList;
