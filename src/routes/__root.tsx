import { Container } from '@radix-ui/themes';
import { Outlet, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

export const Route = createRootRoute({
  component: Root,
});

function Root() {
  return (
    <Container width="100%" maxWidth="600px" p="4">
      <Outlet />
      <TanStackRouterDevtools />
    </Container>
  );
}
