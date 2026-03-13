import { StatsCards } from "@/features/tasks/components/TaskStats";
import { Outlet } from "react-router-dom";
import { TaskDialog } from "@/features/tasks/components/TaskDialog";
import { TaskFilters } from "@/features/tasks/components/TaskFilters";

const TasksTemplate = () => {
  return (
    <main className="flex-1 min-h-0 overflow-hidden">
      <div className="mx-auto p-6 pt-0 space-y-6 h-full min-h-0 flex flex-col">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-gradient">Good morning</h1>
          <p className="text-muted-foreground">Let's get productive!</p>
        </div>

        <StatsCards />

        <TaskFilters />

        <Outlet />
      </div>
      <TaskDialog />
    </main>
  );
};

export default TasksTemplate;
