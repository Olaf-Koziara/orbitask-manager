import { Header } from "@/features/shared/components/Header";
import { PageTransition } from "@/features/shared/components/PageTransition";
import { useToast } from "@/features/shared/hooks/use-toast";
import { AnimatePresence } from "framer-motion";
import { useLocation, useNavigate, useOutlet } from "react-router-dom";

const MainTemplate = () => {
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const element = useOutlet();

  const currentView = location.pathname.split("/")[1] || "kanban";

  const handleCreateTask = () => {};

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans antialiased selection:bg-primary/20">
      <Header onCreateTask={handleCreateTask} currentView={currentView} />
      <div className="flex-1 w-full">
        <main className="w-full h-full">
          <div className="max-w-[1920px] mx-auto p-4 md:p-8 space-y-8 h-full flex flex-col">
            <AnimatePresence mode="wait">
              <PageTransition key={location.pathname}>
                {element}
              </PageTransition>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainTemplate;
