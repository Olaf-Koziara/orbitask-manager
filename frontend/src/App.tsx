import { queryClient, trpc, trpcClient } from "@/api/trpc";
import PrivateRoute from "@/features/auth/components/PrivateRoute";
import { LoginView } from "@/features/auth/views/Login.view";
import { ProfileView } from "@/features/auth/views/Profile.view";
import { RegisterView } from "@/features/auth/views/Register.view";
import { ProjectList } from "@/features/projects";
import { ErrorBoundary } from "@/features/shared/components/ErrorBoundary";
import { Loading } from "@/features/shared/components/Loading";
import { Toaster as Sonner } from "@/features/shared/components/ui/sonner";
import { Toaster } from "@/features/shared/components/ui/toaster";
import { TooltipProvider } from "@/features/shared/components/ui/tooltip";
import MainTemplate from "@/features/shared/templates/Main.template";
import TasksTemplate from "@/features/tasks/templates/Tasks.template";
import { QueryClientProvider } from "@tanstack/react-query";
import React, { Suspense } from "react";
import { HashRouter, Route, Routes } from "react-router-dom";

const KanbanView = React.lazy(
  () => import("@/features/tasks/views/KanbanView")
);
const CalendarView = React.lazy(
  () => import("@/features/tasks/views/CalendarView")
);
const ListView = React.lazy(() => import("@/features/tasks/views/ListView"));
const NotFound = React.lazy(() => import("@/features/shared/pages/NotFound"));

const App = () => {
  return (
    <HashRouter>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <ErrorBoundary>
            <TooltipProvider>
              <Toaster />
              <Sonner />

              <Suspense fallback={<Loading />}>
                <Routes>
                  <Route path="/login" element={<LoginView />} />
                  <Route path="/register" element={<RegisterView />} />
                  <Route element={<PrivateRoute />}>
                    <Route path="/" element={<MainTemplate />}>
                      <Route element={<TasksTemplate />}>
                        <Route index element={<KanbanView />} />
                        <Route path="kanban" element={<KanbanView />} />
                        <Route path="calendar" element={<CalendarView />} />
                        <Route path="list" element={<ListView />} />
                      </Route>
                      <Route path="/projects" element={<ProjectList />} />
                      <Route path="/profile" element={<ProfileView />} />
                      <Route
                        path="/settings"
                        element={<ProfileView initialTab="settings" />}
                      />
                    </Route>
                  </Route>
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </TooltipProvider>
          </ErrorBoundary>
        </QueryClientProvider>
      </trpc.Provider>
    </HashRouter>
  );
};

export default App;
