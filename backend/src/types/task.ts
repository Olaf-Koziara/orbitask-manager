import { Types } from 'mongoose';
import { z } from 'zod';

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in-progress',
  REVIEW = 'review',
  DONE = 'done'
}

export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}


export const taskBaseSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().max(500),
  status: z.nativeEnum(TaskStatus).default(TaskStatus.TODO),
  priority: z.nativeEnum(Priority).default(Priority.MEDIUM),
  dueDate: z.date().optional(),
  tags: z.array(z.string()).default([]),
});

export const taskFormSchema = taskBaseSchema.extend({
  tags: z.string().transform((val) => 
    val ? val.split(',').map((tag) => tag.trim()) : []
  ).optional(),
});

export const createTaskSchema = taskBaseSchema.extend({
  createdBy: z.string(),
  assignee: z.string().optional(),
});

export const updateTaskSchema = taskBaseSchema.partial();
export const taskQuerySchema = z.object({
  status: z.nativeEnum(TaskStatus).optional(),
  priority: z.nativeEnum(Priority).optional(),
  assignee: z.string().optional(),
  tags: z.array(z.string()).optional(),
  search: z.string().optional(),
});

export type Task= z.infer<typeof taskBaseSchema>;
export type TaskFormValues = z.infer<typeof taskFormSchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type TaskQueryInput = z.infer<typeof taskQuerySchema>;

export interface ITask extends Omit<Task, 'assignee' | 'createdBy'> {
  assignee?: Types.ObjectId;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  _id: Types.ObjectId;
}
