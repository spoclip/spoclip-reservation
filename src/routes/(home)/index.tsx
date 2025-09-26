import { Suspense } from 'react';

import { Flex, Heading, Section } from '@radix-ui/themes';
import { createFileRoute } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import { z } from 'zod/v3';

import PhoneNumberInputSection from './-components/phone-number-input-section';
import ReservationFormProvider from './-components/reservation-form-provider';
import Timer from './-components/timer-section';
import GymInfo from './-components/gym-info';
import RecordingProgress from './-components/progress';
import RecordingInfo from './-components/recording-info';
import HistoryList from './-components/history-list';
import RecordingCancelButton from './-components/recording-cancel-button';

const searchSchema = z.object({
  sendToMeDialogId: z.string().optional(),
});

export const Route = createFileRoute('/(home)/')({
  component: RouteComponent,
  validateSearch: zodValidator(searchSchema),
});

function RouteComponent() {
  return (
    <ReservationFormProvider>
      <Flex direction="column">
        <Section size="1">
          <Flex direction="column" gap="3">
            <Heading as="h2" size="4">
              체육관 정보
            </Heading>
            <GymInfo />
          </Flex>
        </Section>

        <Suspense>
          <RecordingSection />
        </Suspense>

        <Suspense>
          <RecordingHistorySection />
        </Suspense>
      </Flex>
    </ReservationFormProvider>
  );
}

function RecordingSection() {
  return (
    <Section size="1">
      <Flex direction="column" gap="3">
        <Heading as="h2" size="4">
          녹화
        </Heading>
        <RecordingInfo />
        <Timer />
        <RecordingProgress />

        <PhoneNumberInputSection />

        <RecordingCancelButton />
      </Flex>
    </Section>
  );
}

function RecordingHistorySection() {
  return (
    <Section size="1">
      <Flex direction="column" gap="3">
        <Heading as="h2" size="4">
          녹화 기록
        </Heading>
        <HistoryList />
      </Flex>
    </Section>
  );
}
