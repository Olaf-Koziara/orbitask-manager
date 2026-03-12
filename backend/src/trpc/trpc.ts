import { initTRPC, TRPCError } from '@trpc/server';
import { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import superjson from 'superjson';
import { verifyAuthToken } from '../services/token.service';

// Create context type
export interface Context {
  user?: {
    id: string;
    role: string;
  };
}

export const parseAuthorizationHeader = (authorization?: string) => {
  if (!authorization) {
    return null;
  }

  const [scheme, token] = authorization.trim().split(/\s+/, 2);

  if (scheme !== 'Bearer' || !token) {
    return null;
  }

  return token;
};

export const verifyToken = (token: string) => {
  return verifyAuthToken(token);
};

// Context creator
export const createContext = async ({
  req,
}: CreateExpressContextOptions): Promise<Context> => {
  const auth = req.headers.authorization;

  if (!auth) {
    return {};
  }

  const token = parseAuthorizationHeader(auth);

  if (!token) {
    return {};
  }

  const user = verifyToken(token);

  if (user) {
    return { user };
  }

  return {};
};

// Initialize tRPC with superjson transformer
const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

// Create middleware for protected routes
export const isAuthenticated = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in to access this resource',
    });
  }
  return next({
    ctx: {
      user: ctx.user,
    },
  });
});

// Create middleware for admin routes
export const isAdmin = t.middleware(({ ctx, next }) => {
  if (!ctx.user || ctx.user.role !== 'admin') {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'You must be an admin to access this resource',
    });
  }
  return next({
    ctx: {
      user: ctx.user,
    },
  });
});

// Export procedures
export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthenticated);
export const adminProcedure = t.procedure.use(isAdmin);
