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

type TasksQueryInput = RouterInput["tasks"]["list"];

export const useTasks = () => {
  const utils = trpc.useUtils();
  const { user } = useAuthStore();
  const { taskFilters } = useFiltersStore();

  const debouncedFilters = useDebounce(taskFilters, 300);

  const queryInput = useMemo(
    () => FilterService.prepareQueryFilters(debouncedFilters || {}) as TasksQueryInput,
    [debouncedFilters]
  );

  const {
    data: tasks = [],
    isLoading,
    error,
  } = trpc.tasks.list.useQuery(queryInput, {
    staleTime: 30000,
    refetchOnWindowFocus: false,
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

      const optimisticTask = TaskService.createOptimisticTask(newTask, user) as Task;
      setOptimisticData((old) => (old ? [...old, optimisticTask] : [optimisticTask]));

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

      setOptimisticData((old) =>
        old?.map((task) => {
          if (task._id !== input.id) return task;

          const { dueDate, createdAt, updatedAt, assignee, createdBy, ...safeFields } =
            input.data ?? {};

          return {
            ...task,
            ...safeFields,
            ...(dueDate && { dueDate: new Date(dueDate).toISOString() }),
            updatedAt: new Date().toISOString(),
          };
        }) ?? []
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

      setOptimisticData((old) => old?.filter((task) => task._id !== taskId) ?? []);

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
    const task = TaskService.prepareTaskForCreate(taskFormValues, user.id);
    return createMutation.mutateAsync(task);
  };

  const updateTask = (id: string, updates: TaskUpdateData) => {
    return updateMutation.mutateAsync({ id, data: updates });
  };

  const setTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    return updateMutation.mutateAsync({ id: taskId, data: { status: newStatus } });
  };

  const deleteTask = (taskId: string) => {
    return deleteMutation.mutateAsync(taskId);
  };

  return {
    tasks,
    isLoading,
    error,
    createTask,
    updateTask,
    setTaskStatus,
    deleteTask,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
