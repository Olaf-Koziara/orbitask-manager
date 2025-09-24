import { create } from 'zustand';
import { Task, TaskStatus } from '../types';

interface TaskStore {
  tasks: Task[];
  isLoading: boolean;
  error: Error | null;
  
  // Actions
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTaskInStore: (task: Task) => void;
  removeTask: (taskId: string) => void;
  setTaskStatusInStore: (taskId: string, newStatus: TaskStatus) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  isLoading: false,
  error: null,

  setTasks: (tasks) => set({ tasks }),
  
  addTask: (task: Task) => 
    set((state) => ({ 
      tasks: [...state.tasks, task] 
    })),

  updateTaskInStore: (task) => 
    set((state) => ({
      tasks: state.tasks.map((t) => (t._id === task._id ? task : t))
    })),

  setTaskStatusInStore: (taskId, newStatus) => 
    set((state) => ({
      tasks: state.tasks.map((t) => 
        t._id === taskId ? { ...t, status: newStatus } : t
      )
    })),

  removeTask: (taskId) => 
    set((state) => ({
      tasks: state.tasks.filter((t) => t._id !== taskId)
    })),

  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}));
