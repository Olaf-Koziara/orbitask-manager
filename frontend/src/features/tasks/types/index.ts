import { RouterInput, RouterOutput } from "@/types";
import { TaskStatus,Priority, TaskResponse } from "../../../../../backend/src/types/task";
import { taskFilterSchema, taskFormSchema } from "../schemas/task.schema";
import z from "zod";
export type Task = Omit<TaskResponse, '_id'> & { _id: string };
export { TaskStatus, Priority };
export type TaskFormValues = z.infer<typeof taskFormSchema>;
export type TaskFilterValues = z.infer<typeof taskFilterSchema>;
export type TaskListQueryParams = RouterInput["tasks"]["list"];