import { formatDate } from 'date-fns';
import { ClockIcon } from 'lucide-react';
import { Flex, Text } from '@radix-ui/themes';

import { useIntervalNow } from '@/hooks/use-now';

function Clock() {
  const { now } = useIntervalNow();
  return (
    <Flex align="center" gap="2" justify="center">
      <DynamicClockIcon />
      <Text size="4">{formatDate(now, 'HH:mm:ss')}</Text>
    </Flex>
  );
}

function DynamicClockIcon() {
  return <ClockIcon size={16} />;
}

export default Clock;
