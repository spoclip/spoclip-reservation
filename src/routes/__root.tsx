import { Box, Container, Section, Text } from '@radix-ui/themes';
import {
  Outlet,
  SearchParamError,
  createRootRoute,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { zodValidator } from '@tanstack/zod-adapter';
import { z } from 'zod/v3';

import Header from '@/components/common/header';
import { IpRestrictionPage } from '@/components/common/ip-restriction-page';

const searchSchema = z.object({
  gymUuid: z.string(),
  courtUuid: z.string(),
});

export const Route = createRootRoute({
  component: Root,
  validateSearch: zodValidator(searchSchema),
  errorComponent: ErrorComponent,
});

function Root() {
  const IS_BLOCKED = true;

  return (
    <>
      <Header />
      <Container width="100%" maxWidth="600px" p="4" mt="7">
        {IS_BLOCKED ? <IpRestrictionPage /> : <Outlet />}
        <TanStackRouterDevtools />
      </Container>
    </>
  );
}

function ErrorComponent({ error }: { error: Error }) {
  if (error instanceof SearchParamError) {
    return (
      <Box p="4">
        <Text>
          비 정상적인 접근입니다.
          <br />
          QR 코드를 통해 접속해주세요
        </Text>
      </Box>
    );
  }
  return (
    <>
      <Header />
      <Container width="100%" maxWidth="600px" p="4" mt="7">
        <Section>
          <Text>{error.message}</Text>
        </Section>
      </Container>
    </>
  );
}
