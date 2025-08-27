import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from './trpc';
import { User } from '../models/user.model';
import jwt from 'jsonwebtoken';
import { TRPCError } from '@trpc/server';

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const authRouter = router({
  list: protectedProcedure
    .query(async () => {
      const users = await User.find()
        .select('-password')
        .sort({ name: 1 });
      return users;
    }),

  register: publicProcedure
    .input(userSchema)
    .mutation(async ({ input }) => {
      const existingUser = await User.findOne({ email: input.email });
      if (existingUser) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'User already exists',
        });
      }

      const user = await User.create(input);
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET || 'default_secret',
        { expiresIn: '7d' }
      );

      return {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      };
    }),

  login: publicProcedure
    .input(loginSchema)
    .mutation(async ({ input }) => {
      const user = await User.findOne({ email: input.email });
      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        });
      }

      const isPasswordValid = await user.comparePassword(input.password);
      if (!isPasswordValid) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Invalid password',
        });
      }

      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET || 'default_secret',
        { expiresIn: '7d' }
      );

      return {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      };
    }),

  me: protectedProcedure
    .query(async ({ ctx }) => {
      const user = await User.findById(ctx.user.id).select('-password');
      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        });
      }
      return user;
    }),
});
