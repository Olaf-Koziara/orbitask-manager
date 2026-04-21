import { Badge } from "@/features/shared/components/ui/badge";
import { Button } from "@/features/shared/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/features/shared/components/ui/tooltip";
import { X } from "lucide-react";
import React from "react";

interface ActiveFiltersProps {
  filters: {
    search?: string;
    createdBy?: string;
    color?: string;
  };
  filterOptions: {
    users: Array<{ _id: string; name: string }>;
    colors: Array<{ value: string; label: string }>;
  };
  activeFiltersCount: number;
  onClearFilter: (key: string) => void;
}

const FilterOption = ({
  label,
  value,
  onClear,
}: {
  label: string;
  value: string;
  onClear: () => void;
}) => (
  <Badge variant="secondary" className="flex items-center gap-1">
    {label}: {value}
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
          onClick={onClear}
          aria-label={`Clear ${label.toLowerCase()} filter`}
        >
          <X className="h-3 w-3" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Remove {label.toLowerCase()} filter</p>
      </TooltipContent>
    </Tooltip>
  </Badge>
);

export const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  filters,
  filterOptions,
  activeFiltersCount,
  onClearFilter,
}) => {
  if (activeFiltersCount === 0) return null;

  const getCreatedByName = (userId: string) => {
    const user = filterOptions.users.find((u) => u._id === userId);
    return user?.name || "Unknown";
  };

  const getColorLabel = (colorValue: string) => {
    const color = filterOptions.colors.find((c) => c.value === colorValue);
    return color?.label || colorValue;
  };

  return (
    <div className="flex flex-wrap gap-2">
      {filters.search && (
        <FilterOption
          label="Search"
          value={filters.search}
          onClear={() => onClearFilter("search")}
        />
      )}

      {filters.createdBy && (
        <FilterOption
          label="Created By"
          value={getCreatedByName(filters.createdBy)}
          onClear={() => onClearFilter("createdBy")}
        />
      )}

      {filters.color && (
        <FilterOption
          label="Color"
          value={getColorLabel(filters.color)}
          onClear={() => onClearFilter("color")}
        />
      )}
    </div>
  );
};
