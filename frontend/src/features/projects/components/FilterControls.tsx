import { Button } from "@/features/shared/components/ui/button";
import { Input } from "@/features/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/features/shared/components/ui/select";
import { Filter, Search } from "lucide-react";
import React from "react";

interface FilterControlsProps {
  filters: {
    search?: string;
    createdBy?: string;
    color?: string;
    sortBy?: string;
    sortOrder?: string;
  };
  filterOptions: {
    users: Array<{ _id?: string; id?: string; name?: string; email?: string }>;
    colors: Array<{ value: string; label: string }>;
    sortOptions: Array<{ value: string; label: string }>;
  };
  activeFiltersCount: number;
  onFilterUpdate: (key: string, value: string | undefined) => void;
  onClearAllFilters: () => void;
}

export const FilterControls: React.FC<FilterControlsProps> = ({
  filters,
  filterOptions,
  activeFiltersCount,
  onFilterUpdate,
  onClearAllFilters,
}) => {
  return (
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
            onClick={onClearAllFilters}
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
            value={filters.search || ""}
            onChange={(e) => onFilterUpdate("search", e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Created By Filter */}
        <Select
          value={filters.createdBy || "all"}
          onValueChange={(value) =>
            onFilterUpdate("createdBy", value === "all" ? undefined : value)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Created By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Users</SelectItem>
            {filterOptions.users.map((user) => (
              <SelectItem key={user._id || user.id} value={user._id || user.id}>
                {user.name || user.email}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Color Filter */}
        <Select
          value={filters.color || "all"}
          onValueChange={(value) =>
            onFilterUpdate("color", value === "all" ? undefined : value)
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
            value={filters.sortBy || "createdAt"}
            onValueChange={(value) => onFilterUpdate("sortBy", value)}
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
            value={filters.sortOrder || "desc"}
            onValueChange={(value) => onFilterUpdate("sortOrder", value)}
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
    </div>
  );
};
