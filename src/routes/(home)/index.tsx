import { Suspense } from 'react';

import { Flex } from '@radix-ui/themes';
import { createFileRoute } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import { z } from 'zod/v3';

import { GymSection } from './-components/sections/gmy-info-section';
import { RecordingSection } from './-components/sections/recording-section';
import { RecordingHistorySection } from './-components/sections/recording-history-section';
import { useSseEvent } from './-hook/use-sse-event';

import { useAutoInvalidation } from '@/hooks/use-auto-invalidation';

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
    <>
      <Flex direction="column">
        <GymSection />

        <RecordingSection />

        <RecordingHistorySection />
      </Flex>
      <Suspense>
        <AutoInvalidationPresence />
      </Suspense>
    </>
  );
}

function AutoInvalidationPresence() {
  useAutoInvalidation();
  return null;
}
