import { Badge } from "@/features/shared/components/ui/badge";
import { Button } from "@/features/shared/components/ui/button";
import { X } from "lucide-react";
import React from "react";

interface ActiveFiltersProps {
  filters: {
    search?: string;
    createdBy?: string;
    color?: string;
  };
  filterOptions: {
    users: Array<{ _id?: string; id?: string; name?: string; email?: string }>;
    colors: Array<{ value: string; label: string }>;
  };
  activeFiltersCount: number;
  onClearFilter: (key: string) => void;
}

export const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  filters,
  filterOptions,
  activeFiltersCount,
  onClearFilter,
}) => {
  if (activeFiltersCount === 0) return null;

  const getCreatedByName = (userId: string) => {
    const user = filterOptions.users.find((u) => (u._id || u.id) === userId);
    return user?.name || "Unknown";
  };

  const getColorLabel = (colorValue: string) => {
    const color = filterOptions.colors.find((c) => c.value === colorValue);
    return color?.label || colorValue;
  };

  return (
    <div className="flex flex-wrap gap-2">
      {filters.search && (
        <Badge variant="secondary" className="flex items-center gap-1">
          Search: {filters.search}
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0"
            onClick={() => onClearFilter("search")}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      )}

      {filters.createdBy && (
        <Badge variant="secondary" className="flex items-center gap-1">
          Created By: {getCreatedByName(filters.createdBy)}
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0"
            onClick={() => onClearFilter("createdBy")}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      )}

      {filters.color && (
        <Badge variant="secondary" className="flex items-center gap-1">
          Color: {getColorLabel(filters.color)}
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0"
            onClick={() => onClearFilter("color")}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      )}
    </div>
  );
};
