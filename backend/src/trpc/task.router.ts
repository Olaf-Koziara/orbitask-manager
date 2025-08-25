import { z } from 'zod';
import { router, protectedProcedure } from './trpc';
import { Task } from '../models/task.model';
import { TRPCError } from '@trpc/server';

const taskSchema = z.object({
  title: z.string().min(1),
  description: z.string(),
  status: z.enum(['todo', 'in-progress', 'review', 'done']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  assignee: z.string().optional(),
  tags: z.array(z.string()),
  dueDate: z.string().optional(),
});

const updateTaskSchema = taskSchema.partial();

export const taskRouter = router({
  create: protectedProcedure
    .input(taskSchema)
    .mutation(async ({ input, ctx }) => {
      const task = await Task.create({
        ...input,
        createdBy: ctx.user.id,
      });
      return task;
    }),

  list: protectedProcedure
    .input(z.object({
      status: z.enum(['todo', 'in-progress', 'review', 'done']).optional(),
      priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
      assignee: z.string().optional(),
      tags: z.array(z.string()).optional(),
    }).optional())
    .query(async ({ input, ctx }) => {
      const query: any = {};
      
      if (input) {
        if (input.status) query.status = input.status;
        if (input.priority) query.priority = input.priority;
        if (input.assignee) query.assignee = input.assignee;
        if (input.tags?.length) query.tags = { $in: input.tags };
      }

      const tasks = await Task.find(query)
        .populate('assignee', 'name email avatarUrl')
        .populate('createdBy', 'name email')
        .sort({ createdAt: -1 });

      return tasks;
    }),

  get: protectedProcedure
    .input(z.string())
    .query(async ({ input }) => {
      const task = await Task.findById(input)
        .populate('assignee', 'name email avatarUrl')
        .populate('createdBy', 'name email');

      if (!task) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Task not found',
        });
      }

      return task;
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      data: updateTaskSchema,
    }))
    .mutation(async ({ input, ctx }) => {
      const task = await Task.findById(input.id);

      if (!task) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Task not found',
        });
      }

      if (task.createdBy.toString() !== ctx.user.id && ctx.user.role !== 'admin') {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You do not have permission to update this task',
        });
      }

      const updatedTask = await Task.findByIdAndUpdate(
        input.id,
        { ...input.data, updatedAt: new Date() },
        { new: true }
      )
        .populate('assignee', 'name email avatarUrl')
        .populate('createdBy', 'name email');

      return updatedTask;
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      const task = await Task.findById(input);

      if (!task) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Task not found',
        });
      }

      if (task.createdBy.toString() !== ctx.user.id && ctx.user.role !== 'admin') {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You do not have permission to delete this task',
        });
      }

      await Task.findByIdAndDelete(input);
      return { success: true };
    }),
});
