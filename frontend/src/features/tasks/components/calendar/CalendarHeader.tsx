import { Card } from "@/features/shared/components/ui/card";
import { Button } from "@/features/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/features/shared/components/ui/select";
import { Plus, Settings } from "lucide-react";
import type { CalendarView } from "../../types/calendar";

interface CalendarHeaderProps {
  view: CalendarView;
  onViewChange: (view: CalendarView) => void;
  onNewTask: () => void;
  onOpenSettings: () => void;
  syncStatus?: "idle" | "syncing";
  showWeekends?: boolean;
}

export function CalendarHeader({
  view,
  onViewChange,
  onNewTask,
  onOpenSettings,
  syncStatus = "idle",
  showWeekends = true,
}: CalendarHeaderProps) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="space-y-0.5">
            <h2 className="text-2xl font-bold">Calendar</h2>
            {syncStatus === "syncing" && (
              <div className="text-xs text-muted-foreground">Syncing external events…</div>
            )}
          </div>

          <Select value={view} onValueChange={(value) => onViewChange(value as CalendarView)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Month</SelectItem>
              {showWeekends && <SelectItem value="week">Week</SelectItem>}
              <SelectItem value="work_week">Work Week</SelectItem>
              <SelectItem value="day">Day</SelectItem>
              <SelectItem value="agenda">Agenda</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={onNewTask}>
            <Plus className="w-4 h-4 mr-2" />
            New Task
          </Button>
          <Button variant="outline" size="sm" onClick={onOpenSettings}>
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>
    </Card>
  );
}


