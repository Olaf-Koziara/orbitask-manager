import { create } from 'zustand';
import { Task, TaskStatus } from '../types';

interface TaskStore {
  tasks: Record<TaskStatus, Task[]>;
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
  setTasks: (tasks: Record<TaskStatus, Task[]>) => void;
  addTask: (task: Task) => void;
  updateTaskInStore: (task: Task) => void;
  removeTask: (taskId: string) => void;
  moveTaskInStore: (taskId: string, newStatus: TaskStatus, task: Task) => void;
  setFilters: (filters: TaskStore['filters']) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: {
    [TaskStatus.TODO]: [],
    [TaskStatus.IN_PROGRESS]: [],
    [TaskStatus.REVIEW]: [],
    [TaskStatus.DONE]: [],
  },
  filters: {},
  isLoading: false,
  error: null,

  setTasks: (tasks) => set({ tasks }),
  
  addTask: (task:Task) => set(state => ({
    tasks: {
      ...state.tasks,
      [task.status]: [...state.tasks[task.status], task]
    }
  })),

  updateTaskInStore: (task) => set(state => {
    const updatedTasks = { ...state.tasks };
    Object.keys(updatedTasks).forEach(status => {
      const taskIndex = updatedTasks[status].findIndex(t => t.id === task._id);
      if (taskIndex !== -1) {
        updatedTasks[status][taskIndex] = task;
      }
    });
    return { tasks: updatedTasks };
  }),

  moveTaskInStore: (taskId, newStatus, task) => set(state => {
    const oldTasks = { ...state.tasks };
    
    Object.keys(oldTasks).forEach(status => {
      oldTasks[status] = oldTasks[status].filter(t => t.id !== taskId);
    });

    oldTasks[newStatus] = [...oldTasks[newStatus], task];
    
    return { tasks: oldTasks };
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
