import { z } from 'zod';
import { router, protectedProcedure } from './trpc';
import { Project } from '../models/project.model';
import { TRPCError } from '@trpc/server';

const projectSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  color: z.string(),
});

export const projectRouter = router({
  create: protectedProcedure
    .input(projectSchema)
    .mutation(async ({ input, ctx }) => {
      const project = await Project.create({
        ...input,
        createdBy: ctx.user.id,
      });
      return project;
    }),

  list: protectedProcedure
    .query(async () => {
      const projects = await Project.find()
        .populate('createdBy', 'name email')
        .sort({ createdAt: -1 });
      return projects;
    }),

  get: protectedProcedure
    .input(z.string())
    .query(async ({ input }) => {
      const project = await Project.findById(input)
        .populate('createdBy', 'name email');

      if (!project) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Project not found',
        });
      }

      return project;
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      data: projectSchema.partial(),
    }))
    .mutation(async ({ input, ctx }) => {
      const project = await Project.findById(input.id);

      if (!project) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Project not found',
        });
      }

      if (project.createdBy.toString() !== ctx.user.id && ctx.user.role !== 'admin') {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You do not have permission to update this project',
        });
      }

      const updatedProject = await Project.findByIdAndUpdate(
        input.id,
        { ...input.data, updatedAt: new Date() },
        { new: true }
      ).populate('createdBy', 'name email');

      return updatedProject;
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      const project = await Project.findById(input);

      if (!project) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Project not found',
        });
      }

      if (project.createdBy.toString() !== ctx.user.id && ctx.user.role !== 'admin') {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You do not have permission to delete this project',
        });
      }

      await Project.findByIdAndDelete(input);
      return { success: true };
    }),
});
