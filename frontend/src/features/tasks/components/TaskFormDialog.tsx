import { Button } from "@/features/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/features/shared/components/ui/dialog";
import { Pen, Plus } from "lucide-react";
import { useState } from "react";
import { useTasks } from "../hooks/useTasks";
import { Task, TaskFormInputValues, TaskFormValues } from "../types";
import { TaskForm } from "./TaskForm";

// Stable empty object to prevent unnecessary re-renders
const EMPTY_FILTERS = {};

interface TaskFormDialogProps {
  isOpen?: boolean;
  task?: Task;
  trigger?: React.ReactNode;
  initialData?: Partial<TaskFormInputValues>;
}
export function TaskFormDialog({
  isOpen,
  task,
  trigger,
  initialData,
}: TaskFormDialogProps) {
  const [open, setOpen] = useState(false);
  const { createTask, updateTask } = useTasks(EMPTY_FILTERS);
  const handleSubmit = (data: TaskFormValues) => {
    createTask(data);
    setOpen(false);
  };
  const handleUpdate = (taskId: string, data: TaskFormValues) => {
    updateTask(taskId, data);
    setOpen(false);
  };
  const defaultTrigger = (
    <Button>
      {task ? (
        <Pen className="mr-2 h-4 w-4" />
      ) : (
        <Plus className="mr-2 h-4 w-4" />
      )}
      {task ? "Edit Task" : "Add Task"}
    </Button>
  );

  return (
    <Dialog open={isOpen !== undefined ? isOpen : open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ? trigger : defaultTrigger}
      </DialogTrigger>
      <DialogContent data-no-dnd className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new task.
          </DialogDescription>
        </DialogHeader>
        <TaskForm
          task={task}
          initialData={initialData}
          onUpdate={handleUpdate}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}
