import { formatDate } from 'date-fns';
import {
  Clock10Icon,
  Clock11Icon,
  Clock12Icon,
  Clock1Icon,
  Clock2Icon,
  Clock3Icon,
  Clock4Icon,
  Clock5Icon,
  Clock6Icon,
  Clock7Icon,
  Clock8Icon,
  Clock9Icon,
} from 'lucide-react';
import { Flex, Text } from '@radix-ui/themes';

import { useNow } from '@/hooks/use-now';

function Clock() {
  const { now } = useNow();
  return (
    <Flex align="center" gap="2" direction="column">
      <DynamicClockIcon hour={now.getHours()} />
      <Text size="2">{formatDate(now, 'HH:mm:ss')}</Text>
    </Flex>
  );
}

function DynamicClockIcon({ hour }: { hour: number }) {
  const hour12 = hour % 12;

  const CLOCK_ICONS = [
    Clock1Icon,
    Clock2Icon,
    Clock3Icon,
    Clock4Icon,
    Clock5Icon,
    Clock6Icon,
    Clock7Icon,
    Clock8Icon,
    Clock9Icon,
    Clock10Icon,
    Clock11Icon,
    Clock12Icon,
  ];
  const ClockIcon = CLOCK_ICONS[hour12];

  return <ClockIcon color="gray" />;
}

export default Clock;
