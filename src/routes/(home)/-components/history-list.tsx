import { Suspense } from 'react';

import { useSuspenseQuery } from '@tanstack/react-query';
import {
  Box,
  Button,
  Card,
  Dialog,
  Flex,
  Skeleton,
  Text,
  TextField,
} from '@radix-ui/themes';
import { differenceInMinutes, formatDate } from 'date-fns';
import { ChevronRight, InfoIcon, Smartphone } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod/v3';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { formatTimeUntilExpiration } from '@/libs/date-utils';
import type { GetCompletedRecordingResponse } from '@/services/recording/types';
import { HomeRoute } from '@/libs/routes';
import {
  getCompletedRecordingQuery,
  useSendToMeRecordingMutation,
} from '@/services/recording/query';
import { useManualNow } from '@/stores/now';
import { formatPhoneNumber } from '@/libs/phone-validation';

function HistoryList() {
  return (
    <Suspense
      fallback={
        <Flex direction="column" gap="2">
          <HistoryItemSkeleton />
          <HistoryItemSkeleton />
        </Flex>
      }
    >
      <HistoryListContent />
    </Suspense>
  );
}

function HistoryListContent() {
  const { gymUuid, courtUuid } = HomeRoute.useSearch();
  const { data } = useSuspenseQuery(
    getCompletedRecordingQuery({
      gymUuid,
      courtUuid,
      triggeredAt: new Date().toISOString(),
    }),
  );

  if (data.length === 0) {
    return (
      <Flex my="8" mx="auto" align="center" gap="2">
        <Text color="gray" asChild>
          <InfoIcon size={20} />
        </Text>
        <Text mx="auto">녹화 기록이 없습니다.</Text>
      </Flex>
    );
  }

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
  item: GetCompletedRecordingResponse['data'][number];
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
          <SendToMeDialogButton uuid={item.uuid} />
        </Flex>
      </Flex>
    </Card>
  );
}

function HistoryItemSkeleton() {
  return (
    <Card>
      <Flex direction="column" gap="2">
        <Skeleton width="200px" height="20px" />
        <Skeleton width="100px" height="20px" />
        <Skeleton width="140px" height="20px" />
      </Flex>
    </Card>
  );
}

function ExpirationTime({ expiresAt }: { expiresAt: string }) {
  const { now } = useManualNow();
  const expirationTime = formatTimeUntilExpiration(new Date(expiresAt), now);

  return (
    <Text color="red" size="2">
      {expirationTime}
    </Text>
  );
}

type SendToMeDialogButtonProps = {
  uuid: string;
};

const sendToMeFormSchema = z.object({
  phoneNumber: z.string().min(1),
});

function SendToMeDialogButton({ uuid }: SendToMeDialogButtonProps) {
  const navigate = useNavigate();
  const { sendToMeDialogId } = HomeRoute.useSearch();
  const { gymUuid, courtUuid } = HomeRoute.useSearch();
  const { control, handleSubmit } = useForm<z.infer<typeof sendToMeFormSchema>>(
    {
      resolver: zodResolver(sendToMeFormSchema),
      defaultValues: {
        phoneNumber: '',
      },
    },
  );

  const { mutate } = useSendToMeRecordingMutation();
  const onSubmit = (data: z.infer<typeof sendToMeFormSchema>) => {
    mutate(
      {
        uuid,
        gymUuid,
        courtUuid,
        triggeredAt: new Date().toISOString(),
        phoneNumber: data.phoneNumber.replaceAll(' ', ''),
      },
      {
        onSuccess: () => {
          navigate({
            to: '.',
            search: { sendToMeDialogId: undefined },
            replace: true,
          });
          toast.success('나에게 보내기 성공!');
        },
      },
    );
  };

  const onDialogOpenChange = (open: boolean) => {
    if (open) {
      navigate({ to: '.', search: { sendToMeDialogId: uuid } });
    } else {
      navigate({
        to: '.',
        search: { sendToMeDialogId: undefined },
        replace: true,
      });
    }
  };

  return (
    <Dialog.Root
      open={sendToMeDialogId === uuid}
      onOpenChange={onDialogOpenChange}
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
                  placeholder="휴대폰 번호"
                  maxLength={13}
                  {...field}
                  onChange={(e) => {
                    const value = e.currentTarget.value;
                    field.onChange(formatPhoneNumber(value));
                  }}
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
