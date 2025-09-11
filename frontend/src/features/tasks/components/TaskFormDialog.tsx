import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useTaskActions } from "../hooks/useTaskActions";
import { TaskFormValues } from "../types";
import { TaskForm } from "./TaskForm";
interface TaskFormDialogProps {
  children?: React.ReactNode;
  isOpen?: boolean;
}
export function TaskFormDialog({ children, isOpen }: TaskFormDialogProps) {
  const [open, setOpen] = useState(false);
  const { createTask } = useTaskActions();
  const handleSubmit = (data: TaskFormValues) => {
    createTask(data);
    setOpen(false);
  };

  return (
    <Dialog open={isOpen !== undefined ? isOpen : open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children ? (
          children
        ) : (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new task.
          </DialogDescription>
        </DialogHeader>
        <TaskForm onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  );
}
