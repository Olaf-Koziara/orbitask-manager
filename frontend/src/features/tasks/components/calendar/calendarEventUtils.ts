import { priorityConfig } from "@/features/shared/config/task.config";
import type {
  CalendarEvent,
  CalendarExternalEvent,
  ExternalCalendarEvent,
} from "../../types/calendar";
import { isCalendarExternalEvent } from "../../types/calendar";

const providerColors: Record<
  ExternalCalendarEvent["provider"],
  { base: string; dot: string }
> = {
  google: { base: "#4285f4", dot: "#4285f4" },
  apple: { base: "#6c757d", dot: "#6c757d" },
  outlook: { base: "#0a66c2", dot: "#0a66c2" },
};

export function toCalendarExternalEvents(
  externalEvents: ExternalCalendarEvent[]
): CalendarExternalEvent[] {
  return externalEvents.map((event) => ({
    id: `external-${event.id}`,
    title: event.title,
    start: event.start,
    end: event.end,
    allDay: event.isAllDay,
    resource: {
      isExternal: true,
      provider: event.provider,
      description: event.description,
    },
  }));
}

export function getMonthDateRange(date: Date) {
  const start = new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
  return { start, end };
}

export function getCalendarEventStyle(event: CalendarEvent) {
  // External events
  if (isCalendarExternalEvent(event)) {
    const provider = event.resource.provider;
    const color = providerColors[provider]?.base ?? "#6c757d";

    return {
      style: {
        backgroundColor: `${color}20`,
        border: `1px solid ${color}60`,
        borderRadius: "4px",
        padding: "2px",
      },
    };
  }

  // Task events
  const priority = event.resource?.priority ?? event.task.priority;
  const cfg = priorityConfig[priority] ?? priorityConfig.medium;

  return {
    style: {
      backgroundColor: `hsl(${cfg.color} / 0.12)`,
      border: `1px solid hsl(${cfg.color} / 0.35)`,
      borderRadius: "4px",
      padding: "2px",
    },
  };
}

export function getExternalProviderDot(provider: ExternalCalendarEvent["provider"]) {
  return providerColors[provider]?.dot ?? "#6c757d";
}


