import { Button, Dialog, Flex, Text, TextField } from '@radix-ui/themes';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod/v3';
import { zodResolver } from '@hookform/resolvers/zod';
import { Smartphone } from 'lucide-react';

import { useCompleteRecordingMutation } from '@/services/recording/query';
import { useRecordingInfoQuery } from '@/routes/(home)/-hook/use-recording-info-query';
import { HomeRoute } from '@/libs/routes';
import { mobilePhoneSchema } from '@/libs/phone-validation';

function RecordingCompleteButton() {
  const { baseInfo, court, isOverHalf } = useRecordingInfoQuery();

  if (!baseInfo?.isRecording) return null;

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button type="button" disabled={!isOverHalf}>
          {isOverHalf
            ? '여기까지 가져가기'
            : `${court.recordingInterval / 2}분 부터 가져갈 수 있어요`}
        </Button>
      </Dialog.Trigger>
      <CompleteRecordingDialogContent />
    </Dialog.Root>
  );
}

const formSchema = z.object({
  phoneNumber: mobilePhoneSchema,
});
type FormSchema = z.infer<typeof formSchema>;

function CompleteRecordingDialogContent() {
  const { baseInfo } = useRecordingInfoQuery();

  const { gymUuid, courtUuid } = HomeRoute.useSearch();
  const { control, handleSubmit } = useForm<FormSchema>({
    defaultValues: {
      phoneNumber: '',
    },
    resolver: zodResolver(formSchema),
    mode: 'onChange',
  });
  const { mutate } = useCompleteRecordingMutation();

  const onSubmit = (data: FormSchema) => {
    if (!baseInfo) return;
    mutate({
      uuid: baseInfo.recording.uuid,
      gymUuid,
      courtUuid,
      triggeredAt: new Date().toISOString(),
      phoneNumber: data.phoneNumber.replaceAll(' ', ''),
    });
  };

  return (
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
                  size="3"
                  {...field}
                  placeholder="전화번호를 입력해주세요"
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
  );
}

export default RecordingCompleteButton;
