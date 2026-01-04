import { Avatar } from "@/features/shared/components/ui/avatar";
import { Badge } from "@/features/shared/components/ui/badge";
import { Card } from "@/features/shared/components/ui/card";
import { cn } from "@/utils/utils";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Calendar, Clock, User } from "lucide-react";
import { ProjectBadge } from "../../projects/components/ProjectBadge";
import { DateService } from "@/features/shared/services/date.service";
import { TaskService } from "@/features/tasks/services/task.service";
import { priorityConfig } from "../../shared/config/task.config";
import { Task } from "../types";
import { TaskToolbar } from "./TaskToolbar";

// Add TaskCardProps type
type TaskCardProps = {
  task: Task;
  onEdit?: () => void;
  onDelete?: () => void;
  onStatusChange?: (taskId: string, status: string) => void;
  className?: string;
  onClick?: () => void;
  draggable?: boolean;
};

export const TaskCard = ({
  task,
  onEdit,
  onDelete,
  onStatusChange,
  className,
  onClick,
  draggable = false,
}: TaskCardProps) => {
  const isOverdue = TaskService.isOverdue(task.dueDate, task.status);
  const dueSoon = TaskService.isDueSoon(task.dueDate, task.status);
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task._id,
    data: { status: task.status },
    disabled: !draggable,
  });
  const style = {
    transform: CSS.Translate.toString(transform),
  };
  return (
    <div
      onClick={onClick}
      style={style}
      ref={setNodeRef}
      {...listeners}
      {...attributes}
    >
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
          {task.dueDate && (
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
                {task.dueDate && DateService.formatShortDate(task.dueDate)}
              </span>
              {isOverdue && <Clock className="h-3 w-3 ml-1" />}
            </div>
          )}
          <TaskToolbar task={task} />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Badge
            className={cn(
              "px-2 py-0.5 text-xs font-medium rounded-full",
              priorityConfig[task.priority].className
            )}
          >
            {priorityConfig[task.priority].label}
          </Badge>

          {task.project && (
            <ProjectBadge
              project={task.project}
              variant="outline"
              className="text-xs"
            />
          )}

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

        <div className="flex items-center justify-between ">
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
    </div>
  );
};
