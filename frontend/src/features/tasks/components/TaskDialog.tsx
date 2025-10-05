import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/features/shared/components/ui/dialog";
import { useTasks } from "../hooks/useTasks";
import { useTaskDialogStore } from "../stores/taskDialog.store";
import { TaskFormValues } from "../types";
import { TaskForm } from "./TaskForm";
import { TaskOverview } from "./TaskOverview";

// Stable empty object to prevent unnecessary re-renders
const EMPTY_FILTERS = {};

export function TaskDialog() {
  const {
    open,
    task: storeTask,
    initialData: storeInitialData,
    mode,
    closeDialog,
  } = useTaskDialogStore();
  const { createTask, updateTask } = useTasks();
  const handleSubmit = (data: TaskFormValues) => {
    createTask(data);
    closeDialog();
  };
  const handleUpdate = (taskId: string, data: TaskFormValues) => {
    updateTask(taskId, data);
    closeDialog();
  };

  const dialogTitle = storeTask ? "Edit Task" : "Create New Task";
  const renderView = () => {
    switch (mode) {
      case "view":
        return <TaskOverview task={storeTask} />;
      case "edit":
      case "create":
        return (
          <TaskForm
            task={storeTask}
            initialData={storeInitialData}
            onUpdate={handleUpdate}
            onSubmit={handleSubmit}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={closeDialog}>
      <DialogContent
        data-no-dnd
        className="sm:max-w-[600px] max-h-[90vh] overflow-auto"
      >
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>
            Fill in the details below to {storeTask ? "edit" : "create"} a new
            task.
          </DialogDescription>
        </DialogHeader>
        {renderView()}
      </DialogContent>
    </Dialog>
  );
}
