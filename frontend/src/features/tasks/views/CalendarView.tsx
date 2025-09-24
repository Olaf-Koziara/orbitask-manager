import { Calendar as BigCalendar, momentLocalizer, View, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../components/calendar.css';
import { useCallback, useMemo, useState } from 'react';
import { CalendarTaskItem } from '../components/CalendarTaskItem';
import { useCalendarTasks } from '../hooks/useCalendarTasks';
import type { CalendarTaskEvent, CalendarView } from '../types/calendar';
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
  const [currentView, setCurrentView] = useState<CalendarView>('month');
  const [currentDate, setCurrentDate] = useState(new Date());

  // Custom event component
  const EventComponent = useCallback(({ event }: { event: CalendarTaskEvent }) => (
    <CalendarTaskItem event={event} />
  ), []);

  // Handle view change
  const handleViewChange = useCallback((view: View) => {
    setCurrentView(view as CalendarView);
  }, []);

  // Handle date navigation
  const handleNavigate = useCallback((date: Date) => {
    setCurrentDate(date);
  }, []);

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
  const handleSelectEvent = useCallback((event: CalendarTaskEvent) => {
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

  return (
    <div className="flex flex-col space-y-4 h-full">
      {/* Calendar Header */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold">Calendar</h2>
            <Select value={currentView} onValueChange={(value) => setCurrentView(value as CalendarView)}>
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
            <Button variant="outline" size="sm">
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
            events={calendarEvents}
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
            eventPropGetter={(event: CalendarTaskEvent) => {
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
            min={new Date(2000, 1, 1, 8, 0, 0)} // 8 AM
            max={new Date(2000, 1, 1, 20, 0, 0)} // 8 PM
          />
        </div>
      </Card>
    </div>
  );
};

export default CalendarView;
