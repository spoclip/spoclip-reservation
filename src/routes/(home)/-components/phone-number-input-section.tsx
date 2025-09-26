import { Box, TextField } from '@radix-ui/themes';
import { Controller, useFormContext } from 'react-hook-form';
import { Smartphone } from 'lucide-react';

import { useRecordingInfoQuery } from '@/routes/(home)/-hook/use-recording-info-query';
import type { CreateRecordingFormSchema } from '@/routes/(home)/-types/recording';
import { isOverHalfInterval } from '@/libs/recording';
import { useManualNow } from '@/stores/now';

function PhoneNumberInputSection() {
  const form = useFormContext<CreateRecordingFormSchema>();
  const { now } = useManualNow();
  const { baseInfo, court, gym } = useRecordingInfoQuery();
  const isRecording = baseInfo?.isRecording;

  const isOverHalf = isOverHalfInterval({
    now,
    recordingIntervalInMinute: court.recordingInterval,
    operatingStartHour: gym.todayOperatingTime.openHour,
    operatingEndHour: gym.todayOperatingTime.closeHour,
  });

  if (isRecording || isOverHalf) return null;

  return (
    <Controller
      control={form.control}
      name="phoneNumber"
      render={({ field }) => (
        <Box mx="auto" width="100%">
          <TextField.Root
            type="tel"
            variant="soft"
            size="3"
            placeholder="010-0000-0000"
            {...field}
          >
            <TextField.Slot>
              <Smartphone />
            </TextField.Slot>
          </TextField.Root>
        </Box>
      )}
    />
  );
}

export default PhoneNumberInputSection;
