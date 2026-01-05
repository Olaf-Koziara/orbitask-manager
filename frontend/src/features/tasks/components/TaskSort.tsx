import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/features/shared/components/ui/select";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { TaskFilterValues } from "@/features/tasks/types";

interface TaskSortProps {
  onSortChange: (
    key: keyof TaskFilterValues,
    value: TaskFilterValues[keyof TaskFilterValues]
  ) => void;
  taskFiltersValues: TaskFilterValues;
}

const sortOptions = [
  { value: "createdAt", label: "Created Date" },
  { value: "updatedAt", label: "Updated Date" },
  { value: "dueDate", label: "Due Date" },
  { value: "priority", label: "Priority" },
  { value: "status", label: "Status" },
  { value: "title", label: "Title" },
];
const TaskSort = ({ onSortChange, taskFiltersValues }: TaskSortProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium flex items-center gap-2">
        <ArrowUpDown className="h-4 w-4" />
        Sort Options
      </label>
      <div className="flex gap-2">
        <Select
          value={taskFiltersValues.sortBy || "createdAt"}
          onValueChange={(value) => onSortChange("sortBy", value)}
        >
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={taskFiltersValues.sortOrder || "desc"}
          onValueChange={(value) => onSortChange("sortOrder", value)}
        >
          <SelectTrigger className="w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">
              <div className="flex items-center gap-1">
                <ArrowUp className="h-4 w-4" />
                Asc
              </div>
            </SelectItem>
            <SelectItem value="desc">
              <div className="flex items-center gap-1">
                <ArrowDown className="h-4 w-4" />
                Desc
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
export default TaskSort;
