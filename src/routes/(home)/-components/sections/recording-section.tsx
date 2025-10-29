import { Suspense } from 'react';

import { Flex, Heading, Section, Skeleton } from '@radix-ui/themes';

import Clock from '@/routes/(home)/-components/clock';
import Timer from '@/routes/(home)/-components/timer-section';
import ReservationFormProvider from '@/routes/(home)/-components/reservation-form-provider';
import PhoneNumberInputSection from '@/routes/(home)/-components/phone-number-input-section';
import RecordingButton from '@/routes/(home)/-components/recording-button';
import OutOfOperatingTimeCallout from '@/routes/(home)/-components/out-of-operating-time-callout';

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
        <OutOfOperatingTimeCallout />
        <Clock />
        <Timer />

        <ReservationFormProvider>
          <Flex direction="column" gap="2">
            <PhoneNumberInputSection />
            <RecordingButton />
          </Flex>
        </ReservationFormProvider>
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
            <Skeleton width="100px" height="20px" />
            <Skeleton width="100%" height="50px" />
          </Flex>
        </Section>
      }
    >
      {children}
    </Suspense>
  );
}

export { RecordingSection, RecordingSectionSuspense };
