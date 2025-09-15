import { trpc } from "@/api/trpc";
import { Card } from "@/features/shared/components/ui/card";
import { cn } from "@/utils/utils";
import {
  CheckCircle2,
  Clock,
  FolderOpen,
  TrendingUp,
  Users,
} from "lucide-react";
import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  className,
}) => {
  return (
    <Card className={cn("card-elevated p-6 hover-lift", className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold">{value}</h3>
            {trend && (
              <span
                className={cn(
                  "text-xs font-medium flex items-center gap-1",
                  trend.isPositive ? "text-success" : "text-destructive"
                )}
              >
                <TrendingUp
                  className={cn("h-3 w-3", !trend.isPositive && "rotate-180")}
                />
                {Math.abs(trend.value)}%
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div className="p-3 rounded-lg bg-primary/10 text-primary">{icon}</div>
      </div>
    </Card>
  );
};

export const StatsCards: React.FC = () => {
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
      <StatCard
        title="Total Tasks"
        value={stats.total}
        subtitle="Across all projects"
        icon={<FolderOpen className="h-5 w-5" />}
        trend={{ value: 12, isPositive: true }}
        className="bg-gradient-card"
      />

      <StatCard
        title="Completed"
        value={stats.completed}
        subtitle={`${stats.completionRate}% completion rate`}
        icon={<CheckCircle2 className="h-5 w-5" />}
        trend={{ value: 8, isPositive: true }}
        className="bg-gradient-card"
      />

      <StatCard
        title="In Progress"
        value={stats.inProgress}
        subtitle="Currently active"
        icon={<Clock className="h-5 w-5" />}
        trend={{ value: 3, isPositive: false }}
        className="bg-gradient-card"
      />

      <StatCard
        title="My Tasks"
        value={myTasksStats.total}
        subtitle={`${myTasksStats.completed} completed`}
        icon={<Users className="h-5 w-5" />}
        className="bg-gradient-card"
      />
    </div>
  );
};
