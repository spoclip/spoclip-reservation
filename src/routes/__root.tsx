import { Box, Container, Text } from '@radix-ui/themes';
import {
  Outlet,
  SearchParamError,
  createRootRoute,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { zodValidator } from '@tanstack/zod-adapter';
import { z } from 'zod/v3';

import { MOCK_COURT_UUID, MOCK_GYM_UUID } from '@/mock';
import Header from '@/components/common/header';

const searchSchema = z.object({
  // @todo. default value should be removed
  gymUuid: z.string().default(MOCK_GYM_UUID),
  courtUuid: z.string().default(MOCK_COURT_UUID),
});

export const Route = createRootRoute({
  component: Root,
  validateSearch: zodValidator(searchSchema),
  errorComponent: ErrorComponent,
});

function Root() {
  return (
    <>
      <Header />
      <Container width="100%" maxWidth="600px" p="4" mt="7">
        <Outlet />
        <TanStackRouterDevtools />
      </Container>
    </>
  );
}

/**
 * 자동 쿼리 무효화를 담당하는 컴포넌트
 *
 * 다음 조건에서 recording 쿼리를 자동으로 무효화합니다:
 * - 운영 시간 외: 운영 시작 시간이 지났을 때
 * - 운영 시간 내: 녹화 종료 시간이 지났을 때
 */

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
  return <div>{error.message}</div>;
}
