import { Box, Button, Card, Flex, Heading } from '@radix-ui/themes';
import { createFileRoute } from '@tanstack/react-router';

import PhoneNumberInputSection from './-components/phone-number-input-section';
import ReservationFormProvider from './-components/reservation-form-provider';
import TimerSection from './-components/timer-section';

export const Route = createFileRoute('/(home)/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ReservationFormProvider>
      <Flex direction="column" gap="6">
        <Heading>솔레아스</Heading>
        <Card variant="ghost">
          <Flex direction="column" gap="4">
            <Heading as="h2" size="4">
              예약하기
            </Heading>
            <PhoneNumberInputSection />
            <TimerSection />
            <Box flexGrow="1" asChild>
              <Button size="4">예약하기</Button>
            </Box>
          </Flex>
        </Card>
      </Flex>
    </ReservationFormProvider>
  );
}
