import { Dialog, DialogContent } from "@/features/shared/components/ui/dialog";
import { TaskForm } from "@/features/tasks/components/TaskForm";
import { TaskOverview } from "@/features/tasks/components/TaskOverview";
import { useTasks } from "@/features/tasks/hooks/useTasks";
import { useTaskDialogStore } from "@/features/tasks/stores/taskDialog.store";
import { TaskFormValues } from "@/features/tasks/types";

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
      <DialogContent data-no-dnd className="sm:max-w-[600px]  p-0">
        {renderView()}
      </DialogContent>
    </Dialog>
  );
}
