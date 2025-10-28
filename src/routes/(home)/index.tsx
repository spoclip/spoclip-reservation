import { Flex } from '@radix-ui/themes';
import { createFileRoute } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import { z } from 'zod/v3';

import { GymSection } from './-components/sections/gmy-info-section';
import { RecordingSection } from './-components/sections/recording-section';
import { useSseEvent } from './-hook/use-sse-event';

const searchSchema = z.object({
  sendToMeDialogId: z.string().optional(),
});

export const Route = createFileRoute('/(home)/')({
  component: RouteComponent,
  validateSearch: zodValidator(searchSchema),
});

function RouteComponent() {
  useSseEvent();
  return (
    <Flex direction="column">
      <GymSection />

      <RecordingSection />
    </Flex>
  );
}
