import { trpc } from "@/api/trpc";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { useDebounce } from "@/features/shared/hooks/useDebounce";
import { prepeareQueryInput } from "@/features/shared/utils";
import { useEffect, useMemo } from "react";
import { useTaskStore } from "../stores/tasks.store";
import {
  TaskCreateInput,
  TaskFormValues,
  TaskStatus,
  TaskUpdateData
} from "../types";

export const useTasks = () => {
  const utils = trpc.useUtils();
  const {
    addTask,
    updateTaskInStore,
    removeTask,
    setTaskStatusInStore,
    setLoading,
    setError,
    setTasks,
    tasks,
    filters
  } = useTaskStore();
  const { user } = useAuthStore();

  const debouncedFilters = useDebounce(filters, 300);
  
  // Create a stable query input that prevents unnecessary re-renders
  const queryInput = useMemo(() => {
    if (!debouncedFilters) return {};
    
    const prepared = prepeareQueryInput(debouncedFilters);
    return prepared;
  }, [
    debouncedFilters?.status,
    debouncedFilters?.priority,
    debouncedFilters?.assignee,
    debouncedFilters?.search,
    debouncedFilters?.projectId,
    JSON.stringify(debouncedFilters?.tags),
  ]);
  
  
  const tasksQuery = trpc.tasks.list.useQuery(queryInput, {
    staleTime: 30000, // Consider data fresh for 30 seconds
    refetchOnWindowFocus: false, // Prevent refetch on window focus
  });
  useEffect(() => {
    if (tasksQuery.data) {
      setTasks(tasksQuery.data);
    }
  }, [tasksQuery.data, setTasks]);
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
      updateTaskInStore(result);
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
    const originalTasks = [...tasks];
    try {
      removeTask(taskId);
      await utils.client.tasks.delete.mutate(taskId);
    } catch (error) {
      setTasks(originalTasks); 
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
    tasks
    
  };
};
