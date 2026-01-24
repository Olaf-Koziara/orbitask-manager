import { trpc } from "@/api/trpc";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { useDebounce } from "@/features/shared/hooks/useDebounce";
import { FilterService } from "@/features/shared/services/filter.service";
import { RouterInput } from "@/features/shared/types";
import { TaskService } from "@/features/tasks/services/task.service";
import { useFiltersStore } from "@/features/tasks/stores/filters.store";
import {
  Task,
  TaskCreateInput,
  TaskFormValues,
  TaskStatus,
  TaskUpdateData,
} from "@/features/tasks/types";
import { useMemo } from "react";
import { keepPreviousData } from "@tanstack/react-query";

type TasksQueryInput = RouterInput["tasks"]["list"];

export const useTasks = () => {
  const utils = trpc.useUtils();
  const { user } = useAuthStore();
  const { taskFilters } = useFiltersStore();

  const debouncedFilters = useDebounce(taskFilters, 300);

  const queryInput = useMemo(
    () =>
      FilterService.prepareQueryFilters(
        debouncedFilters || {}
      ) as TasksQueryInput,
    [debouncedFilters]
  );

  const {
    data: tasks = [],
    isLoading,
    error,
    isFetching,
  } = trpc.tasks.list.useQuery(queryInput, {
    staleTime: 30000,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });

  const getPreviousTasks = () => utils.tasks.list.getData(queryInput);

  const setOptimisticData = (updater: (old: Task[] | undefined) => Task[]) => {
    utils.tasks.list.setData(queryInput, updater);
  };

  const rollback = (previousTasks: Task[] | undefined) => {
    if (previousTasks) {
      utils.tasks.list.setData(queryInput, previousTasks);
    }
  };

  const createMutation = trpc.tasks.create.useMutation({
    onMutate: async (newTask: TaskCreateInput) => {
      await utils.tasks.list.cancel();
      const previousTasks = getPreviousTasks();

      if (user) {
        const optimisticTask = TaskService.createOptimisticTask(
          newTask,
          user
        ) as Task;
        setOptimisticData((old) =>
          old ? [...old, optimisticTask] : [optimisticTask]
        );
      }

      return { previousTasks };
    },
    onError: (_err, _newTask, context) => {
      rollback(context?.previousTasks);
    },
    onSettled: () => {
      utils.tasks.list.invalidate();
    },
  });

  const updateMutation = trpc.tasks.update.useMutation({
    onMutate: async (input) => {
      if (!input) return { previousTasks: undefined };

      await utils.tasks.list.cancel();
      const previousTasks = getPreviousTasks();

      setOptimisticData(
        (old) =>
          old?.map((task) =>
            task._id === input.id
              ? TaskService.prepareOptimisticUpdate(task, input.data ?? {})
              : task
          ) ?? []
      );

      return { previousTasks };
    },
    onError: (_err, _variables, context) => {
      rollback(context?.previousTasks);
    },
    onSettled: () => {
      utils.tasks.list.invalidate();
    },
  });

  const deleteMutation = trpc.tasks.delete.useMutation({
    onMutate: async (taskId: string) => {
      await utils.tasks.list.cancel();
      const previousTasks = getPreviousTasks();

      setOptimisticData(
        (old) => old?.filter((task) => task._id !== taskId) ?? []
      );

      return { previousTasks };
    },
    onError: (_err, _taskId, context) => {
      rollback(context?.previousTasks);
    },
    onSettled: () => {
      utils.tasks.list.invalidate();
    },
  });

  const createTask = (taskFormValues: TaskFormValues) => {
    if (!user) {
      throw new Error("User must be authenticated to create tasks");
    }
    const task = TaskService.prepareTaskForCreate(taskFormValues, user.id);
    return createMutation.mutateAsync(task);
  };

  const updateTask = (id: string, updates: TaskUpdateData) => {
    return updateMutation.mutateAsync({ id, data: updates });
  };
  const updateTaskOptimistic = (id: string, updates: TaskUpdateData) => {
    setOptimisticData(
      (old) =>
        old?.map((task) =>
          task._id === id
            ? TaskService.prepareOptimisticUpdate(task, updates)
            : task
        ) ?? []
    );
  };

  const setTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    return updateMutation.mutateAsync({
      id: taskId,
      data: { status: newStatus },
    });
  };

  const deleteTask = (taskId: string) => {
    return deleteMutation.mutateAsync(taskId);
  };

  return {
    tasks,
    isLoading, // This will now remain false during refetches if data exists
    isFetching, // Exposed if UI needs to show a subtle spinner
    error,
    createTask,
    updateTask,
    updateTaskOptimistic,
    setTaskStatus,
    deleteTask,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
