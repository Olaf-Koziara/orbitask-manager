import { useState, useCallback } from 'react';
import { Task, FilterState, TaskStatus } from '@/types';

/**
 * Custom hook for managing tasks with filtering and sorting capabilities
 */
export const useTaskManager = (initialTasks: Task[]) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [filters, setFilters] = useState<FilterState>({});

  const addTask = useCallback((task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setTasks(prev => [...prev, newTask]);
  }, []);

  const updateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, ...updates, updatedAt: new Date() }
        : task
    ));
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  }, []);

  const moveTask = useCallback((taskId: string, newStatus: TaskStatus) => {
    updateTask(taskId, { status: newStatus });
  }, [updateTask]);

  const filteredTasks = useCallback(() => {
    return tasks.filter(task => {
      if (filters.status && task.status !== filters.status) return false;
      if (filters.priority && task.priority !== filters.priority) return false;
      if (filters.assignee && task.assignee?.id !== filters.assignee) return false;
      if (filters.tags?.length && !filters.tags.some(tag => task.tags.includes(tag))) return false;
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matches = task.title.toLowerCase().includes(searchLower) ||
                       task.description.toLowerCase().includes(searchLower);
        if (!matches) return false;
      }
      if (filters.dateRange) {
        const taskDate = new Date(task.dueDate || '');
        if (taskDate < filters.dateRange.from || taskDate > filters.dateRange.to) return false;
      }
      return true;
    });
  }, [tasks, filters]);

  const updateFilters = useCallback((newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  return {
    tasks: filteredTasks(),
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    filters,
    updateFilters,
  };
};
