import { useAuthStore } from "@/features/auth/stores/auth.store";
import { useTasks } from "@/features/tasks/hooks/useTasks";
import { useFiltersStore } from "@/features/tasks/stores/filters.store";
import { Task } from "@/features/tasks/types";
import { useMemo } from "react";

export interface TaskStats {
  total: number;
  completed: number;
  inProgress: number;
  overdue: number;
  completionRate: number;
}

export interface MyTaskStats {
  total: number;
  completed: number;
  inProgress: number;
}

export const useTaskStats = () => {
  const { tasks, isLoading } = useTasks();
  const { selectedProjects } = useFiltersStore();
  const { user } = useAuthStore();

  const stats = useMemo((): TaskStats => {
    if (!tasks.length) {
      return {
        total: 0,
        completed: 0,
        inProgress: 0,
        overdue: 0,
        completionRate: 0,
      };
    }

    const now = new Date();
    const total = tasks.length;
    const completed = tasks.filter((task) => task.status === "done").length;
    const inProgress = tasks.filter(
      (task) => task.status === "in-progress"
    ).length;
    const overdue = tasks.filter(
      (task) =>
        task.status !== "done" && task.dueDate && new Date(task.dueDate) < now
    ).length;

    const completionRate =
      total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      inProgress,
      overdue,
      completionRate,
    };
  }, [tasks]);

  const myTasksStats = useMemo((): MyTaskStats => {
    if (!user || !tasks.length) {
      return {
        total: 0,
        completed: 0,
        inProgress: 0,
      };
    }

    const myTasks = tasks.filter((task: Task) => {
      if (!task.assignee) return false;

      let assigneeId: string;
      if (typeof task.assignee === "string") {
        assigneeId = task.assignee;
      } else if (typeof task.assignee === "object") {
        assigneeId =
          (task.assignee as { _id?: string; id?: string })._id ||
          (task.assignee as { _id?: string; id?: string }).id ||
          "";
      } else {
        return false;
      }

      return assigneeId === user.id;
    });

    const total = myTasks.length;
    const completed = myTasks.filter((task) => task.status === "done").length;
    const inProgress = myTasks.filter(
      (task) => task.status === "in-progress"
    ).length;

    return {
      total,
      completed,
      inProgress,
    };
  }, [tasks, user]);

  return {
    stats,
    myTasksStats,
    isLoading,
    selectedProjectsCount: selectedProjects.length,
  };
};
