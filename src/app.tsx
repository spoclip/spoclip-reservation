import '@radix-ui/themes/styles.css';
import '@/styles/radix-custom-palette.css';
import '@/styles/reset.css';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { Theme } from '@radix-ui/themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { toast, Toaster } from 'sonner';
import { AxiosError } from 'axios';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { routeTree } from './routeTree.gen';

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      staleTime: 1000,
    },
    mutations: {
      onError: (error) => {
        const isAxiosError = error instanceof AxiosError;
        const errorMessage = isAxiosError
          ? error.response?.data.error.message
          : error.message;
        toast.error(errorMessage ?? '알 수 없는 에러 발생');
      },
    },
  },
});

function App() {
  return (
    <Theme accentColor="green" hasBackground panelBackground="solid">
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
      <Toaster />
    </Theme>
  );
}

export default App;
