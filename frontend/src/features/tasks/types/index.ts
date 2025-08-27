import { RouterInput, RouterOutput } from "@/types";
import { TaskStatus,Priority } from "../../../../../backend/src/types/task";
import z from "zod";
export type Task = RouterInput["tasks"]["create"];
export { TaskStatus, Priority };
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
export type TaskFormValues = z.infer<typeof taskFormSchema>;