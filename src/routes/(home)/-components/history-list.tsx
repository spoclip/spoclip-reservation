import { getRecordingHistoryQuery } from '@/services/recording/query';
import { useSuspenseQuery } from '@tanstack/react-query';
import { HomeRoute } from '@/libs/routes';
import type { GetRecordingHistoryResponse } from '@/services/recording/types';
import {
  Box,
  Button,
  Card,
  Dialog,
  Flex,
  Text,
  TextField,
} from '@radix-ui/themes';
import { differenceInMinutes, formatDate } from 'date-fns';
import { useNow } from '@/hooks/use-now';
import { formatTimeUntilExpiration } from '@/libs/date-utils';
import { ChevronRight, Phone, Smartphone } from 'lucide-react';
import { Icon } from '@radix-ui/themes/components/callout';

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
          <SendToMeDialogButton />
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

function SendToMeDialogButton() {
  return (
    <Dialog.Root>
      <Box asChild>
        <Dialog.Trigger>
          <Button type="button" variant="soft" size="3">
            나에게 보내기 <ChevronRight />
          </Button>
        </Dialog.Trigger>
      </Box>
      <Dialog.Content>
        <Dialog.Title>나에게 보내기</Dialog.Title>
        <Dialog.Description>
          <Text>전화번호를 입력해주세요.</Text>
        </Dialog.Description>
        <Box my={'5'}>
          <TextField.Root size="3" type="tel" placeholder="010-0000-0000">
            <TextField.Slot>
              <Smartphone />
            </TextField.Slot>
          </TextField.Root>
        </Box>
        <Flex justify="end" gap="2">
          <Dialog.Close>
            <Button type="button" color="red" variant="soft" size="3">
              닫기
            </Button>
          </Dialog.Close>
          <Button type="button" color="green" variant="soft" size="3">
            나에게 보내기
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}

export default HistoryList;
