import { z } from 'zod';
import { router, protectedProcedure } from './trpc';
import { Notification } from '../models/notification.model';
import { TRPCError } from '@trpc/server';

export const notificationRouter = router({
  list: protectedProcedure
    .query(async ({ ctx }) => {
      const notifications = await Notification.find({ userId: ctx.user.id })
        .sort({ createdAt: -1 })
        .limit(10);
      return notifications;
    }),

  unreadCount: protectedProcedure
    .query(async ({ ctx }) => {
      const count = await Notification.countDocuments({ 
        userId: ctx.user.id,
        read: false
      });
      return count;
    }),

  markAsRead: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      const notification = await Notification.findOneAndUpdate(
        { _id: input, userId: ctx.user.id },
        { read: true },
        { new: true }
      );

      if (!notification) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Notification not found',
        });
      }

      return notification;
    }),

  markAllAsRead: protectedProcedure
    .mutation(async ({ ctx }) => {
      await Notification.updateMany(
        { userId: ctx.user.id, read: false },
        { read: true }
      );
      return { success: true };
    }),
});
