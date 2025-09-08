import { trpc } from "@/api/trpc";
import { CheckCircle2, Clock, FolderOpen, Users } from "lucide-react";
import React from "react";
import TaskStatisticsCard from "./components/TasksStatisticsCard";

export const TaskStatistics: React.FC = () => {
  const { data: stats, isLoading } = trpc.tasks.getStats.useQuery();
  const { data: myTasks } = trpc.tasks.list.useQuery({ assignee: "me" });

  if (isLoading || !stats) {
    return <div>Loading...</div>;
  }

  const myTasksStats = myTasks
    ? {
        total: myTasks.length,
        completed: myTasks.filter((task) => task.status === "done").length,
        inProgress: myTasks.filter((task) => task.status === "in-progress")
          .length,
      }
    : {
        total: 0,
        completed: 0,
        inProgress: 0,
      };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <TaskStatisticsCard
        title="Total Tasks"
        value={stats.total}
        subtitle="Across all projects"
        icon={<FolderOpen className="h-5 w-5" />}
        trend={{ value: 12, isPositive: true }}
        className="bg-gradient-card"
      />

      <TaskStatisticsCard
        title="Completed"
        value={stats.completed}
        subtitle={`${stats.completionRate}% completion rate`}
        icon={<CheckCircle2 className="h-5 w-5" />}
        trend={{ value: 8, isPositive: true }}
        className="bg-gradient-card"
      />

      <TaskStatisticsCard
        title="In Progress"
        value={stats.inProgress}
        subtitle="Currently active"
        icon={<Clock className="h-5 w-5" />}
        trend={{ value: 3, isPositive: false }}
        className="bg-gradient-card"
      />

      <TaskStatisticsCard
        title="My Tasks"
        value={myTasksStats.total}
        subtitle={`${myTasksStats.completed} completed`}
        icon={<Users className="h-5 w-5" />}
        className="bg-gradient-card"
      />
    </div>
  );
};
