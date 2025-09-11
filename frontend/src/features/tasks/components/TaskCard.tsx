import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/utils/utils";
import { Calendar, Clock, User } from "lucide-react";
import React from "react";
import { useTaskActions } from "../hooks/useTaskActions";
import { Priority, Task, TaskStatus } from "../types";
import { TaskToolbar } from "./TaskToolbar";

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onStatusChange?: (taskId: string, status: TaskStatus) => void;
  className?: string;
}

const priorityConfig: Record<Priority, { label: string; className: string }> = {
  low: { label: "Low", className: "priority-low" },
  medium: { label: "Medium", className: "priority-medium" },
  high: { label: "High", className: "priority-high" },
  urgent: { label: "Urgent", className: "priority-urgent" },
};

const statusConfig: Record<TaskStatus, { label: string; className: string }> = {
  todo: { label: "To Do", className: "status-todo" },
  "in-progress": { label: "In Progress", className: "status-progress" },
  review: { label: "Review", className: "status-review" },
  done: { label: "Done", className: "status-done" },
};

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onStatusChange,
  className,
}) => {
  const { deleteTask } = useTaskActions();
  const dueDate = task.dueDate ? new Date(task.dueDate) : null;
  const isOverdue = dueDate && dueDate < new Date() && task.status !== "done";
  const dueSoon =
    dueDate &&
    dueDate <= new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) &&
    task.status !== "done";

  return (
    <Card
      className={cn(
        "card-elevated hover-lift p-4 space-y-3 cursor-pointer animate-slide-up",
        isOverdue && "border-destructive",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm leading-tight mb-1 line-clamp-2">
            {task.title}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {task.description}
          </p>
        </div>
        {dueDate && (
          <div
            className={cn(
              "flex items-center gap-1 text-xs mr-2",
              isOverdue
                ? "text-destructive"
                : dueSoon
                ? "text-warning"
                : "text-muted-foreground"
            )}
          >
            <Calendar className="h-3 w-3" />
            <span>
              {dueDate.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
            {isOverdue && <Clock className="h-3 w-3 ml-1" />}
          </div>
        )}
        <TaskToolbar task={task} onEdit={onEdit} />
      </div>

      <div className="flex items-center gap-2">
        <Badge
          className={cn(
            "px-2 py-0.5 text-xs font-medium rounded-full",
            priorityConfig[task.priority].className
          )}
        >
          {priorityConfig[task.priority].label}
        </Badge>

        {task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {task.tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="px-1.5 py-0.5 text-xs"
              >
                {tag}
              </Badge>
            ))}
            {task.tags.length > 3 && (
              <Badge variant="secondary" className="px-1.5 py-0.5 text-xs">
                +{task.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-3">
          {task.assignee && (
            <div className="flex items-center gap-1.5">
              <Avatar className="h-5 w-5">
                {task.assignee.avatarUrl ? (
                  <img
                    src={task.assignee.avatarUrl}
                    alt={task.assignee.name}
                    className="h-5 w-5 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-3 w-3" />
                )}
              </Avatar>
              <span className="text-xs text-muted-foreground hidden sm:inline">
                {task.assignee.name.split(" ")[0]}
              </span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
