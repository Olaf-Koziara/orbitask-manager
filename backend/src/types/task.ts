import { Document, Types } from "mongoose";
import { z } from "zod";
import {
  createTaskSchema,
  taskBaseSchema,
  taskQuerySchema,
  taskResponseSchema,
  updateTaskSchema,
} from "../schemas/task.schema";
import { PopulatedUser } from "./user";

export enum TaskStatus {
  TODO = "todo",
  IN_PROGRESS = "in-progress",
  REVIEW = "review",
  DONE = "done",
}

export enum Priority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  URGENT = "urgent",
}

export type assigneeType = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
};

// Base task types from schemas
export type Task = z.infer<typeof taskBaseSchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type TaskQueryInput = z.infer<typeof taskQuerySchema>;
export type TaskResponse = z.infer<typeof taskResponseSchema>;

// MongoDB document interface
export interface ITaskDocument extends Document {
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
  assignee?: Types.ObjectId;
  createdBy: Types.ObjectId;
}

// Populated task document type
export interface ITaskPopulated
  extends Omit<ITaskDocument, "assignee" | "createdBy"> {
  assignee?: PopulatedUser;
  createdBy: PopulatedUser;
}

// Type for lean populated documents (what we get from .lean())
export type TaskMongoResponse = Task & {
  _id: Types.ObjectId | string;
  project?: {
    _id: Types.ObjectId | string;
    name: string;
    color: string;
    description: string;
  };
};
