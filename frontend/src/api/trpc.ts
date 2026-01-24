import { QueryClient } from "@tanstack/react-query";
import {
  createWSClient,
  httpBatchLink,
  splitLink,
  wsLink,
} from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import superjson from "superjson";
import type { AppRouter } from "@backend/trpc/app.router";

export const trpc = createTRPCReact<AppRouter>();

const getEndingLink = () => {
  const httpUrl =
    import.meta.env.VITE_TRPC_API_URL || "http://localhost:5000/trpc";
  const wsUrl = httpUrl.replace(/^http/, "ws");

  const wsClient = createWSClient({
    url: wsUrl,
    connectionParams: () => {
      const token = localStorage.getItem("token");
      return {
        token,
      };
    },
  });

  return splitLink({
    condition: (op) => op.type === "subscription",
    true: wsLink({
      client: wsClient,
      transformer: superjson,
    }),
    false: httpBatchLink({
      url: httpUrl,
      headers() {
        const token = localStorage.getItem("token");
        return {
          Authorization: token ? `Bearer ${token}` : "",
        };
      },
      transformer: superjson,
    }),
  });
};

export const trpcClient = trpc.createClient({
  links: [getEndingLink()],
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
