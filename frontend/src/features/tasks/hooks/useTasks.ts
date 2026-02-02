import { trpc } from "@/api/trpc";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { useDebounce } from "@/features/shared/hooks/useDebounce";
import { FilterService } from "@/features/shared/services/filter.service";
import { RouterInput, RouterOutput } from "@/features/shared/types";
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
import { InfiniteData, keepPreviousData } from "@tanstack/react-query";

type TasksQueryInput = RouterInput["tasks"]["list"];
type TasksQueryOutput = RouterOutput["tasks"]["list"];

export const useTasks = (overrides?: Partial<TasksQueryInput>) => {
  const utils = trpc.useUtils();
  const { user } = useAuthStore();
  const { taskFilters } = useFiltersStore();

  const debouncedFilters = useDebounce(taskFilters, 300);

  const queryInput = useMemo(
    () =>
      ({
        ...FilterService.prepareQueryFilters(debouncedFilters || {}),
        ...overrides,
      }) as TasksQueryInput,
    [debouncedFilters, overrides]
  );

  const {
    data,
    isLoading,
    error,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = trpc.tasks.list.useInfiniteQuery(queryInput, {
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialCursor: 0,
    staleTime: 30000,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });

  const tasks = useMemo(
    () => data?.pages.flatMap((p) => p.items) ?? [],
    [data]
  );

  const getPreviousTasks = () => utils.tasks.list.getInfiniteData(queryInput);

  const setOptimisticData = (
    updater: (
      old: InfiniteData<TasksQueryOutput> | undefined
    ) => InfiniteData<TasksQueryOutput> | undefined
  ) => {
    utils.tasks.list.setInfiniteData(queryInput, updater);
  };

  const rollback = (
    previousTasks: InfiniteData<TasksQueryOutput> | undefined
  ) => {
    if (previousTasks) {
      utils.tasks.list.setInfiniteData(queryInput, previousTasks);
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
        setOptimisticData((old) => {
          if (!old) {
            return {
              pages: [{ items: [optimisticTask], nextCursor: undefined }],
              pageParams: [0],
            };
          }
          const firstPage = old.pages[0];
          return {
            ...old,
            pages: [
              { ...firstPage, items: [optimisticTask, ...firstPage.items] },
              ...old.pages.slice(1),
            ],
          };
        });
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

      setOptimisticData((old) => {
        if (!old) return undefined;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            items: page.items.map((task) =>
              task._id === input.id
                ? (TaskService.prepareOptimisticUpdate(
                    task,
                    input.data ?? {}
                  ) as Task)
                : task
            ),
          })),
        };
      });

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

      setOptimisticData((old) => {
        if (!old) return undefined;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            items: page.items.filter((task) => task._id !== taskId),
          })),
        };
      });

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
    setOptimisticData((old) => {
      if (!old) return undefined;
      return {
        ...old,
        pages: old.pages.map((page) => ({
          ...page,
          items: page.items.map((task) =>
            task._id === id
              ? (TaskService.prepareOptimisticUpdate(task, updates) as Task)
              : task
          ),
        })),
      };
    });
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
    isLoading,
    isFetching,
    error,
    createTask,
    updateTask,
    updateTaskOptimistic,
    setTaskStatus,
    deleteTask,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
