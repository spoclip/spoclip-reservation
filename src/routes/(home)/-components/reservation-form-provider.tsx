import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

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
import { useQueries, useQueryClient } from '@tanstack/react-query';
import { getCourtQuery, getGymQuery } from '@/services/gym';
import { OperationDays } from '@/services/gym/enum';
import { HomeRoute } from '@/libs/routes';

function ReservationFormProvider({ children }: { children: React.ReactNode }) {
  const { courtUuid, gymUuid } = HomeRoute.useSearch();
  const form = useForm({
    defaultValues: {
      phoneNumber: '',
    },
    resolver: zodResolver(createRecordingFormSchema),
  });

  const { mutate: createRecording } = useCreateRecordingQuery();
  const queryClient = useQueryClient();

  const [{ data: court }, { data: gym }] = useQueries({
    queries: [getCourtQuery({ courtUuid }), getGymQuery({ gymUuid })],
  });

  const onSubmit = (data: CreateRecordingFormSchema) => {
    console.log(data);
    if (!court?.recordingInterval || !gym?.operatingHours) {
      throw new Error('Court recording interval is not found');
    }

    const now = new Date();

    const operationHour = gym.operatingHours.find(
      (hour) => hour.day === OperationDays[now.getDay()],
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

    const requestData: CreateRecordingRequest = {
      date: now.toISOString(),
      startTime: currentRecordingStartDate.toISOString(),
      endTime: currentRecordingEndDate.toISOString(),
      gymUuid,
      courtUuid,
      triggeredAt: now.toISOString(),
      phoneNumber: data.phoneNumber.replaceAll(' ', ''),
    };
    createRecording(requestData, {
      onSuccess: () => {
        // @todo. 녹화 정보 API Query key로 수정 필요
        queryClient.invalidateQueries({
          queryKey: getCourtQuery({ courtUuid }).queryKey,
        });
      },
    });
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, (errors) => {
          console.log(errors);
        })}
      >
        {children}
      </form>
    </FormProvider>
  );
}

export default ReservationFormProvider;
