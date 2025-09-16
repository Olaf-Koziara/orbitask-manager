import { trpc } from '@/api/trpc';
import { useCallback, useMemo } from 'react';
import { useTaskStore } from '../stores/tasks.store';
import { Priority, TaskFilterValues, TaskStatus } from '../types';

export const useTaskFilters = () => {
  const { data: users, isLoading: isLoadingUsers } = trpc.auth.list.useQuery();
  const { data: projects, isLoading: isLoadingProjects } = trpc.projects.list.useQuery();
  const{filters:taskFilters,setFilters} = useTaskStore();


  const updateFilter = useCallback(<K extends keyof TaskFilterValues>(
    key: K,
    value: TaskFilterValues[K]
  ) => {
    setFilters({
      ...taskFilters,
      [key]: value
    });
  }, []);

  const clearFilter = useCallback((key: keyof TaskFilterValues) => {
    setFilters({
      ...taskFilters,
      [key]: Array.isArray(taskFilters[key]) ? [] : undefined
    })
  }, []);

  const filterOptions = useMemo(() => ({
    users: users || [],
    projects: projects || [],
    statuses: Object.values(TaskStatus), 
    priorities: Object.values(Priority)
  }), [users, projects]);



  const activeFiltersCount = useMemo(() => {
    return Object.values(taskFilters).filter(value => 
      value !== undefined && 
      value !== null && 
      value !== '' && 
      (!Array.isArray(value) || value.length > 0)
    ).length;
  }, [taskFilters]);

  const clearAllFilters = useCallback(() => {
    setFilters({
      status: undefined,
      priority: undefined,
      assignee: undefined,
      tags: undefined,
      search: undefined,
      projectId: undefined,
    });
  }, []);

  return {
    taskFilters,
    updateFilter,
    clearFilter,
    clearAllFilters,
    filterOptions,
    activeFiltersCount,
    isLoading: isLoadingUsers || isLoadingProjects,
  };
};
