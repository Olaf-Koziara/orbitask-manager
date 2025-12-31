import { memo } from "react";
import { cn } from "@/utils/utils";
import { CalendarTaskItem } from "../CalendarTaskItem";
import type { CalendarEvent } from "../../types/calendar";
import { isCalendarExternalEvent } from "../../types/calendar";
import { getExternalProviderDot } from "./calendarEventUtils";

interface CalendarEventRendererProps {
  event: CalendarEvent;
  isAllDay?: boolean;
}

export const CalendarEventRenderer = memo(
  ({ event, isAllDay }: CalendarEventRendererProps) => {
    if (isCalendarExternalEvent(event)) {
      const dot = getExternalProviderDot(event.resource.provider);

      return (
        <div className={cn("p-1 rounded text-xs font-medium bg-muted border-l-2")}>
          <div className="flex items-center gap-1">
            <div
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: dot }}
            />
            <span className="truncate">{event.title}</span>
          </div>
        </div>
      );
    }

    return <CalendarTaskItem event={event} isAllDay={!!isAllDay} />;
  }
);

CalendarEventRenderer.displayName = "CalendarEventRenderer";


