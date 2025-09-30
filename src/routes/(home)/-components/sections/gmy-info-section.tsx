import { Suspense } from 'react';

import { Flex, Heading, Section, Skeleton } from '@radix-ui/themes';

import GymInfo from '@/routes/(home)/-components/gym-info';

function GymSection() {
  return (
    <Section size="1" position="relative">
      <Flex direction="column" gap="3">
        <Heading as="h2" size="4">
          체육관 정보
        </Heading>
        <Suspense
          fallback={
            <>
              <Skeleton width="100px" height="20px" />
              <Skeleton width="120px" height="20px" />
            </>
          }
        >
          <GymInfo />
        </Suspense>
      </Flex>
    </Section>
  );
}

export { GymSection };
