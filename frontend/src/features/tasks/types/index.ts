import { RouterOutput } from "@/types";
import { TaskStatus,Priority } from "../../../../../backend/src/types/task";
export type Task = RouterOutput["tasks"]["get"];
export { TaskStatus, Priority };
