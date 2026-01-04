import { Button } from "@/features/shared/components/ui/button";
import React from "react";
import { useProjectFilters } from "@/features/projects/hooks/useProjectFilters";
import { useProjects } from "@/features/projects/hooks/useProjects";
import { ActiveFilters } from "@/features/projects/components/ActiveFilters";
import { FilterControls } from "@/features/projects/components/FilterControls";
import { ProjectsList } from "@/features/projects/components/ProjectsList";

export const ProjectsWithFilters: React.FC = () => {
  const {
    projectFiltersValues,
    updateFilter,
    clearFilter,
    clearAllFilters,
    filterOptions,
    activeFiltersCount,
    isLoading: isFiltersLoading,
  } = useProjectFilters();

  const { projects, isLoading, error, refetch } = useProjects({
    filters: projectFiltersValues,
    enabledFilters: true,
  });

  if (error) {
    return (
      <div className="p-4 border border-red-200 rounded-lg bg-red-50">
        <p className="text-red-800">Error loading projects: {error.message}</p>
        <Button onClick={refetch} className="mt-2">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <FilterControls
        filters={projectFiltersValues}
        filterOptions={filterOptions}
        activeFiltersCount={activeFiltersCount}
        onFilterUpdate={updateFilter}
        onClearAllFilters={clearAllFilters}
      />

      <ActiveFilters
        filters={projectFiltersValues}
        filterOptions={filterOptions}
        activeFiltersCount={activeFiltersCount}
        onClearFilter={clearFilter}
      />

      <ProjectsList
        projects={projects}
        isLoading={isLoading || isFiltersLoading}
        activeFiltersCount={activeFiltersCount}
        onRefresh={refetch}
        onClearAllFilters={clearAllFilters}
      />
    </div>
  );
};
