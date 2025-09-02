import React, { Suspense } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Loading } from '@/components/Loading';
import { queryClient, trpc, trpcClient } from '@/api/trpc';
import PrivateRoute from '@/features/auth/components/PrivateRoute';
import { LoginView } from './features/auth/views/Login.view';
import { RegisterView } from './features/auth/views/Register.view';
import { useAuthStore } from './features/auth/stores/auth.store';

const Template = React.lazy(() => import('./features/tasks/templates/Main'));
const KanbanView = React.lazy(() => import('./features/tasks/views/KanbanView'));
const CalendarView = React.lazy(() => import('./features/tasks/views/CalendarView'));
const ListView = React.lazy(() => import('./features/tasks/views/ListView'));
const NotFound = React.lazy(() => import('./pages/NotFound'));



const App = () => {
const {user} = useAuthStore();
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
