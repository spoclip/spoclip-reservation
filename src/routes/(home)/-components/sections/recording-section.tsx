import { Suspense } from 'react';

import { Flex, Heading, Section, Skeleton } from '@radix-ui/themes';

import RecordingInfo from '@/routes/(home)/-components/recording-info';
import Timer from '@/routes/(home)/-components/timer-section';
import RecordingProgress from '@/routes/(home)/-components/progress';
import ReservationFormProvider from '@/routes/(home)/-components/reservation-form-provider';
import PhoneNumberInputSection from '@/routes/(home)/-components/phone-number-input-section';
import RecordingButton from '@/routes/(home)/-components/recording-button';
import RecordingCancelButton from '@/routes/(home)/-components/recording-cancel-button';
import RecordingCompleteButton from '@/routes/(home)/-components/recording-complete-button';

function RecordingSection() {
  return (
    <RecordingSectionSuspense>
      <RecordingSectionContent />
    </RecordingSectionSuspense>
  );
}

function RecordingSectionContent() {
  return (
    <Section size="1">
      <Flex direction="column" gap="3">
        <Heading as="h2" size="4">
          녹화
        </Heading>
        <RecordingInfo />
        <Timer />
        <RecordingProgress />

        <ReservationFormProvider>
          <Flex direction="column" gap="2">
            <PhoneNumberInputSection />
            <RecordingButton />
          </Flex>
        </ReservationFormProvider>
        <Flex gap="2" justify="end">
          <RecordingCancelButton />
          <RecordingCompleteButton />
        </Flex>
      </Flex>
    </Section>
  );
}

function RecordingSectionSuspense({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <Section size="1">
          <Flex direction="column" gap="3">
            <Heading as="h2" size="4">
              녹화
            </Heading>
            <Skeleton>loading...</Skeleton>
            <Skeleton>loading...</Skeleton>
          </Flex>
        </Section>
      }
    >
      {children}
    </Suspense>
  );
}

export { RecordingSection, RecordingSectionSuspense };
