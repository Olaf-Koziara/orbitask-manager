import { Button } from "@/features/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/features/shared/components/ui/dialog";
import { Trash2 } from "lucide-react";
import React, { useState } from "react";
import { useTasks } from "../hooks/useTasks";
import { Task } from "../types";

interface TaskRemoveConfirmationDialogProps {
  task: Task;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const TaskRemoveConfirmationDialog: React.FC<
  TaskRemoveConfirmationDialogProps
> = ({ task, trigger, onSuccess, onError }) => {
  const [open, setOpen] = useState(false);
  const { deleteTask } = useTasks();

  const handleConfirm = async () => {
    try {
      await deleteTask(task._id);
      setOpen(false);
      onSuccess?.();
    } catch (error) {
      onError?.(error as Error);
    }
  };

  const defaultTrigger = (
    <Button
      variant="ghost"
      size="sm"
      className="text-destructive hover:text-destructive"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen} data-no-dnd>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent data-no-dnd>
        <DialogHeader>
          <DialogTitle>Remove Task</DialogTitle>
          <DialogDescription>
            Are you sure you want to remove the task "{task.title}"? This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            Remove Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
