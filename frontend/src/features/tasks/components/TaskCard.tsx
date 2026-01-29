import { ProjectBadge } from "@/features/projects/components/ProjectBadge";
import { Avatar } from "@/features/shared/components/ui/avatar";
import { Badge } from "@/features/shared/components/ui/badge";
import { Card } from "@/features/shared/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/features/shared/components/ui/tooltip";
import { priorityConfig } from "@/features/shared/config/task.config";
import { DateService } from "@/features/shared/services/date.service";
import { cn } from "@/features/shared/utils";
import { TaskToolbar } from "@/features/tasks/components/TaskToolbar";
import { TaskService } from "@/features/tasks/services/task.service";
import { Task } from "@/features/tasks/types";
import { useDraggable } from "@dnd-kit/core";
import { Calendar, Clock, User } from "lucide-react";
import { memo } from "react";
// Add TaskCardProps type
type TaskCardProps = {
  task: Task;
  onEdit?: () => void;
  onDelete?: () => void;
  onStatusChange?: (taskId: string, status: string) => void;
  className?: string;
  onClick?: () => void;
  draggable?: boolean;
  preview?: boolean;
};

export const TaskCard = memo(
  ({
    task,
    className,
    onClick,
    draggable = false,
    preview = false,
  }: TaskCardProps) => {
    const isOverdue = TaskService.isOverdue(task.dueDate, task.status);
    const dueSoon = TaskService.isDueSoon(task.dueDate, task.status);
    const { attributes, listeners, setNodeRef } = useDraggable({
      id: task._id,
      data: { status: task.status },
      disabled: !draggable,
    });

    return (
      <div onClick={onClick} ref={setNodeRef} {...listeners} {...attributes} className="relative group">
        <Card
          className={cn(
            "p-4 space-y-3 cursor-pointer bg-white dark:bg-card border-transparent shadow-sm hover:shadow-md transition-all duration-300",
            "group-hover:scale-[1.01] group-hover:border-border/60",
            isOverdue && "border-destructive/20 bg-destructive/5",
            preview && "opacity-80 rotate-2 shadow-xl scale-105 z-50",
            className
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge
                      className={cn(
                        "w-2 h-2 p-0 rounded-full",
                        priorityConfig[task.priority].className
                      )}
                      variant="outline"
                      aria-label={`Priority: ${priorityConfig[task.priority].label}`}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Priority: {priorityConfig[task.priority].label}</p>
                  </TooltipContent>
                </Tooltip>
                {task.project && (
                   <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                      {task.project.name}
                   </span>
                )}
              </div>

              <h3 className="font-semibold text-sm leading-snug text-foreground/90 mb-1 line-clamp-2">
                {task.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
             <div className="flex items-center gap-2">
               {task.dueDate && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className={cn(
                        "flex items-center gap-1 text-[11px] px-1.5 py-0.5 rounded-md bg-muted/50",
                        isOverdue
                          ? "text-destructive bg-destructive/10"
                          : dueSoon
                          ? "text-warning bg-warning/10"
                          : "text-muted-foreground"
                      )}
                    >
                      <Calendar className="h-3 w-3" />
                      <span>
                        {DateService.formatShortDate(task.dueDate)}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {isOverdue
                        ? `Overdue since ${DateService.formatFullDate(task.dueDate)}`
                        : dueSoon
                        ? `Due on ${DateService.formatFullDate(task.dueDate)}`
                        : `Due date: ${DateService.formatFullDate(task.dueDate)}`}
                    </p>
                  </TooltipContent>
                </Tooltip>
              )}
             </div>

             <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                   {task.assignee && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Avatar className="h-6 w-6 border-2 border-background ring-1 ring-border/20">
                            {task.assignee.avatarUrl ? (
                              <img
                                src={task.assignee.avatarUrl}
                                alt={task.assignee.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-primary/10 flex items-center justify-center text-[9px] font-bold text-primary">
                                {task.assignee.name.charAt(0)}
                              </div>
                            )}
                          </Avatar>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Assigned to {task.assignee.name}</p>
                        </TooltipContent>
                      </Tooltip>
                   )}
                </div>
             </div>
          </div>

           {/* Quick Actions overlay on hover - optional, but nice for power users */}
           {/* <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <TaskToolbar task={task} />
           </div> */}
        </Card>
      </div>
    );
  }
);

TaskCard.displayName = "TaskCard";
