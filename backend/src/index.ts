import express from 'express';
import cors from 'cors';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { applyWSSHandler } from '@trpc/server/adapters/ws';
import { WebSocketServer } from 'ws';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { appRouter } from './trpc/app.router';
import { createContext, verifyToken } from './trpc/trpc';

dotenv.config();

const app = express();

// Middleware
app.use(cors({origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000', credentials: true, methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']}));
app.options('*', cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI||'' )
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));
// tRPC middleware
app.use(
  '/trpc',
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const wss = new WebSocketServer({ server });

const handler = applyWSSHandler({
  wss,
  router: appRouter,
  createContext: async (opts) => {
    const { info } = opts;
    // Client should send { token: "..." } in connectionParams
    // @ts-ignore - info.connectionParams is unknown by default
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
  console.log(`Connection (${wss.clients.size})`);
  ws.once('close', () => {
    console.log(`Connection (${wss.clients.size})`);
  });
});

process.on('SIGTERM', () => {
  handler.broadcastReconnectNotification();
  wss.close();
});
