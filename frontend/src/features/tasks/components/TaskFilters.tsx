import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { 
  Filter, 
  Search, 
  X,
  Calendar,
  User,
  FolderOpen,
  Flag
} from 'lucide-react';
import { useTaskFilters } from '../hooks/useTasksFilters';
import { cn } from '@/utils/utils';
import { Priority, Task, TaskStatus, TaskFilterValues } from '../types';
import { useTaskActions } from '../hooks/useTaskActions';

type UserFromAPI = {
  _id: string;
  id: string;
  name: string;
  email: string;
  role: string;
};

type ProjectFromAPI = {
  _id: string;
  id: string;
  name: string;
  description?: string;
  color: string;
  createdBy: string;
};
export type FilterConfig = Partial<{
  [K in keyof FilterState]: boolean;
}>;

export interface FilterState {
  search: string;
  priority: Priority | 'all';
  status: TaskStatus | 'all';
  assignee: string | 'all';
  project: string | 'all';
  dueDate: 'overdue' | 'today' | 'week' | 'all';
}

interface TaskFiltersProps {
  onFiltersChange: (filters: FilterState) => void;
  className?: string;
  filterConfig?: FilterConfig;
}

const priorityLabels: Record<Priority | 'all', string> = {
  all: 'All Priorities',
  low: 'Low Priority',
  medium: 'Medium Priority', 
  high: 'High Priority',
  urgent: 'Urgent'
};

const statusLabels: Record<TaskStatus | 'all', string> = {
  all: 'All Status',
  todo: 'To Do',
  'in-progress': 'In Progress',
  review: 'Review',
  done: 'Done'
};

const dueDateLabels = {
  all: 'All Tasks',
  overdue: 'Overdue',
  today: 'Due Today',
  week: 'Due This Week'
};

export const TaskFilters = ({
  onFiltersChange,
  className,
  filterConfig
}: TaskFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const {getTaskList} = useTaskActions();
  const { 
    filterOptions, 
    updateFilter, 
    clearFilter, 
    clearAllFilters,
    taskFiltersValues,
    activeFiltersCount,
    isLoading
  } = useTaskFilters();
useEffect(() => {
    getTaskList(taskFiltersValues);
},[taskFiltersValues])


  const FilterOption = ({ 
    label, 
    value, 
    onClear 
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
    <div className={cn("flex w-1/2 flex-col gap-4", className)}>
      <div className="flex items-center gap-2">
        {
          filterConfig?.search === false ? null :
(        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={taskFiltersValues.search || ''}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="pl-9"
          />
        </div>)
}
        
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
                    onClick={clearAllFilters}
                    className="h-auto p-1 text-xs"
                  >
                    Clear all
                  </Button>
                )}
              </div>
              {
                filterConfig?.status === false ? null : (
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Flag className="h-4 w-4" />
                      Status
                    </label>
                <Select
                  value={taskFiltersValues.status || 'all'}
                  onValueChange={(value) => 
                    updateFilter('status', value === 'all' ? undefined : value as TaskStatus)
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
              </div>)}
                    {filterConfig?.priority === false ? null : (
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Flag className="h-4 w-4" />
                  Priority
                </label>
                <Select
                  value={taskFiltersValues.priority || 'all'}
                  onValueChange={(value) => 
                    updateFilter('priority', value === 'all' ? undefined : value as Priority)
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
                  value={taskFiltersValues.assignee || 'all'}
                  onValueChange={(value) => 
                    updateFilter('assignee', value === 'all' ? undefined : value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Assignees</SelectItem>
                    {(filterOptions.users as UserFromAPI[]).map((user) => (
                      <SelectItem key={user._id || user.id} value={user._id || user.id}>
                        {user.name || user.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <FolderOpen className="h-4 w-4" />
                  Project
                </label>
                <Select
                  value={taskFiltersValues.projectId || 'all'}
                  onValueChange={(value) => 
                    updateFilter('projectId', value === 'all' ? undefined : value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Projects</SelectItem>
                    {(filterOptions.projects as ProjectFromAPI[]).map((project) => (
                      <SelectItem key={project._id || project.id} value={project._id || project.id}>
                        {project.name}
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
          {taskFiltersValues.status && (
            <FilterOption
              label="Status"
              value={statusLabels[taskFiltersValues.status] || taskFiltersValues.status}
              onClear={() => clearFilter('status')}
            />
          )}
          {taskFiltersValues.priority && (
            <FilterOption
              label="Priority"
              value={priorityLabels[taskFiltersValues.priority] || taskFiltersValues.priority}
              onClear={() => clearFilter('priority')}
            />
          )}
          {taskFiltersValues.assignee && (
            <FilterOption
              label="Assignee"
              value={(filterOptions.users as UserFromAPI[]).find(u => (u._id || u.id) === taskFiltersValues.assignee)?.name || 'Unknown'}
              onClear={() => clearFilter('assignee')}
            />
          )}
          {taskFiltersValues.projectId && (
            <FilterOption
              label="Project"
              value={(filterOptions.projects as ProjectFromAPI[]).find(p => (p._id || p.id) === taskFiltersValues.projectId)?.name || 'Unknown'}
              onClear={() => clearFilter('projectId')}
            />
          )}
          {taskFiltersValues.tags && taskFiltersValues.tags.length > 0 && (
            <FilterOption
              label="Tags"
              value={`${taskFiltersValues.tags.length} selected`}
              onClear={() => clearFilter('tags')}
            />
          )}
        </div>
      )}
    </div>
  );
};