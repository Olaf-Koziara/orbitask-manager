import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { StatsCards } from '@/components/StatsCards';
import { TaskFilters, FilterState } from '../components/TaskFilters';
import { useToast } from '@/hooks/use-toast';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

const MainTemplate = () => {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    priority: 'all',
    status: 'all',
    assignee: 'all',
    project: 'all',
    dueDate: 'all'
  });
  
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  const currentView = location.pathname.split('/')[1] || 'kanban';

  const handleCreateTask = () => {
    
  };



  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header 
        onCreateTask={handleCreateTask}
        currentView={currentView}
      />
      
      <main className="flex-1 overflow-hidden">
        <div className="container mx-auto p-6 space-y-6 h-full flex flex-col">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-gradient">
              Good morning
            </h1>
            <p className="text-muted-foreground">
              You have 8 tasks today. Let's get productive!
            </p>
          </div>

          <StatsCards />

          <TaskFilters 
            onFiltersChange={setFilters}
         
          />

          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainTemplate;
