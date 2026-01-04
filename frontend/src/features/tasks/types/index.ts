import { RouterInput, RouterOutput } from "@/features/shared/types";
import z from "zod";
import { updateTaskSchema } from "@backend/schemas/task.schema";
import { Priority, TaskStatus } from "@backend/types/task";
import { taskFilterSchema, TaskFormInput, taskFormSchema } from "@/features/tasks/schemas/task.schema";

export type Task = RouterOutput["tasks"]["list"][0];
export type TaskCreateInput = Exclude<RouterInput["tasks"]["create"], void>;

export type TaskUpdateData = z.infer<typeof updateTaskSchema>;

export { Priority, TaskStatus };
export type TaskFormValues = z.infer<typeof taskFormSchema>;
export type TaskFormInputValues = TaskFormInput;
export type TaskFilterValues = z.infer<typeof taskFilterSchema>;
export type TaskListQueryParams = RouterInput["tasks"]["list"];
