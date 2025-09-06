import { z } from 'zod';
import { router, protectedProcedure } from './trpc';
import { TaskModel } from '../models/task.model';
import { TRPCError } from '@trpc/server';
import { TaskMongoResponse } from '../types/task';
import { taskBaseSchema, taskQuerySchema, taskResponseSchema, updateTaskSchema } from '../schemas/task.schema';



export const taskRouter = router({
  create: protectedProcedure
    .input(taskBaseSchema)
    .mutation(async ({ input, ctx }) => {
      const task = await TaskModel.create({
        ...input,
        createdBy: ctx.user.id,
      });
      
      const populatedTask = await TaskModel.findById(task._id)
        .populate('assignee', 'name email avatarUrl')
        .populate('createdBy', 'name email')
        .lean() as unknown as TaskMongoResponse;
      
      return populatedTask;
    }),
  
  get: protectedProcedure
    .input(z.string())
    .query(async ({ input }) => {
      const task = await TaskModel.findById(input)
        .populate('assignee', 'name email avatarUrl')
        .populate('createdBy', 'name email')
        .lean() as TaskMongoResponse;
      return task;
    }),
  list: protectedProcedure
    .input(taskQuerySchema)
    .query(async ({ input }) => {
      const query: any = {};
      
      if (input) {
        if (input.status) query.status = input.status;
        if (input.priority) query.priority = input.priority;
        if (input.assignee) query.assignee = input.assignee;
        if (input.tags?.length) query.tags = { $in: input.tags };
        if (input.projectId) query.projectId = input.projectId;
      }

      const tasks = await TaskModel.find(query)
        .populate('assignee', 'name email avatarUrl')
        .populate('createdBy', 'name email')
        .sort({ createdAt: -1 })  
        .lean() as TaskMongoResponse[];

      return tasks;
    }),



  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      data: updateTaskSchema,
    }))
    .output(taskResponseSchema)
    .mutation(async ({ input, ctx }) => {
      const task = await TaskModel.findById(input.id);

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

      const updatedTask = await TaskModel.findByIdAndUpdate(
        input.id,
        { ...input.data, updatedAt: new Date() },
        { new: true }
      )
        .populate('assignee', 'name email avatarUrl')
        .populate('createdBy', 'name email')
        .lean() as unknown as TaskMongoResponse;

      return transformMongoTask(updatedTask);
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      const task = await TaskModel.findById(input);

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

      await TaskModel.findByIdAndDelete(input);
      return { success: true };
    }),

  getStats: protectedProcedure.query(async () => {
    const [
      total,
      completed,
      inProgress,
      overdue
    ] = await Promise.all([
      TaskModel.countDocuments(),
      TaskModel.countDocuments({ status: 'done' }),
      TaskModel.countDocuments({ status: 'in-progress' }),
      TaskModel.countDocuments({
        status: { $ne: 'done' },
        dueDate: { $lt: new Date() }
      })
    ]);

    return {
      total,
      completed,
      inProgress,
      overdue,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  }),

  getByStatus: protectedProcedure
    .input(z.enum(['todo', 'in-progress', 'review', 'done']))
    .query(async ({ input }) => {
      const tasks = await TaskModel.find({ status: input })
        .populate('assignee', 'name email avatarUrl')
        .populate('createdBy', 'name email')
        .sort({ dueDate: 1, createdAt: -1 })
        .lean() as TaskMongoResponse[];

      return tasks as TaskMongoResponse[];
    }),
});