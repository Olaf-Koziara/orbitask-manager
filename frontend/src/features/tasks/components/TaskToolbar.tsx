import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Archive, Copy, Edit, MoreHorizontal, Trash2 } from "lucide-react";
import React from "react";
import { Task } from "../types";
import { TaskRemoveConfirmationDialog } from "./TaskRemoveConfirmationDialog";

interface TaskToolbarProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDuplicate?: (task: Task) => void;
  onArchive?: (taskId: string) => void;
  className?: string;
}

export const TaskToolbar: React.FC<TaskToolbarProps> = ({
  task,
  onEdit,
  onDuplicate,
  onArchive,
  className,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={`h-6 w-6 -mt-1 -mr-1 ${className || ""}`}
        >
          <MoreHorizontal className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {onEdit && (
          <DropdownMenuItem onClick={() => onEdit(task)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Task
          </DropdownMenuItem>
        )}

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

        {(onEdit || onDuplicate || onArchive) && <DropdownMenuSeparator />}

        <TaskRemoveConfirmationDialog
          task={task}
          trigger={
            <DropdownMenuItem
              className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
              onSelect={(e) => e.preventDefault()}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Task
            </DropdownMenuItem>
          }
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
