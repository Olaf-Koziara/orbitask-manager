import { trpc } from "@/api/trpc";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { useDebounce } from "@/features/shared/hooks/useDebounce";
import { prepareQueryInput } from "@/features/shared/utils";
import { useFiltersStore } from "@/features/tasks/stores/filters.store";
import { RouterInput } from "@/types";
import React, { useCallback, useMemo } from "react";
import { useTaskStore } from "../stores/tasks.store";
import {
  TaskCreateInput,
  TaskFormValues,
  TaskStatus,
  TaskUpdateData,
} from "../types";
import { TaskService } from "../services/task.service";
import { FilterService } from "@/features/shared/services/filter.service";

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
    setError,
  } = useTaskStore();

  const debouncedFilters = useDebounce(taskFilters, 300);

  const queryInput = useMemo(
    () => FilterService.prepareQueryFilters(debouncedFilters || {}),
    [debouncedFilters]
  );

  const {
    data: fetchedTasks,
    isLoading,
    error,
  } = trpc.tasks.list.useQuery(queryInput as RouterInput["tasks"]["list"], {
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });

  React.useEffect(() => {
    if (fetchedTasks) {
      setTasks(fetchedTasks);
    }
  }, [fetchedTasks, setTasks]);

  const createTask = useCallback(
    async (taskFormValues: TaskFormValues) => {
      const task: TaskCreateInput = TaskService.prepareTaskForCreate(taskFormValues, user.id);
      const originalTasks = [...tasks];
      try {
        setLoading(true);
        const result = await utils.client.tasks.create.mutate(task);
        addTask(result);
        await utils.tasks.invalidate();
      } catch (error) {
        setTasks(originalTasks);
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    },
    [user.id, utils, addTask, setLoading, setError]
  );

  const updateTask = useCallback(
    async (id: string, updates: TaskUpdateData) => {
      const originalTasks = [...tasks];
      try {
        setLoading(true);
        const result = await utils.client.tasks.update.mutate({
          id,
          data: updates,
        });
        updateTaskInStore(result);
        await utils.tasks.invalidate();
      } catch (error) {
        setTasks(originalTasks);
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    },
    [utils, updateTaskInStore, setLoading, setError]
  );

  const setTaskStatus = useCallback(
    async (taskId: string, newStatus: TaskStatus) => {
      const originalTasks = [...tasks];
      setTaskStatusInStore(taskId, newStatus);

      try {
        await utils.client.tasks.update.mutate({
          id: taskId,
          data: { status: newStatus },
        });
        await utils.tasks.invalidate();
      } catch (error) {
        setTasks(originalTasks);
        setError(error as Error);
      }
    },
    [utils, setTaskStatusInStore, setError]
  );

  const deleteTask = useCallback(
    async (taskId: string) => {
      const originalTasks = [...tasks];
      removeTask(taskId);

      try {
        setLoading(true);
        await utils.client.tasks.delete.mutate(taskId);
        await utils.tasks.invalidate();
      } catch (error) {
        setTasks(originalTasks);
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    },
    [tasks, removeTask, utils, setTasks, setLoading, setError]
  );

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
