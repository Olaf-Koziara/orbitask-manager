import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { Project } from "../models/project.model";
import { projectFiltersSchema, projectInputSchema, projectSchema } from "../schemas/project.schema";
import { IProjectResponse } from "../types/project";
import {
    assertProjectOwnerOrAdmin,
    getAccessibleProjectOrThrow,
    getProjectOrThrow,
} from "../utils/project.utils";
import { buildSafeSearchRegex } from "../utils/search.utils";
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
      const filters: Record<string, unknown>[] = [];
      const searchRegex = buildSafeSearchRegex(input?.search);

      if (ctx.user.role !== "admin") {
        filters.push({
          $or: [{ createdBy: ctx.user.id }, { participants: ctx.user.id }],
        });
      }

      if (input?.createdBy) {
        filters.push({ createdBy: input.createdBy });
      }

      if (input?.color) {
        filters.push({ color: input.color });
      }

      if (searchRegex) {
        filters.push({
          $or: [
            { name: { $regex: searchRegex } },
            { description: { $regex: searchRegex } },
          ],
        });
      }

      const query =
        filters.length === 0
          ? {}
          : filters.length === 1
            ? filters[0]
            : { $and: filters };

      // Build sort object
      const sortBy = input?.sortBy || "createdAt";
      const sortOrder = input?.sortOrder || "desc";
      const sort: any = {};
      sort[sortBy] = sortOrder === "asc" ? 1 : -1;

      const projects = await Project.find(query)
        .populate("createdBy", "name email")
        .populate("participants", "name email avatarUrl role")
        .sort(sort);

      return projects as unknown as IProjectResponse[];
    }),

  get: protectedProcedure.input(z.string()).query(async ({ input, ctx }) => {
    await getAccessibleProjectOrThrow(input, ctx.user.id, ctx.user.role);

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
      const project = await getProjectOrThrow(input.id);

      assertProjectOwnerOrAdmin(
        project,
        ctx.user.id,
        ctx.user.role,
        "You do not have permission to update this project"
      );

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
      const project = await getProjectOrThrow(input);

      assertProjectOwnerOrAdmin(
        project,
        ctx.user.id,
        ctx.user.role,
        "You do not have permission to delete this project"
      );

      await Project.findByIdAndDelete(input);
      return { success: true };
    }),
});
