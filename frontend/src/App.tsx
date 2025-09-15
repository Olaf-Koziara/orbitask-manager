import { queryClient, trpc, trpcClient } from "@/api/trpc";
import PrivateRoute from "@/features/auth/components/PrivateRoute";
import { ErrorBoundary } from "@/features/shared/components/ErrorBoundary";
import { Loading } from "@/features/shared/components/Loading";
import { Toaster as Sonner } from "@/features/shared/components/ui/sonner";
import { Toaster } from "@/features/shared/components/ui/toaster";
import { TooltipProvider } from "@/features/shared/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import React, { Suspense } from "react";
import { Route, Routes } from "react-router";
import { BrowserRouter } from "react-router-dom";
import { LoginView } from "./features/auth/views/Login.view";
import { RegisterView } from "./features/auth/views/Register.view";

const Template = React.lazy(() => import("./features/tasks/templates/Main"));
const KanbanView = React.lazy(
  () => import("./features/tasks/views/KanbanView")
);
const CalendarView = React.lazy(
  () => import("./features/tasks/views/CalendarView")
);
const ListView = React.lazy(() => import("./features/tasks/views/ListView"));
const NotFound = React.lazy(() => import("./pages/NotFound"));

const App = () => {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Suspense fallback={<Loading />}>
                <Routes>
                  <Route path="/login" element={<LoginView />} />
                  <Route path="/register" element={<RegisterView />} />
                  <Route element={<PrivateRoute />}>
                    <Route path="/" element={<Template />}>
                      <Route index element={<KanbanView />} />
                      <Route path="kanban" element={<KanbanView />} />
                      <Route path="calendar" element={<CalendarView />} />
                      <Route path="list" element={<ListView />} />
                    </Route>
                  </Route>
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </TooltipProvider>
        </ErrorBoundary>
      </QueryClientProvider>
    </trpc.Provider>
  );
};

export default App;
