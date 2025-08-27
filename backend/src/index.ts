import express from 'express';
import cors from 'cors';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { appRouter } from './trpc/app.router';
import { createContext } from './trpc/trpc';

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
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
