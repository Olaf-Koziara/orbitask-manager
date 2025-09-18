import { trpc } from "@/api/trpc";
import { AlertTriangle, CheckCircle2, Clock, User } from "lucide-react";
import React from "react";
import TaskStatisticsCard from "./components/TasksStatisticsCard";
import TaskStatusChart from "./components/TaskStatusChart";

export const TaskStatistics: React.FC = () => {
  const { data: stats, isLoading } = trpc.tasks.getStats.useQuery();

  if (isLoading || !stats) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="lg:col-span-1">
        <TaskStatusChart data={stats.tasksByStatus} />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <TaskStatisticsCard
          title="Active Tasks"
          value={stats.activeTasks}
          subtitle="Currently in progress"
          icon={<Clock className="h-5 w-5" />}
          className="bg-gradient-card"
        />

        <TaskStatisticsCard
          title="My Tasks"
          value={stats.myTasks}
          subtitle="Assigned to me"
          icon={<User className="h-5 w-5" />}
          className="bg-gradient-card"
        />

        <TaskStatisticsCard
          title="Due in 24h"
          value={stats.upcomingDeadlines.in24Hours}
          subtitle="Require attention"
          icon={<AlertTriangle className="h-5 w-5" />}
          className="bg-gradient-card"
        />

        <TaskStatisticsCard
          title="Due this week"
          value={stats.upcomingDeadlines.inWeek}
          subtitle="Upcoming deadlines"
          icon={<CheckCircle2 className="h-5 w-5" />}
          className="bg-gradient-card"
        />
      </div>

      {/* Task Progress Chart */}
      <div className="">
        {/* Additional Statistics */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <TaskStatisticsCard
              title="Total Tasks"
              value={stats.total}
              subtitle="Across all projects"
              icon={<Clock className="h-5 w-5" />}
              className="bg-gradient-card"
            />

            <TaskStatisticsCard
              title="Progress"
              value={`${stats.completionRate}%`}
              subtitle="Tasks completed"
              icon={<CheckCircle2 className="h-5 w-5" />}
              className="bg-gradient-card"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
