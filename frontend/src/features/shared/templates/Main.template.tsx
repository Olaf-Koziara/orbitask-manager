import { Header } from "@/features/shared/components/Header";
import { useToast } from "@/hooks/use-toast";
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
        <Outlet />
      </div>
    </div>
  );
};

export default MainTemplate;
