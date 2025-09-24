import { useMemo } from 'react';
import { useTasks } from './useTasks';
import type { CalendarTaskEvent } from '../types/calendar';

export const useCalendarTasks = () => {
  const { tasks, ...taskOperations } = useTasks();

  // Convert tasks to calendar events
  const calendarEvents = useMemo((): CalendarTaskEvent[] => {
    return tasks.map((task) => {
      // Use dueDate if available, otherwise use createdAt
      const eventDate = task.dueDate ? new Date(task.dueDate) : new Date(task.createdAt);
      
      // For tasks with specific due dates, create a timed event
      // For tasks without specific times, create all-day events
      const hasSpecificTime = task.dueDate && 
        !task.dueDate.toString().includes('00:00:00');
      
      let start: Date;
      let end: Date;
      
      if (hasSpecificTime) {
        start = eventDate;
        // Default duration of 1 hour for timed tasks
        end = new Date(eventDate.getTime() + 60 * 60 * 1000);
      } else {
        // All-day event
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
  }, [tasks]);

  return {
    calendarEvents,
    ...taskOperations,
  };
};