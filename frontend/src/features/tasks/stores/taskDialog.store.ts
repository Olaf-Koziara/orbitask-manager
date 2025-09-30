import { create } from "zustand";
import { Task, TaskFormInputValues } from "../types";
type TaskDialogViewMode = "view" | "edit" | "create";
interface TaskDialogState {
  open: boolean;
  task?: Task;
  initialData?: Partial<TaskFormInputValues>;
  viewMode: TaskDialogViewMode;
  openDialog: (options?: {
    task?: Task;
    initialData?: Partial<TaskFormInputValues>;
    viewMode?: TaskDialogViewMode;
  }) => void;
  closeDialog: () => void;
}

export const useTaskDialogStore = create<TaskDialogState>((set) => ({
  open: false,
  task: undefined,
  initialData: undefined,
  viewMode: "view",
  openDialog: (options) => {
    set({ initialData: undefined, task: undefined, ...options });

    set({ open: true });
  },
  closeDialog: () => set({ open: false }),
}));
