import { trpc } from "@/api/trpc";
import { Badge } from "@/features/shared/components/ui/badge";
import { Button } from "@/features/shared/components/ui/button";
import { Input } from "@/features/shared/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/features/shared/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/features/shared/components/ui/select";
import {
  priorityConfig,
  statusConfig,
} from "@/features/shared/config/task.config";
import {
  useActiveFiltersCount,
  useFiltersStore,
} from "@/features/tasks/stores/filters.store";
import { cn } from "@/utils/utils";
import { Filter, Flag, Search, User, X } from "lucide-react";
import React, { useCallback, useState } from "react";
import { Priority, TaskFilterValues, TaskStatus } from "../types";

type UserFromAPI = {
  _id: string;
  id: string;
  name: string;
  email: string;
  role: string;
};

export type FilterConfig = Partial<{
  [K in keyof TaskFilterValues]: boolean;
}>;
interface TaskFiltersProps {
  onFiltersChange?: (filters: TaskFilterValues) => void;
  className?: string;
  filterConfig?: FilterConfig;
}

const priorityLabels: Record<Priority | "all", string> = {
  all: "All Priorities",
  low: priorityConfig.low.label,
  medium: priorityConfig.medium.label,
  high: priorityConfig.high.label,
  urgent: priorityConfig.urgent.label,
};

const statusLabels: Record<TaskStatus | "all", string> = {
  all: "All Status",
  todo: statusConfig.todo.label,
  "in-progress": statusConfig["in-progress"].label,
  review: statusConfig.review.label,
  done: statusConfig.done.label,
};

const dueDateLabels = {
  all: "All Tasks",
  overdue: "Overdue",
  today: "Due Today",
  week: "Due This Week",
};

export const TaskFilters = ({
  onFiltersChange,
  className,
  filterConfig,
}: TaskFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Get data directly from tRPC
  const { data: users = [] } = trpc.auth.list.useQuery() as {
    data: UserFromAPI[];
  };

  // Use store directly without intermediate hook
  const { taskFilters, updateTaskFilter, clearFilters } = useFiltersStore();
  const activeFiltersCount = useActiveFiltersCount();

  // Notify parent of filter changes
  const handleFilterChange = useCallback(
    (filters: TaskFilterValues) => {
      onFiltersChange?.(filters);
    },
    [onFiltersChange]
  );

  // Simple clear function for individual filters
  const clearFilter = useCallback(
    (key: keyof TaskFilterValues) => {
      updateTaskFilter(key, undefined);
    },
    [updateTaskFilter]
  );

  // Call parent callback when filters change
  React.useEffect(() => {
    handleFilterChange(taskFilters);
  }, [taskFilters, handleFilterChange]);

  const FilterOption = ({
    label,
    value,
    onClear,
  }: {
    label: string;
    value: string | null;
    onClear: () => void;
  }) => (
    <Badge variant="secondary" className="flex items-center gap-1">
      {label}: {value}
      <Button
        variant="ghost"
        size="sm"
        className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
        onClick={onClear}
      >
        <X className="h-3 w-3" />
      </Button>
    </Badge>
  );

  return (
    <div className={cn("flex w-1/2 flex-col gap-4 mx-auto", className)}>
      <div className="flex items-center gap-2">
        {filterConfig?.search !== false && (
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={taskFilters.search || ""}
              onChange={(e) => updateTaskFilter("search", e.target.value)}
              className="pl-9"
            />
          </div>
        )}

        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="relative">
              <Filter className="mr-2 h-4 w-4" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                >
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Filters</h4>
                {activeFiltersCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="h-auto p-1 text-xs"
                  >
                    Clear all
                  </Button>
                )}
              </div>

              {filterConfig?.status !== false && (
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Flag className="h-4 w-4" />
                    Status
                  </label>
                  <Select
                    value={taskFilters.status || "all"}
                    onValueChange={(value) =>
                      updateTaskFilter(
                        "status",
                        value === "all" ? undefined : (value as TaskStatus)
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      {Object.values(TaskStatus).map((status) => (
                        <SelectItem key={status} value={status}>
                          {statusLabels[status] || status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {filterConfig?.priority !== false && (
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Flag className="h-4 w-4" />
                    Priority
                  </label>
                  <Select
                    value={taskFilters.priority || "all"}
                    onValueChange={(value) =>
                      updateTaskFilter(
                        "priority",
                        value === "all" ? undefined : (value as Priority)
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priorities</SelectItem>
                      {Object.values(Priority).map((priority) => (
                        <SelectItem key={priority} value={priority}>
                          {priorityLabels[priority] || priority}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Assignee
                </label>
                <Select
                  value={taskFilters.assignee || "all"}
                  onValueChange={(value) =>
                    updateTaskFilter(
                      "assignee",
                      value === "all" ? undefined : value
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Assignees</SelectItem>
                    {users.map((user) => (
                      <SelectItem
                        key={user._id || user.id}
                        value={user._id || user.id}
                      >
                        {user.name || user.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {taskFilters.status && (
            <FilterOption
              label="Status"
              value={statusLabels[taskFilters.status] || taskFilters.status}
              onClear={() => clearFilter("status")}
            />
          )}
          {taskFilters.priority && (
            <FilterOption
              label="Priority"
              value={
                priorityLabels[taskFilters.priority] || taskFilters.priority
              }
              onClear={() => clearFilter("priority")}
            />
          )}
          {taskFilters.assignee && (
            <FilterOption
              label="Assignee"
              value={
                users.find((u) => (u._id || u.id) === taskFilters.assignee)
                  ?.name || "Unknown"
              }
              onClear={() => clearFilter("assignee")}
            />
          )}
          {taskFilters.tags && taskFilters.tags.length > 0 && (
            <FilterOption
              label="Tags"
              value={`${taskFilters.tags.length} selected`}
              onClear={() => clearFilter("tags")}
            />
          )}
        </div>
      )}
    </div>
  );
};
