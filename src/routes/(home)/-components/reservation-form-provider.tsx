import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { set } from 'date-fns';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { isAxiosError } from 'axios';
import { APIErrorResponse } from 'spoclip-kit';
import { useLocation, useNavigate } from '@tanstack/react-router';

import { useRecordingInfoQuery } from '@/routes/(home)/-hook/use-recording-info-query';
import {
  createRecordingFormSchema,
  type CreateRecordingFormSchema,
} from '@/routes/(home)/-types/recording';
import { createRecordingMutationOptions } from '@/services/recording/query';
import type { CreateRecordingRequest } from '@/services/recording/types';
import {
  getCurrentRecordingEndDate,
  getCurrentRecordingStartDate,
} from '@/libs/recording';
import { OperatingDays } from '@/services/gym/enum';
import { HomeRoute } from '@/libs/routes';
import { recordingQueryKeys } from '@/services/recording';

function ReservationFormProvider({ children }: { children: React.ReactNode }) {
  const { courtUuid, gymUuid } = HomeRoute.useSearch();
  const form = useForm<CreateRecordingFormSchema>({
    defaultValues: {
      phoneNumber: '',
    },
    resolver: zodResolver(createRecordingFormSchema),
    mode: 'onChange',
  });

  const location = useLocation();
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { mutate: createRecording } = useMutation({
    ...createRecordingMutationOptions,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: recordingQueryKeys.baseInfos(),
      });
      toast.success('녹화 요청이 완료되었습니다.');
      form.reset();
    },

    onError: (error) => {
      const isAxiosErrorResponse = isAxiosError<APIErrorResponse>(error);

      const errorMessage = isAxiosErrorResponse
        ? error.response?.data.error.message
        : error.message;

      if (isAxiosErrorResponse && error.response?.data.code === 404) {
        toast.error('스포클립 회원만 이용가능해요.', {
          action: {
            label: '회원가입 하기',
            onClick: () => {
              const loginPageUrl = new URL(`https://www.spoclip.ai`);
              loginPageUrl.searchParams.set(
                'prevPathInfo',
                encodeURIComponent(location.url),
              );
              navigate({ href: loginPageUrl.toString() });
            },
          },
        });
        return;
      }
      toast.error(errorMessage);
    },
  });

  const { court, gym } = useRecordingInfoQuery();

  const onSubmit = (data: CreateRecordingFormSchema) => {
    if (!court?.recordingInterval || !gym?.operatingHours) {
      throw new Error('Court recording interval is not found');
    }

    const now = new Date();

    const operationHour = gym.operatingHours.find(
      (hour) => hour.day === OperatingDays[now.getDay()],
    );
    const operatingStartHour = Number(operationHour?.openTime.split(':')[0]);
    const operatingEndHour = Number(operationHour?.closeTime.split(':')[0]);

    const currentRecordingStartDate = getCurrentRecordingStartDate({
      now,
      recordingIntervalInMinute: court.recordingInterval,
      operatingStartHour: operatingStartHour,
      operatingEndHour: operatingEndHour,
    });

    const currentRecordingEndDate = getCurrentRecordingEndDate({
      now,
      recordingIntervalInMinute: court.recordingInterval,
      operatingStartHour: operatingStartHour,
      operatingEndHour: operatingEndHour,
    });

    const flooredTriggerdAt = set(now, { seconds: 0, milliseconds: 0 });

    const requestData: CreateRecordingRequest = {
      date: now.toISOString(),
      startTime: currentRecordingStartDate.toISOString(),
      endTime: currentRecordingEndDate.toISOString(),
      gymUuid,
      courtUuid,
      triggeredAt: flooredTriggerdAt.toISOString(),
      phoneNumber: data.phoneNumber.replaceAll(' ', ''),
    };
    createRecording(requestData);
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, () => {})}>{children}</form>
    </FormProvider>
  );
}

export default ReservationFormProvider;
