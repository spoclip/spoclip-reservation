import { Box, Button, Flex, Heading, Section } from '@radix-ui/themes';
import { createFileRoute } from '@tanstack/react-router';

import PhoneNumberInputSection from './-components/phone-number-input-section';
import ReservationFormProvider from './-components/reservation-form-provider';
import TimerSection from './-components/timer-section';
import GymInfoSection from './-components/gym-info-section';

export const Route = createFileRoute('/(home)/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ReservationFormProvider>
      <Flex direction="column">
        <Section size="1">
          <GymInfoSection />
        </Section>

        <Section size="1">
          <Flex direction="column" gap="5">
            <Heading as="h2" size="4">
              예약하기
            </Heading>
            <TimerSection />
            <PhoneNumberInputSection />
            <Box flexGrow="1" asChild>
              <Button size="4">예약하기</Button>
            </Box>
          </Flex>
        </Section>
      </Flex>
    </ReservationFormProvider>
  );
}
