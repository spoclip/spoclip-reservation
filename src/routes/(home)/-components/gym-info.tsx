import { Flex, Text } from '@radix-ui/themes';
import { Callout } from '@radix-ui/themes/src/index.js';
import { useSuspenseQueries } from '@tanstack/react-query';
import { Clock, MapPin } from 'lucide-react';

import { getGymQuery } from '@/services/gym/query';
import { OperationDay } from '@/services/gym/enum';
import { HomeRoute } from '@/libs/routes';

export default function GymInfo() {
  return (
    <GymInfoSectionWrapper>
      <GymInfoSectionContent />
    </GymInfoSectionWrapper>
  );
}

function GymInfoSectionWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Flex direction="column" gap="2">
      {children}
    </Flex>
  );
}

function GymInfoSectionContent() {
  const { gymUuid } = HomeRoute.useSearch();
  const [{ data: gym }] = useSuspenseQueries({
    queries: [getGymQuery({ gymUuid })],
  });

  const operationHour = gym.operatingHours.find(
    (hour) => hour.day === OperationDay.MONDAY,
  );

  return (
    <>
      <Flex gap="2">
        <Callout.Icon>
          <MapPin size={14} />
        </Callout.Icon>
        <Text size="2">{gym.krName} </Text>
      </Flex>
      <Flex gap="2">
        <Callout.Icon>
          <Clock size={14} />
        </Callout.Icon>
        <Text size="2">
          영업 시간: {operationHour?.openTime} ~{operationHour?.closeTime}
        </Text>
      </Flex>
    </>
  );
}
