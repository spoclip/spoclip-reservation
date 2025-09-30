import { z } from 'zod/v3';

import { mobilePhoneSchema } from '@/libs/phone-validation';

export const createRecordingFormSchema = z.object({
  phoneNumber: mobilePhoneSchema,
});

export type CreateRecordingFormSchema = z.infer<
  typeof createRecordingFormSchema
>;
