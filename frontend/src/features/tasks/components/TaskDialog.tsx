import { Dialog, DialogContent } from "@/features/shared/components/ui/dialog";
import { useTasks } from "../hooks/useTasks";
import { useTaskDialogStore } from "../stores/taskDialog.store";
import { TaskFormValues } from "../types";
import { TaskForm } from "./TaskForm";
import { TaskOverview } from "./TaskOverview";

export function TaskDialog() {
  const {
    open,
    task: storeTask,
    initialData: storeInitialData,
    viewMode,
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

  const dialogTitle =
    {
      view: "Task Details",
      edit: "Edit Task",
      create: "Create New Task",
    }[viewMode] || "Task Details";

  const renderView = () => {
    switch (viewMode) {
      case "view":
        return <TaskOverview task={storeTask} />;
      case "edit":
      case "create":
        return (
          <div className="p-4 border-b">
            <TaskForm
              task={storeTask}
              initialData={storeInitialData}
              onUpdate={handleUpdate}
              onSubmit={handleSubmit}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={closeDialog}>
      =======
      <DialogContent
        data-no-dnd
        className="sm:max-w-[600px] max-h-[90vh] overflow-auto  p-0"
      >
        {renderView()}
      </DialogContent>
    </Dialog>
  );
}
