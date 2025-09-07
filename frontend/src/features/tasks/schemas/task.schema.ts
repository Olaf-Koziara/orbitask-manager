import z from "zod";
import { Priority, TaskStatus } from "../types";

export const taskFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().max(500),
  status: z.nativeEnum(TaskStatus).default(TaskStatus.TODO),
  priority: z.nativeEnum(Priority).default(Priority.MEDIUM),
  dueDate: z.date().optional(),
  tags: z.string().transform((val) => 
    val ? val.split(',').map((tag) => tag.trim()) : []
  ).optional(),
});
