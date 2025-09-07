import z from "zod";
import { TaskStatus, Priority } from "../types/task";
import { userShortSchema } from "./user.schema";

export const taskBaseSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().max(500),
  status: z.nativeEnum(TaskStatus).default(TaskStatus.TODO),
  priority: z.nativeEnum(Priority).default(Priority.MEDIUM),
  dueDate: z.coerce.date().optional(),
  tags: z.array(z.string()).default([]),
  assignee: z.string().optional(),
  createdBy: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().optional(),
});
export const taskResponseSchema = taskBaseSchema.extend({
  id: z.string(),
  createdBy: userShortSchema,
  assignee: userShortSchema.optional(),
  updatedAt: z.coerce.date(),
  createdAt: z.coerce.date(),
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
});
