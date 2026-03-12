import { applyWSSHandler } from '@trpc/server/adapters/ws';
import { WebSocketServer } from 'ws';
import { appRouter } from './app.router';
import { verifyToken } from './trpc';
import { Server } from 'http';

export function setupWS(server: Server) {
  const wss = new WebSocketServer({ server });

  const handler = applyWSSHandler({
    wss,
    router: appRouter,
    createContext: async (opts) => {
      const { info } = opts;
      // @ts-expect-error - info.connectionParams is unknown by default
      const token = info.connectionParams?.token as string | undefined;

      if (token) {
        const user = verifyToken(token);
        if (user) {
          return { user };
        }
      }
      return {};
    },
  });

  wss.on('connection', (ws) => {
    // @ts-expect-error - adding isAlive property
    ws.isAlive = true;
    ws.on('pong', () => {
      // @ts-expect-error - adding isAlive property
      ws.isAlive = true;
    });

    console.log(`WebSocket Connection Established (${wss.clients.size})`);

    ws.once('close', () => {
      console.log(`WebSocket Connection Closed (${wss.clients.size})`);
    });
  });

  const interval = setInterval(() => {
    wss.clients.forEach((ws) => {
      // @ts-expect-error - accessing isAlive property
      if (ws.isAlive === false) return ws.terminate();

      // @ts-expect-error - accessing isAlive property
      ws.isAlive = false;
      ws.ping();
    });
  }, 30000);

  wss.on('close', () => {
    clearInterval(interval);
  });

  return { wss, handler };
}
