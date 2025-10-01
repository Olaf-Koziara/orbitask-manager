import mongoose from "mongoose";
import z from "zod";
import { Priority, TaskStatus } from "../types/task";
import { projectSchema } from "./project.schema";
import { userShortSchema } from "./user.schema";

export const taskBaseSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().max(500).optional(),
  status: z.nativeEnum(TaskStatus).default(TaskStatus.TODO),
  priority: z.nativeEnum(Priority).default(Priority.MEDIUM),
  dueDate: z.coerce.date().optional(),
  tags: z.array(z.string()).default([]),
  assignee: z.string().optional(),
  projectId: z.string().optional(),
  createdBy: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().optional(),
});
export const taskResponseSchema = taskBaseSchema.extend({
  _id: z.instanceof(mongoose.Types.ObjectId),
  createdBy: userShortSchema,
  assignee: userShortSchema.optional(),
  updatedAt: z.coerce.date(),
  createdAt: z.coerce.date(),
  project: z
    .union([
      z.string(),
      z.instanceof(mongoose.Types.ObjectId),
      projectSchema.omit({ participants: true }).extend({
        _id: z.union([z.string(), z.instanceof(mongoose.Types.ObjectId)]),
      }),
      z.null(),
    ])
    .optional(),
});

export const createTaskSchema = taskBaseSchema.extend({
  assignee: z.string().optional(),
});

export const updateTaskSchema = taskBaseSchema.partial();
export const taskQuerySchema = z.object({
  status: z.nativeEnum(TaskStatus).optional(),
  priority: z.nativeEnum(Priority).optional(),
  assignee: z.string().optional(),
  tags: z.array(z.string()).optional(),
  search: z.string().optional(),
  projectId: z.string().optional(),
  projectIds: z.array(z.string()).optional(),
  sortBy: z
    .enum(["title", "createdAt", "updatedAt", "dueDate", "priority", "status"])
    .optional()
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});
