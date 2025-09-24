import { Event } from 'react-big-calendar';
import { Task } from './index';

// Calendar-specific task event interface extending react-big-calendar's Event
export interface CalendarTaskEvent extends Event {
  id: string;
  task: Task;
  start: Date;
  end: Date;
  title: string;
  resource?: {
    priority: Task['priority'];
    status: Task['status'];
    assignee?: Task['assignee'];
    tags: Task['tags'];
  };
}

// Calendar view types
export type CalendarView = 'month' | 'week' | 'work_week' | 'day' | 'agenda';

// Calendar integration types
export interface CalendarIntegration {
  id: string;
  provider: 'google' | 'apple' | 'outlook';
  name: string;
  enabled: boolean;
  syncEnabled: boolean;
  lastSync?: Date;
}

export interface ExternalCalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  provider: 'google' | 'apple' | 'outlook';
  isAllDay: boolean;
  description?: string;
}

// Calendar settings
export interface CalendarSettings {
  defaultView: CalendarView;
  startTime: number; // Hour (0-23)
  endTime: number; // Hour (0-23)
  showWeekends: boolean;
  firstDayOfWeek: 0 | 1; // 0 = Sunday, 1 = Monday
  integrations: CalendarIntegration[];
}