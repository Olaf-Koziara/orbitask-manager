import { Badge } from "@/features/shared/components/ui/badge";
import { Button } from "@/features/shared/components/ui/button";
import { Input } from "@/features/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/features/shared/components/ui/select";
import { Filter, Search, X } from "lucide-react";
import React from "react";
import { useProjectFilters } from "../hooks/useProjectFilters";
import { useProjects } from "../hooks/useProjects";

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

  const {
    projects,
    isLoading,
    error,
    createProject,
    updateProject,
    deleteProject,
    isCreating,
    isUpdating,
    isDeleting,
    refetch,
  } = useProjects({
    filters: projectFiltersValues,
    enabledFilters: true,
  });

  const handleClearFilter = (key: keyof typeof projectFiltersValues) => {
    clearFilter(key);
  };

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
      {/* Filter Controls */}
      <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Project Filters
          </h3>
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-gray-600 hover:text-gray-800"
            >
              Clear All ({activeFiltersCount})
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search Filter */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search projects..."
              value={projectFiltersValues.search || ""}
              onChange={(e) => updateFilter("search", e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Created By Filter */}
          <Select
            value={projectFiltersValues.createdBy || "all"}
            onValueChange={(value) =>
              updateFilter("createdBy", value === "all" ? undefined : value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Created By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              {filterOptions.users.map((user: any) => (
                <SelectItem
                  key={user._id || user.id}
                  value={user._id || user.id}
                >
                  {user.name || user.email}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Color Filter */}
          <Select
            value={projectFiltersValues.color || "all"}
            onValueChange={(value) =>
              updateFilter("color", value === "all" ? undefined : value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Color" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Colors</SelectItem>
              {filterOptions.colors.map((color) => (
                <SelectItem key={color.value} value={color.value}>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: color.value }}
                    />
                    {color.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort Options */}
          <div className="flex gap-2">
            <Select
              value={projectFiltersValues.sortBy || "createdAt"}
              onValueChange={(value) => updateFilter("sortBy", value as any)}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {filterOptions.sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={projectFiltersValues.sortOrder || "desc"}
              onValueChange={(value) => updateFilter("sortOrder", value as any)}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">↑</SelectItem>
                <SelectItem value="desc">↓</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2">
            {projectFiltersValues.search && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Search: {projectFiltersValues.search}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0"
                  onClick={() => handleClearFilter("search")}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            {projectFiltersValues.createdBy && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Created By:{" "}
                {(
                  filterOptions.users.find(
                    (u: any) =>
                      (u._id || u.id) === projectFiltersValues.createdBy
                  ) as any
                )?.name || "Unknown"}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0"
                  onClick={() => handleClearFilter("createdBy")}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            {projectFiltersValues.color && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Color:{" "}
                {filterOptions.colors.find(
                  (c) => c.value === projectFiltersValues.color
                )?.label || projectFiltersValues.color}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0"
                  onClick={() => handleClearFilter("color")}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Loading State */}
      {(isLoading || isFiltersLoading) && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading projects...</p>
        </div>
      )}

      {/* Projects List */}
      {!isLoading && !isFiltersLoading && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Projects ({projects.length})
            </h2>
            <Button onClick={refetch} variant="outline" size="sm">
              Refresh
            </Button>
          </div>

          {projects.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No projects found matching your filters.</p>
              {activeFiltersCount > 0 && (
                <Button
                  variant="link"
                  onClick={clearAllFilters}
                  className="mt-2"
                >
                  Clear filters to see all projects
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project: any) => (
                <div
                  key={project._id || project.id}
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg">{project.name}</h3>
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: project.color }}
                    />
                  </div>
                  {project.description && (
                    <p className="text-gray-600 text-sm mb-3">
                      {project.description}
                    </p>
                  )}
                  <div className="text-xs text-gray-500">
                    Created by: {project.createdBy?.name || "Unknown"}
                  </div>
                  <div className="text-xs text-gray-500">
                    Created: {new Date(project.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
