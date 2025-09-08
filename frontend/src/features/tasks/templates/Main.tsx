import { Header } from "@/components/Header";

import { useToast } from "@/hooks/use-toast";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { TaskFilters } from "../components/TaskFilters";
import { TaskStatistics } from "../components/TasksStatistics/TasksStatistics";

const MainTemplate = () => {
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  const currentView = location.pathname.split("/")[1] || "kanban";

  const handleCreateTask = () => {};

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header onCreateTask={handleCreateTask} currentView={currentView} />

      <main className="flex-1 overflow-hidden">
        <div className="container mx-auto p-6 space-y-6 h-full flex flex-col">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-gradient">Good morning</h1>
            <p className="text-muted-foreground">Let's get productive!</p>
          </div>

          <TaskStatistics />
          <TaskFilters />

          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainTemplate;
