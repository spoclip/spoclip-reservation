import { Suspense } from 'react';

import { Heading, Section, Skeleton, Flex } from '@radix-ui/themes';

import HistoryList from '@/routes/(home)/-components/history-list';

function RecordingHistorySection() {
  return (
    <RecordingHistorySectionSuspense>
      <RecordingHistorySectionContent />
    </RecordingHistorySectionSuspense>
  );
}

function RecordingHistorySectionContent() {
  return (
    <Flex direction="column" gap="3">
      <Heading as="h2" size="4">
        녹화 기록
      </Heading>
      <HistoryList />
    </Flex>
  );
}

function RecordingHistorySectionSuspense({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <Section size="1">
          <Flex direction="column" gap="3">
            <Heading as="h2" size="4">
              녹화 기록
            </Heading>
            <Skeleton>loading...</Skeleton>
          </Flex>
        </Section>
      }
    >
      {children}
    </Suspense>
  );
}

export { RecordingHistorySection };
