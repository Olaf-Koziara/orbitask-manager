import { trpc } from '@/api/trpc';
import { RouterOutput } from '@/types';
import { useCallback, useMemo, useState } from 'react';
import { Priority, TaskFilterValues, TaskStatus } from '../types';

export const useTaskFilters = () => {
  const { data: users, isLoading: isLoadingUsers } = trpc.auth.list.useQuery();
  const { data: projects, isLoading: isLoadingProjects } = trpc.projects.list.useQuery();
  
  const [taskFiltersValues, setTaskFiltersValues] = useState<TaskFilterValues>({
    status: undefined,
    priority: undefined,
    assignee: undefined,
    tags: undefined,
    search: undefined,
    projectId: undefined,
  });

  const updateFilter = useCallback(<K extends keyof TaskFilterValues>(
    key: K,
    value: TaskFilterValues[K]
  ) => {
    setTaskFiltersValues(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const clearFilter = useCallback((key: keyof TaskFilterValues) => {
    setTaskFiltersValues(prev => ({
      ...prev,
      [key]: Array.isArray(prev[key]) ? [] : undefined
    }));
  }, []);

  const filterOptions = useMemo(() => ({
    users: users || [],
    projects: projects || [],
    statuses: Object.values(TaskStatus), 
    priorities: Object.values(Priority)
  }), [users, projects]);



  const activeFiltersCount = useMemo(() => {
    return Object.values(taskFiltersValues).filter(value => 
      value !== undefined && 
      value !== null && 
      value !== '' && 
      (!Array.isArray(value) || value.length > 0)
    ).length;
  }, [taskFiltersValues]);

  const clearAllFilters = useCallback(() => {
    setTaskFiltersValues({
      status: undefined,
      priority: undefined,
      assignee: undefined,
      tags: undefined,
      search: undefined,
      projectId: undefined,
    });
  }, []);

  return {
    taskFiltersValues,
    updateFilter,
    clearFilter,
    clearAllFilters,
    filterOptions,
    activeFiltersCount,
    isLoading: isLoadingUsers || isLoadingProjects,
  };
};
