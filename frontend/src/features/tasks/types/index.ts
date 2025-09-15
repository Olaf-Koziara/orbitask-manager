import { RouterInput, RouterOutput } from "@/types";
import z from "zod";
import { updateTaskSchema } from "../../../../../backend/src/schemas/task.schema";
import { Priority, TaskStatus } from "../../../../../backend/src/types/task";
import { taskFilterSchema, TaskFormInput, taskFormSchema } from "../schemas/task.schema";

export type Task = RouterOutput["tasks"]["list"][0];
export type TaskCreateInput = RouterInput["tasks"]["create"];

export type TaskUpdateData = z.infer<typeof updateTaskSchema>;

export { Priority, TaskStatus };
export type TaskFormValues = z.infer<typeof taskFormSchema>;
export type TaskFormInputValues = TaskFormInput;
export type TaskFilterValues = z.infer<typeof taskFilterSchema>;
export type TaskListQueryParams = RouterInput["tasks"]["list"];
