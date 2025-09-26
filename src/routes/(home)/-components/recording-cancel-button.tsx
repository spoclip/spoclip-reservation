import { Button, Dialog, Flex } from '@radix-ui/themes';
import {
  useQuery,
  useQueryClient,
  useSuspenseQueries,
} from '@tanstack/react-query';
import { toast } from 'sonner';
import { Box } from '@radix-ui/themes/src/index.js';

import {
  getRecordingBaseInfoQuery,
  useCancelRecordingMutation,
} from '@/services/recording/query';
import { HomeRoute } from '@/libs/routes';
import {
  getCurrentRecordingEndDate,
  getCurrentRecordingStartDate,
} from '@/libs/recording';
import { getCourtQuery, getGymQuery } from '@/services/gym';
import { recordingQueryKeys } from '@/services/recording/key';

function RecordingCancelButton() {
  const { mutate: cancelRecording } = useCancelRecordingMutation();
  const { gymUuid, courtUuid } = HomeRoute.useSearch();

  const queryClient = useQueryClient();
  const [{ data: gym }, { data: court }] = useSuspenseQueries({
    queries: [getGymQuery({ gymUuid }), getCourtQuery({ courtUuid })],
  });

  const startTime = getCurrentRecordingStartDate({
    now: new Date(),
    recordingIntervalInMinute: court.recordingInterval,
    operatingStartHour: gym.todayOperatingTime.openHour,
    operatingEndHour: gym.todayOperatingTime.closeHour,
  });
  const endTime = getCurrentRecordingEndDate({
    now: new Date(),
    recordingIntervalInMinute: court.recordingInterval,
    operatingStartHour: gym.todayOperatingTime.openHour,
    operatingEndHour: gym.todayOperatingTime.closeHour,
  });

  const { data: recordingBaseInfo } = useQuery(
    getRecordingBaseInfoQuery({
      gymUuid,
      courtUuid,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
    }),
  );

  const onClick = () => {
    if (!recordingBaseInfo?.uuid) {
      toast.error('녹화 기본 정보를 받아오는데 실패했어요.');
      return;
    }

    cancelRecording(
      { uuid: '0199858d-055a-7152-9eea-f4b49cfe48a1', gymUuid, courtUuid },
      {
        onSuccess: () => {
          toast.success('녹화가 취소되었어요.');
          queryClient.invalidateQueries({
            queryKey: recordingQueryKeys.active({
              gymUuid,
              courtUuid,
              startTime: startTime.toISOString(),
              endTime: endTime.toISOString(),
            }),
          });
        },
      },
    );
  };

  return (
    <Dialog.Root>
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
