import z from "zod";
import { Priority, TaskStatus } from "../types";

export const taskFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().max(500),
  status: z.nativeEnum(TaskStatus).default(TaskStatus.TODO),
  priority: z.nativeEnum(Priority).default(Priority.MEDIUM),
  dueDate: z.date().optional(),
  projectId: z.string().optional(),
  assignee: z.string().optional(),
  tags: z.union([
    z.string().transform((val) => 
      val ? val.split(',').map((tag) => tag.trim()).filter(tag => tag.length > 0) : []
    ),
    z.array(z.string())
  ]).optional(),
});

export type TaskFormInput = {
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  dueDate?: Date;
  projectId?: string;
  assignee?: string;
  tags?: string; 
};
export const taskFilterSchema = z.object({
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
