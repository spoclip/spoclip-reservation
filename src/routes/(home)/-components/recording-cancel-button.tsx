import { useState } from 'react';

import { Button, Dialog, Flex } from '@radix-ui/themes';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Box } from '@radix-ui/themes/src/index.js';

import { useRecordingInfoQuery } from '@/routes/(home)/-hook/use-recording-info-query';
import { useCancelRecordingMutation } from '@/services/recording/query';
import { HomeRoute } from '@/libs/routes';
import { recordingQueryKeys } from '@/services/recording/key';
import { useManualNow } from '@/stores/now';

function RecordingCancelButton() {
  const { mutate: cancelRecording } = useCancelRecordingMutation();
  const { gymUuid, courtUuid } = HomeRoute.useSearch();
  const [isOpen, setIsOpen] = useState(false);

  const { updateNow } = useManualNow((state) => ({
    updateNow: state.updateNow,
  }));
  const queryClient = useQueryClient();
  const { baseInfo } = useRecordingInfoQuery();

  const onClick = () => {
    if (!baseInfo?.recording?.uuid) {
      toast.error(
        '녹화 기본 정보를 받아오는데 실패했어요.\n새로고침 후 다시 시도해주세요',
      );
      return;
    }

    cancelRecording(
      { uuid: baseInfo.recording.uuid, gymUuid, courtUuid },
      {
        onSuccess: () => {
          toast.success('녹화가 취소되었어요.');
          queryClient.invalidateQueries({
            queryKey: recordingQueryKeys.baseInfos(),
          });
          setIsOpen(false);
          updateNow();
        },
      },
    );
  };

  if (!baseInfo?.isRecording) return null;

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger>
        <Box ml="auto">
          <Button variant="soft" color="red">
            녹화 취소
          </Button>
        </Box>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>녹화 취소</Dialog.Title>
        <Dialog.Description>
          악의적으로 녹화를 취소할 시 불이익을 받을 수 있어요.
          <br />
          정말 녹화를 취소하시겠습니까?
        </Dialog.Description>
        <Flex justify="end" gap="2">
          <Dialog.Close>
            <Button variant="soft" color="gray" size="4">
              닫기
            </Button>
          </Dialog.Close>
          <Button variant="soft" color="red" size="4" onClick={onClick}>
            녹화 취소하기
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}

export default RecordingCancelButton;
