import { trpc } from '@/utils/trpc';
import { useTaskStore } from '../stores/taskStore';
import { Task, TaskStatus } from '../types';

export const useTaskActions = () => {
  const utils = trpc.useUtils();
  const { addTask, updateTaskInStore, removeTask, moveTaskInStore, setLoading, setError } = useTaskStore();

  const createTask = async (task: Omit<Task, 'id'>) => {
    setLoading(true);
    try {
      const result = await utils.client.tasks.create.mutate(task);
      addTask(result);
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    setLoading(true);
    try {
      const result = await utils.client.tasks.update.mutate({ id, ...updates });
      updateTaskInStore(result);
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  const moveTask = async (taskId: string, newStatus: TaskStatus) => {
    setLoading(true);
    try {
      const result = await utils.client.tasks.update.mutate({ 
        id: taskId, 
        data:{
          status: newStatus
        }
      });
      moveTaskInStore(taskId, newStatus, result);
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (taskId: string) => {
    setLoading(true);
    try {
      await utils.client.tasks.delete.mutate(taskId );
      removeTask(taskId);
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  return {
    createTask,
    updateTask,
    moveTask,
    deleteTask,
  };
};