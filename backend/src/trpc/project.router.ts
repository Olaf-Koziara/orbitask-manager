import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { Project } from "../models/project.model";
import { projectFiltersSchema, projectInputSchema, projectSchema } from "../schemas/project.schema";
import { IProjectResponse } from "../types/project";
import { protectedProcedure, router } from "./trpc";

export const projectRouter = router({
  create: protectedProcedure
    .input(projectInputSchema)
    .mutation(async ({ input, ctx }) => {
      const project = await Project.create({
        ...input,
        createdBy: ctx.user.id,
      });

      return await Project.findById(project._id)
        .populate("createdBy", "name email")
        .populate("participants", "name email avatarUrl role");
    }),

  list: protectedProcedure
    .input(projectFiltersSchema)
    .query(async ({ input, ctx }) => {
      // Build MongoDB query
      const query: any = {
        // User must be either creator or participant
        $or: [{ createdBy: ctx.user.id }, { participants: ctx.user.id }],
      };

      // Add search filter
      if (input?.search) {
        query.$and = [
          { $or: query.$or }, // Keep the user access condition
          {
            $or: [
              { name: { $regex: input.search, $options: "i" } },
              { description: { $regex: input.search, $options: "i" } },
            ],
          },
        ];
        delete query.$or; // Remove the original $or since we're using $and now
      }

      // Add color filter
      if (input?.color) {
        query.color = input.color;
      }

      // Build sort object
      const sortBy = input?.sortBy || "createdAt";
      const sortOrder = input?.sortOrder || "desc";
      const sort: any = {};
      sort[sortBy] = sortOrder === "asc" ? 1 : -1;

      const projects = await Project.find(query)
        .populate("createdBy", "name email")
        .populate("participants", "name email avatarUrl role")
        .sort(sort);

      return projects as IProjectResponse[];
    }),

  get: protectedProcedure.input(z.string()).query(async ({ input }) => {
    const project = await Project.findById(input)
      .populate("createdBy", "name email role")
      .populate("participants", "name email avatarUrl role");

    if (!project) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Project not found",
      });
    }

    return project;
  }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: projectSchema.partial(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const project = await Project.findById(input.id);

      if (!project) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }

      if (
        project.createdBy.toString() !== ctx.user.id &&
        ctx.user.role !== "admin"
      ) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have permission to update this project",
        });
      }

      const updatedProject = await Project.findByIdAndUpdate(
        input.id,
        { ...input.data, updatedAt: new Date() },
        { new: true }
      )
        .populate("createdBy", "name email")
        .populate("participants", "name email avatarUrl role");

      return updatedProject;
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      const project = await Project.findById(input);

      if (!project) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }

      if (
        project.createdBy.toString() !== ctx.user.id &&
        ctx.user.role !== "admin"
      ) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have permission to delete this project",
        });
      }

      await Project.findByIdAndDelete(input);
      return { success: true };
    }),
});
