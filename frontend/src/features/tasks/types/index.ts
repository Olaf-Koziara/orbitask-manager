import { RouterInput, RouterOutput } from "@/types";
import { TaskStatus,Priority } from "../../../../../backend/src/types/task";
import { taskFormSchema } from "../schemas/task.schema";
import z from "zod";
export type Task = RouterOutput["tasks"]["get"];
export { TaskStatus, Priority };
export type TaskFormValues = z.infer<typeof taskFormSchema>;
