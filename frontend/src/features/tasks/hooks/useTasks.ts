import { trpc } from "@/api/trpc";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { useDebounce } from "@/features/shared/hooks/useDebounce";
import { prepeareQueryInput } from "@/features/shared/utils";
import { useFiltersStore } from "@/features/tasks/stores/filters.store";
import React, { useCallback, useMemo } from "react";
import { useTaskStore } from "../stores/tasks.store";
import {
  TaskCreateInput,
  TaskFormValues,
  TaskStatus,
  TaskUpdateData
} from "../types";

export const useTasks = () => {
  const utils = trpc.useUtils();
  const { user } = useAuthStore();
  const { taskFilters } = useFiltersStore();
  const { 
    addTask, 
    updateTaskInStore, 
    removeTask, 
    setTaskStatusInStore, 
    setTasks, 
    tasks,
    setLoading,
    setError 
  } = useTaskStore();

  // Debounce filters for better performance
  const debouncedFilters = useDebounce(taskFilters, 300);
  
  // Memoize query input to prevent unnecessary refetches
  const queryInput = useMemo(() => 
    prepeareQueryInput(debouncedFilters || {}), 
    [debouncedFilters]
  );
  
  // Single query with optimized caching
  const { data: fetchedTasks, isLoading, error } = trpc.tasks.list.useQuery(queryInput, {
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });

  // Update store when data changes
  React.useEffect(() => {
    if (fetchedTasks) {
      setTasks(fetchedTasks);
    }
  }, [fetchedTasks, setTasks]);

  // Optimized task operations with optimistic updates
  const createTask = useCallback(async (taskFormValues: TaskFormValues) => {
    const task: TaskCreateInput = {
      ...taskFormValues,
      createdAt: new Date(),
      createdBy: user.id,
    };
    
    try {
      setLoading(true);
      const result = await utils.client.tasks.create.mutate(task);
      addTask(result);
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  }, [user.id, utils.client.tasks.create, addTask, setLoading, setError]);

  const updateTask = useCallback(async (id: string, updates: TaskUpdateData) => {
    try {
      setLoading(true);
      const result = await utils.client.tasks.update.mutate({ id, data: updates });
      updateTaskInStore(result);
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  }, [utils.client.tasks.update, updateTaskInStore, setLoading, setError]);

  const setTaskStatus = useCallback(async (taskId: string, newStatus: TaskStatus) => {
    // Optimistic update
    setTaskStatusInStore(taskId, newStatus);
    
    try {
      await utils.client.tasks.update.mutate({
        id: taskId,
        data: { status: newStatus },
      });
    } catch (error) {
      // Revert on error (you might want to implement this)
      setError(error as Error);
    }
  }, [utils.client.tasks.update, setTaskStatusInStore, setError]);

  const deleteTask = useCallback(async (taskId: string) => {
    // Optimistic update
    const originalTasks = [...tasks];
    removeTask(taskId);
    
    try {
      setLoading(true);
      await utils.client.tasks.delete.mutate(taskId);
    } catch (error) {
      // Revert on error
      setTasks(originalTasks);
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  }, [tasks, removeTask, utils.client.tasks.delete, setTasks, setLoading, setError]);

  return {
    tasks,
    isLoading,
    error,
    createTask,
    updateTask,
    setTaskStatus,
    deleteTask,
  };
};
