import { Header } from "@/features/shared/components/Header";
import { useToast } from "@/features/shared/hooks/use-toast";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const MainTemplate = () => {
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  const currentView = location.pathname.split("/")[1] || "kanban";

  const handleCreateTask = () => {};

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header onCreateTask={handleCreateTask} currentView={currentView} />
      <div>
        <main className="flex-1 overflow-hidden">
          <div className="mx-auto p-6 space-y-6 h-full flex flex-col">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainTemplate;
