import { Box, TextField } from '@radix-ui/themes';
import { Controller, useFormContext } from 'react-hook-form';

import type { CreateRecordingFormSchema } from '@/routes/(home)/-types/recording';
import { Smartphone } from 'lucide-react';

function PhoneNumberInputSection() {
  const form = useFormContext<CreateRecordingFormSchema>();

  return (
    <Controller
      control={form.control}
      name="phoneNumber"
      render={({ field }) => (
        <Box mx="auto" width="100%">
          <TextField.Root
            type="tel"
            variant="soft"
            disabled
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
