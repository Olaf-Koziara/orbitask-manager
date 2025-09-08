import { create } from 'zustand';
import { Task, TaskStatus } from '../types';

interface TaskStore {
  tasks: Task[];
  filters: {
    status?: TaskStatus;
    priority?: string;
    assignee?: string;
    tags?: string[];
    search?: string;
    dateRange?: {
      from: Date;
      to: Date;
    };
  };
  isLoading: boolean;
  error: Error | null;
  setTasks: (tasks:  Task[]) => void;
  addTask: (task: Task) => void;
  updateTaskInStore: (task: Task) => void;
  removeTask: (taskId: string) => void;
  setTaskStatusInStore: (taskId: string, newStatus: TaskStatus) => void;
  setFilters: (filters: TaskStore['filters']) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  filters: {},
  isLoading: false,
  error: null,

  setTasks: (tasks) => set({ tasks }),
  
  addTask: (task:Task) => set(state => ({
    tasks: [...state.tasks, task]
  })),

  updateTaskInStore: (task) => set(state => {
    const updatedTasks = state.tasks.map(t => t._id === task._id ? task : t);
    set({ tasks: updatedTasks });
    return { tasks: updatedTasks };
  }),

  setTaskStatusInStore: (taskId, newStatus) => set(state => {
    const updatedTasks = state.tasks.map(t => {
      if (t._id === taskId) {
        return { ...t, status: newStatus };
      }
      return t;
    });
    set({ tasks: updatedTasks });
    return { tasks: updatedTasks };
  
    
  }),

  removeTask: (taskId) => set(state => {
    const newTasks = { ...state.tasks };
    Object.keys(newTasks).forEach(status => {
      newTasks[status] = newTasks[status].filter(t => t.id !== taskId);
    });
    return { tasks: newTasks };
  }),

  setFilters: (newFilters) => set({ filters: newFilters }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}));
