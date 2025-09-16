import { trpc } from '@/api/trpc';
import { useCallback, useMemo, useState } from 'react';
import { ProjectFilterValues } from '../types';

export const useProjectFilters = () => {
  const { data: users, isLoading: isLoadingUsers } = trpc.auth.list.useQuery();
  
  const [projectFiltersValues, setProjectFiltersValues] = useState<ProjectFilterValues>({
    search: undefined,
    createdBy: undefined,
    color: undefined,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const updateFilter = useCallback(<K extends keyof ProjectFilterValues>(
    key: K,
    value: ProjectFilterValues[K]
  ) => {
    setProjectFiltersValues(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const clearFilter = useCallback((key: keyof ProjectFilterValues) => {
    setProjectFiltersValues(prev => ({
      ...prev,
      [key]: key === 'sortBy' ? 'createdAt' : key === 'sortOrder' ? 'desc' : undefined
    }));
  }, []);

  const filterOptions = useMemo(() => ({
    users: users || [],
    colors: [
      { value: 'blue', label: 'Blue' },
      { value: 'green', label: 'Green' },
      { value: 'red', label: 'Red' },
      { value: 'yellow', label: 'Yellow' },
      { value: 'purple', label: 'Purple' },
      { value: 'orange', label: 'Orange' },
      { value: 'pink', label: 'Pink' },
      { value: 'gray', label: 'Gray' },
    ],
    sortOptions: [
      { value: 'name', label: 'Name' },
      { value: 'createdAt', label: 'Created Date' },
      { value: 'updatedAt', label: 'Updated Date' },
    ] as const,
  }), [users]);

  const activeFiltersCount = useMemo(() => {
    return Object.entries(projectFiltersValues).filter(([key, value]) => {
      // Don't count default sort values as active filters
      if (key === 'sortBy' && value === 'createdAt') return false;
      if (key === 'sortOrder' && value === 'desc') return false;
      
      return value !== undefined && 
             value !== null && 
             value !== '' && 
             (!Array.isArray(value) || value.length > 0);
    }).length;
  }, [projectFiltersValues]);

  const clearAllFilters = useCallback(() => {
    setProjectFiltersValues({
      search: undefined,
      createdBy: undefined,
      color: undefined,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
  }, []);

  return {
    projectFiltersValues,
    updateFilter,
    clearFilter,
    clearAllFilters,
    filterOptions,
    activeFiltersCount,
    isLoading: isLoadingUsers,
  };
};