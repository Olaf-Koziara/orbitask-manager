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
        <Badge variant="secondary" className="flex items-center gap-1">
          Search: {filters.search}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0"
                onClick={() => onClearFilter("search")}
                aria-label="Clear search filter"
              >
                <X className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Clear search filter</p>
            </TooltipContent>
          </Tooltip>
        </Badge>
      )}

      {filters.createdBy && (
        <Badge variant="secondary" className="flex items-center gap-1">
          Created By: {getCreatedByName(filters.createdBy)}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0"
                onClick={() => onClearFilter("createdBy")}
                aria-label="Clear created by filter"
              >
                <X className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Clear created by filter</p>
            </TooltipContent>
          </Tooltip>
        </Badge>
      )}

      {filters.color && (
        <Badge variant="secondary" className="flex items-center gap-1">
          Color: {getColorLabel(filters.color)}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0"
                onClick={() => onClearFilter("color")}
                aria-label="Clear color filter"
              >
                <X className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Clear color filter</p>
            </TooltipContent>
          </Tooltip>
        </Badge>
      )}
    </div>
  );
};
