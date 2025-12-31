import { Card } from "@/features/shared/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/utils/utils";
import moment from "moment";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Calendar as BigCalendar, momentLocalizer, type View } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../components/calendar.css";
import { CalendarEventRenderer } from "../components/calendar/CalendarEventRenderer";
import {
  getCalendarEventStyle,
  getMonthDateRange,
  toCalendarExternalEvents,
} from "../components/calendar/calendarEventUtils";
import { CalendarHeader } from "../components/calendar/CalendarHeader";
import { CalendarSettingsDialog } from "../components/CalendarSettingsDialog";
import { useCalendarIntegrations } from "../hooks/useCalendarIntegrations";
import { useCalendarTasks } from "../hooks/useCalendarTasks";
import { useTaskDialogStore } from "../stores/taskDialog.store";
import type { CalendarEvent, CalendarSettings, CalendarView as CalendarViewType } from "../types/calendar";
import { isCalendarExternalEvent } from "../types/calendar";

const localizer = momentLocalizer(moment);

const DEFAULT_SETTINGS: CalendarSettings = {
  defaultView: "month",
  startTime: 8,
  endTime: 20,
  showWeekends: true,
  firstDayOfWeek: 1, // Monday
  integrations: [],
};

const CalendarView = () => {
  const { toast } = useToast();
  const { openDialog } = useTaskDialogStore();
  const { calendarEvents } = useCalendarTasks();
  const integrationsApi = useCalendarIntegrations();
  const { externalEvents, loadExternalEvents, isLoadingEvents } = integrationsApi;

  const [currentView, setCurrentView] = useState<CalendarViewType>(DEFAULT_SETTINGS.defaultView);
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [calendarSettings, setCalendarSettings] = useState<CalendarSettings>(() => DEFAULT_SETTINGS);

  useEffect(() => {
    moment.updateLocale(moment.locale(), {
      week: { dow: calendarSettings.firstDayOfWeek },
    });
  }, [calendarSettings.firstDayOfWeek]);

  useEffect(() => {
    const { start, end } = getMonthDateRange(currentDate);
    loadExternalEvents(start, end);
  }, [currentDate, loadExternalEvents]);

  useEffect(() => {
    if (!calendarSettings.showWeekends && currentView === "week") {
      setCurrentView("work_week");
    }
  }, [calendarSettings.showWeekends, currentView]);

  const allEvents = useMemo<CalendarEvent[]>(() => {
    return [...calendarEvents, ...toCalendarExternalEvents(externalEvents)];
  }, [calendarEvents, externalEvents]);

  // Handle view change
  const handleViewChange = useCallback((view: View) => {
    setCurrentView(view as CalendarViewType);
  }, []);

  // Handle date navigation
  const handleNavigate = useCallback((date: Date) => {
    setCurrentDate(date);
  }, []);

  const handleCreateTask = useCallback(
    (dueDate?: Date) => {
      openDialog({
        viewMode: "create",
        initialData: dueDate ? { dueDate } : undefined,
      });
    },
    [openDialog]
  );

  // Handle event selection (edit existing task)
  const handleSelectEvent = useCallback(
    (event: CalendarEvent) => {
      if (isCalendarExternalEvent(event)) {
        toast({
          title: "External event",
          description: "External calendar events are currently read-only.",
        });
        return;
      }

      openDialog({ task: event.task, viewMode: "view" });
    },
    [openDialog, toast]
  );

  // Apply calendar settings
  const minTime = useMemo(
    () => new Date(2000, 1, 1, calendarSettings.startTime, 0, 0),
    [calendarSettings.startTime]
  );

  const maxTime = useMemo(
    () => new Date(2000, 1, 1, calendarSettings.endTime, 0, 0),
    [calendarSettings.endTime]
  );

  const eventPropGetter = useCallback((event: CalendarEvent) => {
    return getCalendarEventStyle(event);
  }, []);

  const handleSettingsChange = useCallback((next: CalendarSettings) => {
    setCalendarSettings(next);
    const nextDefault =
      !next.showWeekends && next.defaultView === "week" ? "work_week" : next.defaultView;
    setCurrentView(nextDefault);
  }, []);

  return (
    <div className="flex flex-col space-y-4 h-full">
      <CalendarHeader
        view={currentView}
        onViewChange={(v) => setCurrentView(v)}
        onNewTask={() => handleCreateTask()}
        onOpenSettings={() => setSettingsOpen(true)}
        syncStatus={isLoadingEvents ? "syncing" : "idle"}
        showWeekends={calendarSettings.showWeekends}
      />

      {/* Calendar */}
      <Card className="flex-1 p-4">
        <div className={cn("calendar-container", "bg-background")}>
          <BigCalendar
            localizer={localizer}
            events={allEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 600 }}
            view={currentView}
            views={{
              month: true,
              week: calendarSettings.showWeekends,
              work_week: true,
              day: true,
              agenda: true,
            }}
            date={currentDate}
            onView={handleViewChange}
            onNavigate={handleNavigate}
            onSelectSlot={({ start }: { start: Date; end: Date }) => handleCreateTask(start)}
            onSelectEvent={handleSelectEvent}
            selectable
            popup
            components={{
              event: CalendarEventRenderer,
            }}
            eventPropGetter={eventPropGetter}
            step={30}
            timeslots={2}
            min={minTime}
            max={maxTime}
          />
        </div>
      </Card>
      
      {/* Calendar Settings Dialog */}
      <CalendarSettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        settings={calendarSettings}
        onSettingsChange={handleSettingsChange}
        integrationsApi={integrationsApi}
      />
    </div>
  );
};

export default CalendarView;
