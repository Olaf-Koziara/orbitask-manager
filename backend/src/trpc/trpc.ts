import { initTRPC, TRPCError } from '@trpc/server';
import { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import jwt from 'jsonwebtoken';
import superjson from 'superjson';

// Create context type
export interface Context {
  user?: {
    id: string;
    role: string;
  };
}

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
      role: string;
    };
  } catch (error) {
    return null;
  }
};

// Context creator
export const createContext = async ({
  req,
}: CreateExpressContextOptions): Promise<Context> => {
  const auth = req.headers.authorization;

  if (!auth) {
    return {};
  }

  const token = auth.split(" ")[1];
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
