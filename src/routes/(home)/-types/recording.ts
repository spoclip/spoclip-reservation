import { z } from 'zod/v3';

export const createRecordingFormSchema = z.object({
  phoneNumber: z.string().min(1),
});

export type CreateRecordingFormSchema = z.infer<
  typeof createRecordingFormSchema
>;
