import { Flex, Heading, Section } from '@radix-ui/themes';
import { createFileRoute } from '@tanstack/react-router';

import PhoneNumberInputSection from './-components/phone-number-input-section';
import ReservationFormProvider from './-components/reservation-form-provider';
import Timer from './-components/timer-section';
import GymInfo from './-components/gym-info';
import RecordingButton from './-components/recording-button';
import RecordingProgress from './-components/progress';
import RecordingInfo from './-components/recording-info';
import { useNow } from '@/hooks/use-now';
import { HomeRoute } from '@/libs/routes';
import { useSuspenseQueries } from '@tanstack/react-query';
import { getGymQuery } from '@/services/gym';
import { isAfter } from 'date-fns';

export const Route = createFileRoute('/(home)/')({
  component: RouteComponent,
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

        <RecordingSection />

        <RecordingHistorySection />
      </Flex>
    </ReservationFormProvider>
  );
}

function RecordingSection() {
  const { now } = useNow();
  const { gymUuid } = HomeRoute.useSearch();

  const [{ data: gym }] = useSuspenseQueries({
    queries: [getGymQuery({ gymUuid })],
  });

  const operatingEndDate = new Date();
  operatingEndDate.setHours(gym.todayOperatingTime.closeHour, 0, 0, 0);

  const isOperatingEnd = isAfter(now, operatingEndDate);

  return (
    <Section size="1">
      <Flex direction="column" gap="3">
        <Heading as="h2" size="4">
          녹화
        </Heading>
        <RecordingInfo />
        {!isOperatingEnd && <Timer />}
        {!isOperatingEnd && <RecordingProgress />}
        {!isOperatingEnd && <PhoneNumberInputSection />}
        {!isOperatingEnd && <RecordingButton />}
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
      </Flex>
    </Section>
  );
}
