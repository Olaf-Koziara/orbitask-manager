import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { Project } from '../models/project.model';
import { User } from '../models/user.model';
import { signAuthToken } from '../services/token.service';
import { buildSafeSearchRegex } from '../utils/search.utils';
import { adminProcedure, protectedProcedure, publicProcedure, router } from './trpc';

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const updateProfileSchema = z.object({
  name: z.string().min(1).trim(),
  email: z.string().email(),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6),
});

const deleteAccountSchema = z.object({
  password: z.string().min(1),
});

const peoplePickerSchema = z
  .object({
    search: z.string().trim().max(100).optional(),
  })
  .optional();

export const authRouter = router({
  list: adminProcedure
    .query(async () => {
      const users = await User.find()
        .select('-password')
        .sort({ name: 1 })
        .lean();
      return users;
    }),

  peoplePicker: protectedProcedure
    .input(peoplePickerSchema)
    .query(async ({ ctx, input }) => {
      const userIds = new Set<string>([ctx.user.id]);
      const projectQuery =
        ctx.user.role === 'admin'
          ? {}
          : { $or: [{ createdBy: ctx.user.id }, { participants: ctx.user.id }] };

      const accessibleProjects = await Project.find(projectQuery)
        .select('createdBy participants')
        .lean();

      accessibleProjects.forEach((project) => {
        userIds.add(project.createdBy.toString());
        project.participants.forEach((participant) => {
          userIds.add(participant.toString());
        });
      });

      const searchRegex = buildSafeSearchRegex(input?.search);
      const users = await User.find({
        _id: { $in: Array.from(userIds) },
        ...(searchRegex
          ? {
              name: { $regex: searchRegex },
            }
          : {}),
      })
        .select('name avatarUrl')
        .sort({ name: 1 })
        .lean();

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
      const token = signAuthToken({ id: user._id.toString(), role: user.role });

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

      const token = signAuthToken({ id: user._id.toString(), role: user.role });

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

  updateProfile: protectedProcedure
    .input(updateProfileSchema)
    .mutation(async ({ ctx, input }) => {
      const { id } = ctx.user;

      // Check if email is already taken by another user
      if (input.email) {
        const existingUser = await User.findOne({ 
          email: input.email, 
          _id: { $ne: id } 
        });
        if (existingUser) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'Email is already taken',
          });
        }
      }

      const updatedUser = await User.findByIdAndUpdate(
        id,
        { $set: input },
        { new: true, runValidators: true }
      ).select('-password');

      if (!updatedUser) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        });
      }

      return {
        user: {
          id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
        },
      };
    }),

  changePassword: protectedProcedure
    .input(changePasswordSchema)
    .mutation(async ({ ctx, input }) => {
      const { id } = ctx.user;
      const user = await User.findById(id);

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        });
      }

      const isCurrentPasswordValid = await user.comparePassword(input.currentPassword);
      if (!isCurrentPasswordValid) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Current password is incorrect',
        });
      }

      user.password = input.newPassword;
      await user.save();

      return { success: true };
    }),

  deleteAccount: protectedProcedure
    .input(deleteAccountSchema)
    .mutation(async ({ ctx, input }) => {
      const { id } = ctx.user;
      const user = await User.findById(id);

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
          message: 'Password is incorrect',
        });
      }

      await User.findByIdAndDelete(id);
      return { success: true };
    }),
});
