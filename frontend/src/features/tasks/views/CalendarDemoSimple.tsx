import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../components/calendar.css';
import { useCallback, useMemo, useState } from 'react';
import { CalendarTaskItem } from '../components/CalendarTaskItem';
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
import { Badge } from '@/features/shared/components/ui/badge';
import { Plus, Calendar } from 'lucide-react';
import { cn } from '@/utils/utils';

// Setup the localizer for React Big Calendar
const localizer = momentLocalizer(moment);

// Mock task data for demo
const mockTasks = [
  {
    _id: '1',
    title: 'Complete project proposal',
    description: 'Finish the Q1 project proposal document',
    status: 'in-progress' as const,
    priority: 'high' as const,
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    tags: ['work', 'urgent'],
    assignee: {
      _id: '1',
      name: 'John Doe',
      email: 'john@example.com'
    },
    createdBy: {
      _id: '1', 
      name: 'John Doe',
      email: 'john@example.com'
    },
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
    updatedAt: new Date(),
  },
  {
    _id: '2',
    title: 'Team meeting',
    description: 'Weekly team sync meeting',
    status: 'todo' as const,
    priority: 'medium' as const,
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
    tags: ['meeting'],
    assignee: null,
    createdBy: {
      _id: '1',
      name: 'John Doe', 
      email: 'john@example.com'
    },
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
  },
  {
    _id: '3',
    title: 'Code review',
    description: 'Review pull requests from team members',
    status: 'done' as const,
    priority: 'low' as const,
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Yesterday
    tags: ['development'],
    assignee: {
      _id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com'
    },
    createdBy: {
      _id: '1',
      name: 'John Doe',
      email: 'john@example.com'
    },
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
  },
  {
    _id: '4',
    title: 'Client presentation',
    description: 'Present project update to client stakeholders',
    status: 'review' as const,
    priority: 'urgent' as const,
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now  
    tags: ['client', 'presentation'],
    assignee: null,
    createdBy: {
      _id: '1',
      name: 'John Doe',
      email: 'john@example.com'
    },
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
  }
];

const CalendarDemoSimple = () => {
  const [currentView, setCurrentView] = useState<CalendarView>('month');
  const [currentDate, setCurrentDate] = useState(new Date());

  // Convert mock tasks to calendar events
  const calendarEvents = useMemo((): CalendarTaskEvent[] => {
    return mockTasks.map((task) => {
      const eventDate = task.dueDate ? new Date(task.dueDate) : new Date(task.createdAt);
      const hasSpecificTime = task.dueDate && !task.dueDate.toString().includes('00:00:00');
      
      let start: Date;
      let end: Date;
      
      if (hasSpecificTime) {
        start = eventDate;
        end = new Date(eventDate.getTime() + 60 * 60 * 1000);
      } else {
        start = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
        end = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate() + 1);
      }

      return {
        id: task._id,
        task,
        title: task.title,
        start,
        end,
        allDay: !hasSpecificTime,
        resource: {
          priority: task.priority,
          status: task.status,
          assignee: task.assignee,
          tags: task.tags,
        },
      };
    });
  }, []);

  // Custom event component
  const EventComponent = useCallback(({ event }: { event: CalendarTaskEvent }) => (
    <CalendarTaskItem event={event} />
  ), []);

  // Handle view change
  const handleViewChange = useCallback((view: any) => {
    setCurrentView(view as CalendarView);
  }, []);

  // Handle date navigation
  const handleNavigate = useCallback((date: Date) => {
    setCurrentDate(date);
  }, []);

  // Handle slot selection (create new task)
  const handleSelectSlot = useCallback(({ start, end }: { start: Date; end: Date }) => {
    const title = prompt('Enter task title:');
    if (title) {
      console.log('Would create task:', { title, start, end });
      alert(`Would create task: "${title}" on ${start.toLocaleDateString()}`);
    }
  }, []);

  // Handle event selection
  const handleSelectEvent = useCallback((event: CalendarTaskEvent) => {
    console.log('Selected task:', event.task);
    alert(`Selected task: "${event.task.title}"`);
  }, []);

  // Custom calendar styles
  const calendarStyle = useMemo(() => ({ height: 600 }), []);

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Header */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Calendar className="w-8 h-8 text-primary" />
                Calendar View Demo
              </h1>
              <p className="text-muted-foreground">
                A demonstration of the Orbitask calendar view with React Big Calendar integration
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-sm">
                Demo Mode
              </Badge>
            </div>
          </div>
        </Card>

        {/* Calendar Controls */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-semibold">Calendar</h2>
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
            </div>
          </div>
        </Card>

        {/* Calendar */}
        <Card className="p-4">
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
              min={new Date(2000, 1, 1, 8, 0, 0)}
              max={new Date(2000, 1, 1, 20, 0, 0)}
            />
          </div>
        </Card>

        {/* Features Overview */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Features Implemented</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
              <div>
                <h4 className="font-medium">Small Task Items</h4>
                <p className="text-sm text-muted-foreground">Compact task displays similar to Google Calendar</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
              <div>
                <h4 className="font-medium">Multiple Views</h4>
                <p className="text-sm text-muted-foreground">Month, Week, Day, Work Week, and Agenda views</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
              <div>
                <h4 className="font-medium">Priority Indicators</h4>
                <p className="text-sm text-muted-foreground">Color-coded priorities and status indicators</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
              <div>
                <h4 className="font-medium">Google Calendar Integration</h4>
                <p className="text-sm text-muted-foreground">Ready for integration with Google Calendar API</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
              <div>
                <h4 className="font-medium">Apple Calendar Integration</h4>
                <p className="text-sm text-muted-foreground">Framework ready for Apple Calendar sync</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
              <div>
                <h4 className="font-medium">Task Creation</h4>
                <p className="text-sm text-muted-foreground">Click on calendar slots to create new tasks</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CalendarDemoSimple;