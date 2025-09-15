import { StatsCards } from "@/features/shared/components/StatsCards";
import { Outlet } from "react-router-dom";
import { TaskFilters } from "../components/TaskFilters";

const TasksTemplate = () => {
  return (
    <main className="flex-1 overflow-hidden">
      <div className="container mx-auto p-6 space-y-6 h-full flex flex-col">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-gradient">Good morning</h1>
          <p className="text-muted-foreground">
            You have 8 tasks today. Let's get productive!
          </p>
        </div>

        <StatsCards />

        <TaskFilters />

        <Outlet />
      </div>
    </main>
  );
};

export default TasksTemplate;
