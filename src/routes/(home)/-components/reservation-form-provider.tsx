import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { set } from 'date-fns';
import { useQueryClient } from '@tanstack/react-query';

import { useRecordingInfoQuery } from '@/routes/(home)/-hook/use-recording-info-query';
import {
  createRecordingFormSchema,
  type CreateRecordingFormSchema,
} from '@/routes/(home)/-types/recording';
import { useCreateRecordingQuery } from '@/services/recording/query';
import type { CreateRecordingRequest } from '@/services/recording/types';
import {
  getCurrentRecordingEndDate,
  getCurrentRecordingStartDate,
} from '@/libs/recording';
import { OperatingDays } from '@/services/gym/enum';
import { HomeRoute } from '@/libs/routes';
import { recordingQueryKeys } from '@/services/recording';
import { useManualNow } from '@/stores/now';

function ReservationFormProvider({ children }: { children: React.ReactNode }) {
  const { courtUuid, gymUuid } = HomeRoute.useSearch();
  const form = useForm<CreateRecordingFormSchema>({
    defaultValues: {
      phoneNumber: '',
    },
    resolver: zodResolver(createRecordingFormSchema),
    mode: 'onChange',
  });

  const { mutate: createRecording } = useCreateRecordingQuery();
  const queryClient = useQueryClient();
  const { updateNow } = useManualNow((state) => ({
    updateNow: state.updateNow,
  }));

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
    createRecording(requestData, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: recordingQueryKeys.baseInfos(),
        });
        updateNow();
      },
    });
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, () => {})}>{children}</form>
    </FormProvider>
  );
}

export default ReservationFormProvider;
