import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../../../backend/src/trpc/app.router';

export const trpc = createTRPCReact<AppRouter>();

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: 'http://localhost:5000/trpc',
      // Add headers with authentication token
      headers() {
        const token = localStorage.getItem('token');
        return {
          Authorization: token ? `Bearer ${token}` : '',
        };
      },
    }),
  ],
});
