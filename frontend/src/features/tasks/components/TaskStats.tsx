import { CheckCircle2, Clock, FolderOpen } from "lucide-react";
import React from "react";
import { statusConfig } from "../../shared/config/task.config";
import { useTaskStats } from "../hooks/useTaskStats";
import TaskStatCard from "./TasksStatCard";

export const StatsCards: React.FC = () => {
  const { stats, myTasksStats, isLoading, selectedProjectsCount } =
    useTaskStats();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const subtitle =
    selectedProjectsCount > 0
      ? `Across ${selectedProjectsCount} selected project${
          selectedProjectsCount > 1 ? "s" : ""
        }`
      : "Across all projects";

  return (
    <div className="container mx-auto  grid gap-4 lg:w-1/2 md:grid-cols-2 lg:grid-cols-3">
      <TaskStatCard
        title="Total Tasks"
        value={stats.total}
        subtitle={subtitle}
        icon={<FolderOpen className="h-5 w-5" />}
        className="bg-gradient-card"
      />

      <TaskStatCard
        title="Completed"
        value={stats.completed}
        subtitle={`${stats.completionRate}% completion rate`}
        icon={<CheckCircle2 className="h-5 w-5" />}
        className="bg-gradient-card"
      />

      <TaskStatCard
        title={statusConfig["in-progress"].label}
        value={stats.inProgress}
        subtitle="Currently active"
        icon={<Clock className="h-5 w-5" />}
        className="bg-gradient-card"
      />

      {/* <TaskStatCard
        title="My Tasks"
        value={myTasksStats.total}
        subtitle={`${myTasksStats.completed} completed`}
        icon={<Users className="h-5 w-5" />}
        className="bg-gradient-card"
      /> */}
    </div>
  );
};
