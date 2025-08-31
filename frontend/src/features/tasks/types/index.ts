import { RouterInput, RouterOutput } from "@/types";
import { TaskStatus,Priority } from "../../../../../backend/src/types/task";
export type Task = RouterInput["tasks"]["create"];
export { TaskStatus, Priority };
