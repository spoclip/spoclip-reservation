import { Suspense } from 'react';

import { Flex, Heading, Section, Skeleton } from '@radix-ui/themes';

import GymInfo from '@/routes/(home)/-components/gym-info';
import Clock from '@/routes/(home)/-components/clock';

function GymSection() {
  return (
    <Section size="1" position="relative">
      <Flex justify="between">
        <Flex direction="column" gap="3">
          <Heading as="h2" size="4">
            체육관 정보
          </Heading>
          <Suspense fallback={<Skeleton>loading...</Skeleton>}>
            <GymInfo />
          </Suspense>
        </Flex>
        <Clock />
      </Flex>
    </Section>
  );
}

export { GymSection };
