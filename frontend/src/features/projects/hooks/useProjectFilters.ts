import { trpc } from "@/api/trpc";
import { ProjectFilterValues } from "@/features/projects/types";
import { FilterService } from "@/features/shared/services/filter.service";
import { useCallback, useEffect, useMemo, useState } from "react";

export const useProjectFilters = () => {
  const { data: users, isLoading: isLoadingUsers } = trpc.auth.list.useQuery();

  const [projectFiltersValues, setProjectFiltersValues] =
    useState<ProjectFilterValues>({
      search: undefined,
      createdBy: undefined,
      color: undefined,
      sortBy: "createdAt",
      sortOrder: "desc",
    });

  const [debouncedSearch, setDebouncedSearch] = useState<string | undefined>(
    projectFiltersValues.search
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(projectFiltersValues.search);
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [projectFiltersValues.search]);

  const updateFilter = useCallback(
    <K extends keyof ProjectFilterValues>(
      key: K,
      value: ProjectFilterValues[K]
    ) => {
      setProjectFiltersValues((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    []
  );

  const clearFilter = useCallback((key: keyof ProjectFilterValues) => {
    setProjectFiltersValues((prev) => ({
      ...prev,
      [key]:
        key === "sortBy"
          ? "createdAt"
          : key === "sortOrder"
            ? "desc"
            : undefined,
    }));
  }, []);

  const filterOptions = useMemo(
    () => ({
      users: users || [],
      colors: [
        { value: "blue", label: "Blue" },
        { value: "green", label: "Green" },
        { value: "red", label: "Red" },
        { value: "yellow", label: "Yellow" },
        { value: "purple", label: "Purple" },
        { value: "orange", label: "Orange" },
        { value: "pink", label: "Pink" },
        { value: "gray", label: "Gray" },
      ],
      sortOptions: [
        { value: "name", label: "Name" },
        { value: "createdAt", label: "Created Date" },
        { value: "updatedAt", label: "Updated Date" },
      ],
    }),
    [users]
  );

  const activeFiltersCount = useMemo(() => FilterService.countActiveFilters(projectFiltersValues), [projectFiltersValues]);

  const clearAllFilters = useCallback(() => {
    setProjectFiltersValues({
      search: undefined,
      createdBy: undefined,
      color: undefined,
      sortBy: "createdAt",
      sortOrder: "desc",
    });
  }, []);

  return {
    projectFiltersValues,
    debouncedSearch,
    updateFilter,
    clearFilter,
    clearAllFilters,
    filterOptions,
    activeFiltersCount,
    isLoading: isLoadingUsers,
  };
};
