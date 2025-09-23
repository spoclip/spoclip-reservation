import { z } from 'zod/v3';

export const createRecordingFormSchema = z.object({
  date: z.string(),
  startTime: z.string(),
  phoneNumber: z.string(),
  gymUuid: z.string(),
  courtUuid: z.string(),
  triggeredAt: z.string(),
  endTime: z.string(),
});

export type CreateRecordingFormSchema = z.infer<
  typeof createRecordingFormSchema
>;
