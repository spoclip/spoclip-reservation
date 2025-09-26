import {
  getRecordingHistoryQuery,
  useSendToMeRecordingMutation,
} from '@/services/recording/query';
import { useSuspenseQuery } from '@tanstack/react-query';
import { HomeRoute } from '@/libs/routes';
import type { GetRecordingHistoryResponse } from '@/services/recording/types';
import {
  Box,
  Button,
  Card,
  Dialog,
  Flex,
  Portal,
  Text,
  TextField,
} from '@radix-ui/themes';
import { differenceInMinutes, formatDate } from 'date-fns';
import { useNow } from '@/hooks/use-now';
import { formatTimeUntilExpiration } from '@/libs/date-utils';
import { ChevronRight, Smartphone } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { Controller, useForm } from 'react-hook-form';
import z from 'zod/v3';
import { zodResolver } from '@hookform/resolvers/zod';

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
          <SendToMeDialogButton
            uuid={item.uuid}
            triggerdAt={item.triggeredAt}
          />
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

type SendToMeDialogButtonProps = {
  uuid: string;
  triggerdAt: string;
};

const sendToMeFormSchema = z.object({
  phoneNumber: z.string().min(1),
});

function SendToMeDialogButton({ uuid, triggerdAt }: SendToMeDialogButtonProps) {
  const navigate = useNavigate();
  const { sendToMeDialogId } = HomeRoute.useSearch();
  const { gymUuid, courtUuid } = HomeRoute.useSearch();
  const { control, handleSubmit, watch } = useForm<
    z.infer<typeof sendToMeFormSchema>
  >({
    resolver: zodResolver(sendToMeFormSchema),
    defaultValues: {
      phoneNumber: '',
    },
  });

  const { mutate } = useSendToMeRecordingMutation();
  const onSubmit = (data: z.infer<typeof sendToMeFormSchema>) => {
    console.log(data);
    mutate({
      uuid,
      gymUuid,
      courtUuid,
      triggeredAt: new Date().toISOString(),
      phoneNumber: data.phoneNumber.replaceAll(' ', ''),
    });
  };

  return (
    <Dialog.Root
      open={sendToMeDialogId === uuid}
      onOpenChange={(open) => {
        if (open) {
          navigate({ to: '.', search: { sendToMeDialogId: uuid } });
        } else {
          navigate({
            to: '.',
            search: { sendToMeDialogId: undefined },
            replace: true,
          });
        }
      }}
    >
      <Box asChild>
        <Dialog.Trigger>
          <Button type="button" variant="soft" size="3">
            나에게 보내기 <ChevronRight />
          </Button>
        </Dialog.Trigger>
      </Box>
      <Dialog.Content>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Dialog.Title>나에게 보내기</Dialog.Title>
          <Dialog.Description>
            <Text>전화번호를 입력해주세요.</Text>
          </Dialog.Description>
          <Box my={'5'}>
            <Controller
              control={control}
              name="phoneNumber"
              render={({ field }) => (
                <TextField.Root
                  size="3"
                  type="tel"
                  placeholder="010-0000-0000"
                  {...field}
                >
                  <TextField.Slot>
                    <Smartphone />
                  </TextField.Slot>
                </TextField.Root>
              )}
            />
          </Box>
          <Flex justify="end" gap="2">
            <Dialog.Close>
              <Button type="button" color="red" variant="soft" size="3">
                닫기
              </Button>
            </Dialog.Close>
            <Button type="submit" color="green" variant="soft" size="3">
              나에게 보내기
            </Button>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}

export default HistoryList;
