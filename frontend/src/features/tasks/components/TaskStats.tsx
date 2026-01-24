import { CheckCircle2, Clock, FolderOpen } from "lucide-react";
import React from "react";
import { statusConfig } from "@/features/shared/config/task.config";
import { useTaskStats } from "@/features/tasks/hooks/useTaskStats";
import TaskStatCard from "@/features/tasks/components/TasksStatCard";

export const StatsCards: React.FC = () => {
  const { stats, myTasksStats, isLoading, selectedProjectsCount } =
    useTaskStats();

  if (isLoading) {
    return (
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 rounded-xl bg-muted/20 animate-pulse" />
        ))}
      </div>
    );
  }

  const subtitle =
    selectedProjectsCount > 0
      ? `Across ${selectedProjectsCount} project${
          selectedProjectsCount > 1 ? "s" : ""
        }`
      : "All projects";

  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
      <TaskStatCard
        title="Total Tasks"
        value={stats.total}
        subtitle={subtitle}
        icon={<FolderOpen className="h-4 w-4" />}
      />

      <TaskStatCard
        title="Completed"
        value={stats.completed}
        subtitle={`${stats.completionRate}% completion`}
        icon={<CheckCircle2 className="h-4 w-4" />}
      />

      <TaskStatCard
        title={statusConfig["in-progress"].label}
        value={stats.inProgress}
        subtitle="Currently active"
        icon={<Clock className="h-4 w-4" />}
      />
    </div>
  );
};
