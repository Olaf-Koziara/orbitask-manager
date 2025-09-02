import { createTRPCReact } from '@trpc/react-query';
import {  httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../../../backend/src/trpc/app.router';
import { QueryClient } from '@tanstack/react-query';
import superjson from 'superjson';


export const trpc = createTRPCReact<AppRouter>();

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: 'http://localhost:5020/trpc',
      headers() {
        const token = localStorage.getItem('token');
        return {
          Authorization: token ? `Bearer ${token}` : '',
        };
      },
        transformer: superjson,

    }),
  ],
});
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

  