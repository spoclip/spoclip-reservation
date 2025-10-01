import { useState } from 'react';

import { Button, Dialog, Flex, Text, TextField } from '@radix-ui/themes';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod/v3';
import { zodResolver } from '@hookform/resolvers/zod';
import { Smartphone } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { addMinutes, isAfter, set } from 'date-fns';
import { toast } from 'sonner';

import { useCompleteRecordingMutation } from '@/services/recording/query';
import { useRecordingInfoQuery } from '@/routes/(home)/-hook/use-recording-info-query';
import { HomeRoute } from '@/libs/routes';
import { formatPhoneNumber, mobilePhoneSchema } from '@/libs/phone-validation';
import { recordingQueryKeys } from '@/services/recording';
import { MIN_RECORDING_DURATION_IN_MINUTES } from '@/constants/recording';
import { useIntervalNow } from '@/hooks/use-now';

const formSchema = z.object({
  phoneNumber: mobilePhoneSchema,
});
type FormSchema = z.infer<typeof formSchema>;

function RecordingCompleteButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { baseInfo, court, currentRecordingStartDate } =
    useRecordingInfoQuery();
  const { now } = useIntervalNow();

  const { gymUuid, courtUuid } = HomeRoute.useSearch();
  const { control, handleSubmit } = useForm<FormSchema>({
    defaultValues: {
      phoneNumber: '',
    },
    resolver: zodResolver(formSchema),
    mode: 'onChange',
  });
  const queryClient = useQueryClient();
  const { mutate } = useCompleteRecordingMutation();

  const onSubmit = (data: FormSchema) => {
    if (!baseInfo) return;

    const flooredTriggerdAt = set(new Date(), { seconds: 0, milliseconds: 0 });

    mutate(
      {
        uuid: baseInfo.recording.uuid,
        gymUuid,
        courtUuid,
        triggeredAt: flooredTriggerdAt.toISOString(),
        phoneNumber: data.phoneNumber.replaceAll(' ', ''),
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: recordingQueryKeys.all,
          });
          setIsOpen(false);
          toast.success('영상 가져가기 성공');
        },
      },
    );
  };

  if (!baseInfo?.isRecording) return null;

  const minimumRecordingTime = addMinutes(
    baseInfo.recording.triggeredAt,
    MIN_RECORDING_DURATION_IN_MINUTES,
  );
  const halfIntervalTime = addMinutes(
    currentRecordingStartDate,
    court.recordingInterval / 2,
  );

  const laterDate =
    minimumRecordingTime > halfIntervalTime
      ? minimumRecordingTime
      : halfIntervalTime;

  const canGetRecording = isAfter(now, laterDate);

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger>
        <Button
          type="button"
          disabled={!canGetRecording}
          variant="solid"
          size="3"
        >
          {canGetRecording
            ? '여기까지 가져가기'
            : `${laterDate.getMinutes()}분 부터 가져갈 수 있어요`}
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Dialog.Title>녹화 완료</Dialog.Title>
          <Flex gap="4" direction="column">
            <Dialog.Description>여기까지 가져가실래요?</Dialog.Description>
            <Controller
              control={control}
              name="phoneNumber"
              render={({ field, fieldState }) => (
                <Flex gap="2" direction="column">
                  <TextField.Root
                    type="tel"
                    size="3"
                    maxLength={13}
                    {...field}
                    placeholder="휴대폰 번호"
                    onChange={(e) => {
                      const value = e.currentTarget.value;
                      field.onChange(formatPhoneNumber(value));
                    }}
                  >
                    <TextField.Slot>
                      <Smartphone />
                    </TextField.Slot>
                  </TextField.Root>
                  {fieldState.error && (
                    <Text color="red" size="2">
                      {fieldState.error.message}
                    </Text>
                  )}
                </Flex>
              )}
            />

            <Flex gap="2" justify="end">
              <Dialog.Close>
                <Button
                  size="3"
                  variant="soft"
                  type="button"
                  onClick={() => {}}
                  color="gray"
                >
                  녹화 이어하기
                </Button>
              </Dialog.Close>
              <Button size="3" variant="solid" type="submit">
                영상 가져가기
              </Button>
            </Flex>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}
export default RecordingCompleteButton;
