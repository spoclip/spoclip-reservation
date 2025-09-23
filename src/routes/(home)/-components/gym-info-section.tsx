import { MOCK_COURT_UUID, MOCK_GYM_UUID } from '@/mock';
import { OperationDay } from '@/services/gym/enum';
import { getCourtQuery, getGymQuery } from '@/services/gym/query';
import { Badge, Box, Flex, Skeleton, Text } from '@radix-ui/themes';
import { Callout } from '@radix-ui/themes/src/index.js';
import { useSuspenseQueries } from '@tanstack/react-query';
import { Clock, MapPin } from 'lucide-react';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

function GymInfoSection() {
  return (
    <GymInfoSectionWrapper>
      <GymInfoSectionErrorBoundary>
        <GymInfoSectionSuspense>
          <GymInfoSectionContent />
        </GymInfoSectionSuspense>
      </GymInfoSectionErrorBoundary>
    </GymInfoSectionWrapper>
  );
}

function GymInfoSectionWrapper({ children }: { children: React.ReactNode }) {
  return <Callout.Root variant="surface">{children}</Callout.Root>;
}

function GymInfoSectionSuspense({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <Callout.Text>
          <Skeleton>loading...</Skeleton>
          <Skeleton>loading...</Skeleton>
        </Callout.Text>
      }
    >
      {children}
    </Suspense>
  );
}

function GymInfoSectionErrorBoundary({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ErrorBoundary
      fallback={<Text>체육관 정보를 불러오는 중 오류가 발생했어요</Text>}
    >
      {children}
    </ErrorBoundary>
  );
}

function GymInfoSectionContent() {
  console.log('tets');
  const [gymQueryResult, courtQueryResult] = useSuspenseQueries({
    queries: [
      getGymQuery(MOCK_GYM_UUID),
      getCourtQuery({ gymUuid: MOCK_GYM_UUID, courtUuid: MOCK_COURT_UUID }),
    ],
  });

  const operationHour = gymQueryResult.data.operatingHours.find(
    (hour) => hour.day === OperationDay.MONDAY,
  );

  const courtType = courtQueryResult.data.courtType;

  return (
    <Flex direction="column" gap="2">
      <Callout.Root variant="surface">
        <Callout.Icon>
          <MapPin size={16} />
        </Callout.Icon>
        <Callout.Text size="2">{gymQueryResult.data.krName} </Callout.Text>
        <Callout.Icon>
          <Clock size={16} />
        </Callout.Icon>
        <Callout.Text size="2">
          {operationHour?.openTime} ~{operationHour?.closeTime}
        </Callout.Text>
      </Callout.Root>
      <Box>
        <Badge size="2">{courtType}</Badge>
      </Box>
    </Flex>
  );
}

export default GymInfoSection;
