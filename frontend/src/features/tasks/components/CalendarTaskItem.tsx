import { Badge } from "@/features/shared/components/ui/badge";
import { cn } from "@/utils/utils";
import { Clock } from "lucide-react";
import { memo } from "react";
import { priorityConfig, statusConfig } from "../../shared/config/task.config";
import type { CalendarTaskEvent } from "../types/calendar";

interface CalendarTaskItemProps {
  event: CalendarTaskEvent;
  className?: string;
  isSelected?: boolean;
  isAllDay?: boolean;
}

const CalendarTaskItem = memo(({ 
  event, 
  className, 
  isSelected = false,
  isAllDay = false 
}: CalendarTaskItemProps) => {
  const { task } = event;
  const priorityInfo = priorityConfig[task.priority];
  const statusInfo = statusConfig[task.status];
  
  // Determine if task is overdue
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();
  
  return (
    <div
      className={cn(
        "flex items-center gap-1 p-1 rounded text-xs font-medium transition-all cursor-pointer",
        "hover:shadow-md hover:scale-105 border-l-2",
        priorityInfo.borderColor,
        isSelected && "ring-2 ring-primary ring-offset-1",
        isOverdue && "bg-destructive/10 border-destructive",
        !isOverdue && statusInfo.bgColor,
        className
      )}
      style={{
        backgroundColor: isOverdue 
          ? undefined 
          : `hsl(${priorityInfo.color} / 0.1)`,
      }}
    >
      {/* Status indicator dot */}
      <div 
        className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", statusInfo.dotColor)}
      />
      
      {/* Task title - truncated for small display */}
      <span className={cn(
        "truncate flex-1 leading-tight",
        isOverdue && "text-destructive-foreground"
      )}>
        {task.title}
      </span>
      
      {/* Time indicator for timed events */}
      {!isAllDay && (
        <Clock className="w-3 h-3 flex-shrink-0 opacity-60" />
      )}
      
      {/* Priority indicator for urgent/high priority */}
      {(task.priority === 'high' || task.priority === 'urgent') && (
        <Badge 
          variant="outline" 
          className={cn(
            "px-1 py-0 text-[10px] h-4 border-0",
            priorityInfo.textColor,
            priorityInfo.bgColor
          )}
        >
          {task.priority === 'urgent' ? '!' : 'H'}
        </Badge>
      )}
      
      {/* Assignee indicator */}
      {task.assignee && (
        <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
          <span className="text-[8px] font-semibold text-primary">
            {task.assignee.name.charAt(0).toUpperCase()}
          </span>
        </div>
      )}
    </div>
  );
});

CalendarTaskItem.displayName = "CalendarTaskItem";

export { CalendarTaskItem };