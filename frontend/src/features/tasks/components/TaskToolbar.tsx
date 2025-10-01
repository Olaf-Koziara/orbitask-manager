import { Button } from "@/features/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/features/shared/components/ui/dropdown-menu";
import { Archive, Copy, MoreHorizontal, Pen, Trash2 } from "lucide-react";
import React from "react";
import { useTaskDialogStore } from "../stores/taskDialog.store";
import { Task } from "../types";
import { TaskRemoveConfirmationDialog } from "./TaskRemoveConfirmationDialog";

interface TaskToolbarProps {
  task: Task;
  onDuplicate?: (task: Task) => void;
  onArchive?: (taskId: string) => void;
  className?: string;
}

export const TaskToolbar: React.FC<TaskToolbarProps> = ({
  task,
  onDuplicate,
  onArchive,
  className,
}) => {
  const { openDialog } = useTaskDialogStore();
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <DropdownMenu>
        <DropdownMenuTrigger data-no-dnd asChild>
          <Button
            variant="ghost"
            size="icon"
            className={`h-6 w-6 -mt-1 -mr-1 ${className || ""}`}
          >
            <MoreHorizontal className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent data-no-dnd="true" align="end" className="w-36">
          <DropdownMenuItem
            onClick={() => openDialog({ task, viewMode: "edit" })}
          >
            <Pen className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>

          {onDuplicate && (
            <DropdownMenuItem onClick={() => onDuplicate(task)}>
              <Copy className="mr-2 h-4 w-4" />
              Duplicate
            </DropdownMenuItem>
          )}

          {onArchive && (
            <DropdownMenuItem onClick={() => onArchive(task._id)}>
              <Archive className="mr-2 h-4 w-4" />
              Archive
            </DropdownMenuItem>
          )}

          {(onDuplicate || onArchive) && <DropdownMenuSeparator />}
          <DropdownMenuItem
            className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
            onSelect={(e) => e.preventDefault()}
          >
            <TaskRemoveConfirmationDialog
              task={task}
              trigger={
                <button className="flex items-center w-full">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </button>
              }
            />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
