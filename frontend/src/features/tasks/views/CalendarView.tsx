import { Calendar as BigCalendar, momentLocalizer, View, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../components/calendar.css';
import { useCallback, useMemo, useState } from 'react';
import { CalendarTaskItem } from '../components/CalendarTaskItem';
import { CalendarSettingsDialog } from '../components/CalendarSettingsDialog';
import { useCalendarTasks } from '../hooks/useCalendarTasks';
import { useCalendarIntegrations } from '../hooks/useCalendarIntegrations';
import type { CalendarTaskEvent, CalendarView as CalendarViewType, CalendarSettings } from '../types/calendar';
import { Card } from '@/features/shared/components/ui/card';
import { Button } from '@/features/shared/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/features/shared/components/ui/select';
import { Plus, Settings } from 'lucide-react';
import { cn } from '@/utils/utils';

// Setup the localizer for React Big Calendar
const localizer = momentLocalizer(moment);

const CalendarView = () => {
  const { calendarEvents, createTask } = useCalendarTasks();
  const { externalEvents, loadExternalEvents } = useCalendarIntegrations();
  const [currentView, setCurrentView] = useState<CalendarViewType>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [calendarSettings, setCalendarSettings] = useState<CalendarSettings>({
    defaultView: 'month',
    startTime: 8,
    endTime: 20,
    showWeekends: true,
    firstDayOfWeek: 1, // Monday
    integrations: [],
  });

  // Combine task events and external calendar events
  const allEvents = useMemo(() => {
    const taskEvents = calendarEvents;
    
    // Convert external events to calendar format
    const externalCalendarEvents = externalEvents.map((event) => ({
      id: `external-${event.id}`,
      task: null, // External events don't have task data
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
    
    return [...taskEvents, ...externalCalendarEvents];
  }, [calendarEvents, externalEvents]);

  // Custom event component
  const EventComponent = useCallback(({ event }: { event: CalendarTaskEvent | any }) => {
    // Handle external events differently
    if (event.resource?.isExternal) {
      return (
        <div className={cn(
          "p-1 rounded text-xs font-medium",
          "bg-muted border-l-2",
          event.resource.provider === 'google' ? 'border-l-blue-500' : 'border-l-gray-500'
        )}>
          <div className="flex items-center gap-1">
            <div className={cn(
              "w-1.5 h-1.5 rounded-full flex-shrink-0",
              event.resource.provider === 'google' ? 'bg-blue-500' : 'bg-gray-500'
            )} />
            <span className="truncate">{event.title}</span>
          </div>
        </div>
      );
    }
    
    // Render task events with CalendarTaskItem
    return <CalendarTaskItem event={event} />;
  }, []);

  // Handle view change
  const handleViewChange = useCallback((view: View) => {
    setCurrentView(view as CalendarViewType);
  }, []);

  // Handle date navigation
  const handleNavigate = useCallback((date: Date) => {
    setCurrentDate(date);
    // Load external events for the new date range
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    loadExternalEvents(startOfMonth, endOfMonth);
  }, [loadExternalEvents]);

  // Handle slot selection (create new task)
  const handleSelectSlot = useCallback(
    ({ start, end }: { start: Date; end: Date }) => {
      const title = prompt('Enter task title:');
      if (title) {
        createTask({
          title,
          description: '',
          dueDate: start,
          status: 'todo' as const,
          priority: 'medium' as const,
          tags: [],
        });
      }
    },
    [createTask]
  );

  // Handle event selection (edit existing task)
  const handleSelectEvent = useCallback((event: CalendarTaskEvent | any) => {
    if (event.resource?.isExternal) {
      console.log('Selected external event:', event);
      // Could open a view-only dialog for external events
      return;
    }
    
    // TODO: Open task edit dialog
    console.log('Selected task:', event.task);
  }, []);

  // Custom calendar styles
  const calendarStyle = useMemo(
    () => ({
      height: 600,
    }),
    []
  );

  // Apply calendar settings
  const minTime = useMemo(() => 
    new Date(2000, 1, 1, calendarSettings.startTime, 0, 0), 
    [calendarSettings.startTime]
  );
  
  const maxTime = useMemo(() => 
    new Date(2000, 1, 1, calendarSettings.endTime, 0, 0), 
    [calendarSettings.endTime]
  );

  return (
    <div className="flex flex-col space-y-4 h-full">
      {/* Calendar Header */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold">Calendar</h2>
            <Select value={currentView} onValueChange={(value) => setCurrentView(value as CalendarViewType)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Month</SelectItem>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="work_week">Work Week</SelectItem>
                <SelectItem value="day">Day</SelectItem>
                <SelectItem value="agenda">Agenda</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSelectSlot({ start: new Date(), end: new Date() })}
            >
              <Plus className="w-4 h-4 mr-2" />
              New Task
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSettingsOpen(true)}
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </Card>

      {/* Calendar */}
      <Card className="flex-1 p-4">
        <div className={cn("calendar-container", "bg-background")}>
          <BigCalendar
            localizer={localizer}
            events={allEvents}
            startAccessor="start"
            endAccessor="end"
            style={calendarStyle}
            view={currentView}
            views={{
              month: true,
              week: true,
              work_week: true,
              day: true,
              agenda: true,
            }}
            date={currentDate}
            onView={handleViewChange}
            onNavigate={handleNavigate}
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            selectable
            popup
            components={{
              event: EventComponent,
            }}
            eventPropGetter={(event: CalendarTaskEvent | any) => {
              // External events styling
              if (event.resource?.isExternal) {
                const providerColors = {
                  google: '#4285f4',
                  apple: '#6c757d',
                };
                
                return {
                  style: {
                    backgroundColor: `${providerColors[event.resource.provider] || '#6c757d'}20`,
                    border: `1px solid ${providerColors[event.resource.provider] || '#6c757d'}60`,
                    borderRadius: '4px',
                    padding: '2px',
                  },
                };
              }
              
              // Task events styling
              const priorityColors = {
                low: '#10b981',
                medium: '#f59e0b', 
                high: '#ef4444',
                urgent: '#6b7280',
              };
              
              return {
                style: {
                  backgroundColor: `${priorityColors[event.resource?.priority || 'medium']}20`,
                  border: `1px solid ${priorityColors[event.resource?.priority || 'medium']}60`,
                  borderRadius: '4px',
                  padding: '2px',
                },
              };
            }}
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
        onSettingsChange={setCalendarSettings}
      />
    </div>
  );
};

export default CalendarView;
