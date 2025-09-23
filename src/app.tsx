import '@radix-ui/themes/styles.css';
import '@/styles/radix-custom-palette.css';
import '@/styles/reset.css';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { Theme } from '@radix-ui/themes';

import { routeTree } from './routeTree.gen';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const queryClient = new QueryClient();

function App() {
  return (
    <Theme accentColor="green" hasBackground panelBackground="solid">
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </Theme>
  );
}

export default App;
