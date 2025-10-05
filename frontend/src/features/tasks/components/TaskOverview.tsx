import { useProjects } from "@/features/projects";
import { Avatar } from "@/features/shared/components/ui/avatar";
import { Badge } from "@/features/shared/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/features/shared/components/ui/card";
import { Separator } from "@/features/shared/components/ui/separator";
import { cn } from "@/utils/utils";
import { Calendar, Clock, Tag, User, UserCheck } from "lucide-react";
import { memo } from "react";
import { ProjectBadge } from "../../projects/components/ProjectBadge";
import { priorityConfig, statusConfig } from "../../shared/config/task.config";
import type { Task } from "../types/index";

type TaskOverviewProps = {
  task: Task;
  className?: string;
};

const TaskOverview = memo(({ task, className }: TaskOverviewProps) => {
  const dueDate = task.dueDate ? new Date(task.dueDate) : null;
  const createdAt = new Date(task.createdAt);
  const updatedAt = task.updatedAt ? new Date(task.updatedAt) : null;
  const isOverdue = dueDate && dueDate < new Date() && task.status !== "done";
  const dueSoon =
    dueDate &&
    dueDate <= new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) &&
    task.status !== "done";
  const { projects } = useProjects();

  return (
    <Card className={cn("w-full max-w-2xl mx-auto", className)}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl font-bold mb-2">
              {task.title}
            </CardTitle>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge
                className={cn("px-3 py-1", statusConfig[task.status].className)}
              >
                {statusConfig[task.status].label}
              </Badge>
              <Badge
                className={cn(
                  "px-3 py-1",
                  priorityConfig[task.priority].className
                )}
              >
                {priorityConfig[task.priority].label}
              </Badge>
            </div>
          </div>
          {task._id && (
            <Badge variant="outline" className="text-xs font-mono">
              ID: {task._id.toString().slice(-8)}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {task.description && (
          <div>
            <h4 className="font-semibold mb-2">Description</h4>
            <p className="text-muted-foreground leading-relaxed">
              {task.description}
            </p>
          </div>
        )}

        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dueDate && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Due Date</p>
                <p
                  className={cn(
                    "text-sm",
                    isOverdue
                      ? "text-destructive"
                      : dueSoon
                      ? "text-orange-600 dark:text-orange-400"
                      : "text-muted-foreground"
                  )}
                >
                  {dueDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                  {isOverdue && <Clock className="inline h-3 w-3 ml-1" />}
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <UserCheck className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Created By</p>
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <User className="h-3 w-3" />
                </Avatar>
                <span className="text-sm text-muted-foreground">
                  {task.createdBy.name}
                </span>
              </div>
            </div>
          </div>

          {task.assignee && (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Assignee</p>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    {task.assignee.avatarUrl ? (
                      <img
                        src={task.assignee.avatarUrl}
                        alt={task.assignee.name}
                        className="h-6 w-6 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-3 w-3" />
                    )}
                  </Avatar>
                  <span className="text-sm text-muted-foreground">
                    {task.assignee.name}
                  </span>
                </div>
              </div>
            </div>
          )}

          {task.project && (
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Project</p>
                <ProjectBadge project={task.project} variant="outline" />
              </div>
            </div>
          )}
        </div>

        {task.tags.length > 0 && (
          <>
            <Separator />
            <div>
              <h4 className="font-semibold mb-2">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {task.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="px-2 py-1">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}

        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
          <div>
            <p className="font-medium">Created</p>
            <p>
              {createdAt.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          {updatedAt && (
            <div>
              <p className="font-medium">Last Updated</p>
              <p>
                {updatedAt.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

TaskOverview.displayName = "TaskOverview";

export { TaskOverview };
