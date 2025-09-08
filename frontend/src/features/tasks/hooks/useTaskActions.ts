import { trpc } from "@/api/trpc";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { useTaskStore } from "../stores/task.store";
import {
  TaskCreateInput,
  TaskFormValues,
  TaskListQueryParams,
  TaskStatus,
  TaskUpdateData,
} from "../types";

export const useTaskActions = () => {
  const utils = trpc.useUtils();
  const {
    addTask,
    updateTaskInStore,
    removeTask,
    setTaskStatusInStore,
    setLoading,
    setError,
    setTasks,
  } = useTaskStore();
  const { user } = useAuthStore();

  const getTaskList = async (params?: TaskListQueryParams) => {
    setLoading(true);
    try {
      const result = await utils.client.tasks.list.query(params);
      setTasks(result);
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskFormValues: TaskFormValues) => {
    const task: TaskCreateInput = {
      ...taskFormValues,
      createdAt: new Date(),
      createdBy: user.id,
    };
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

  const updateTask = async (id: string, updates: TaskUpdateData) => {
    setLoading(true);
    try {
      const result = await utils.client.tasks.update.mutate({
        id,
        data: updates,
      });
      return result;

    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  const setTaskStatus = async (taskId: string, newStatus: TaskStatus) => {
    setLoading(true);
    try {
      setTaskStatusInStore(taskId, newStatus);
      const result = await utils.client.tasks.update.mutate({
        id: taskId,
        data: {
          status: newStatus,
        },
      });
      
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (taskId: string) => {
    setLoading(true);
    try {
      await utils.client.tasks.delete.mutate(taskId);
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
    setTaskStatus,
    deleteTask,
    getTaskList,
  };
};
