import { useAuthStore } from "@/features/auth/stores/auth.store";
import { useMemo } from "react";
import { useFiltersStore } from "../stores/filters.store";
import { useTaskStore } from "../stores/tasks.store";
import { Task } from "../types";

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
  const { tasks } = useTaskStore();
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
      // Handle both populated assignee object and assignee ID string
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
    isLoading: false, // Since we're calculating from existing data
    selectedProjectsCount: selectedProjects.length,
  };
};
