import { create } from "zustand";
import { Task, TaskFormInputValues } from "../types";
type TaskDialogMode = "view" | "edit" | "create";
interface TaskDialogState {
  open: boolean;
  task?: Task;
  initialData?: Partial<TaskFormInputValues>;
  mode: TaskDialogMode;
  openDialog: (options?: {
    task?: Task;
    initialData?: Partial<TaskFormInputValues>;
    mode?: TaskDialogMode;
  }) => void;
  closeDialog: () => void;
}

export const useTaskDialogStore = create<TaskDialogState>((set) => ({
  open: false,
  task: undefined,
  initialData: undefined,
  mode: "view",
  openDialog: (options) => {
    set({ initialData: undefined, task: undefined });
    set({ open: true, ...options });
  },
  closeDialog: () => set({ open: false }),
}));
