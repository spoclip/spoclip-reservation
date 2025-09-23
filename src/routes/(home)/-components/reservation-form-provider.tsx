import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  createRecordingFormSchema,
  type CreateRecordingFormSchema,
} from '@/routes/(home)/-types/recording';
import useCreateRecordingQuery from '@/services/recording/query';

function ReservationFormProvider({ children }: { children: React.ReactNode }) {
  const form = useForm({
    defaultValues: {
      phoneNumber: '',
      date: '',
      startTime: '',
      gymUuid: '',
      courtUuid: '',
      triggeredAt: '',
      endTime: '',
    },
    resolver: zodResolver(createRecordingFormSchema),
  });

  const { mutate: createRecording } = useCreateRecordingQuery();

  const onSubmit = (data: CreateRecordingFormSchema) => {
    createRecording(data);
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>{children}</form>
    </FormProvider>
  );
}

export default ReservationFormProvider;
