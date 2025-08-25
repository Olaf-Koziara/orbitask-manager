import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { StatsCards } from '@/components/StatsCards';
import { KanbanBoard } from '@/components/KanbanBoard';
import { TaskFilters, FilterState } from '@/components/TaskFilters';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Calendar, LayoutGrid, List, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type ViewType = 'kanban' | 'calendar' | 'list';

const Index = () => {
  const [currentView, setCurrentView] = useState<ViewType>('kanban');
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    priority: 'all',
    status: 'all',
    assignee: 'all',
    project: 'all',
    dueDate: 'all'
  });
  
  const { toast } = useToast();

  const handleCreateTask = () => {
    toast({
      title: "Create Task",
      description: "Task creation modal would open here.",
    });
  };

  const handleViewChange = (view: ViewType) => {
    setCurrentView(view);
    toast({
      title: "View Changed",
      description: `Switched to ${view} view`,
    });
  };

  const renderMainContent = () => {
    switch (currentView) {
      case 'kanban':
        return <KanbanBoard />;
      case 'calendar':
        return (
          <Card className="flex-1 flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <Calendar className="h-16 w-16 mx-auto text-muted-foreground" />
              <h3 className="text-lg font-semibold">Calendar View</h3>
              <p className="text-muted-foreground max-w-sm">
                Calendar view with task scheduling would be implemented here using a library like FullCalendar.
              </p>
            </div>
          </Card>
        );
      case 'list':
        return (
          <Card className="flex-1 flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <List className="h-16 w-16 mx-auto text-muted-foreground" />
              <h3 className="text-lg font-semibold">List View</h3>
              <p className="text-muted-foreground max-w-sm">
                Detailed list view with sorting and pagination would be implemented here.
              </p>
            </div>
          </Card>
        );
      default:
        return <KanbanBoard />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header 
        onCreateTask={handleCreateTask}
        onViewChange={handleViewChange}
        currentView={currentView}
      />
      
      <main className="flex-1 overflow-hidden">
        <div className="container mx-auto p-6 space-y-6 h-full flex flex-col">
          {/* Welcome Section */}
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-gradient">
              Good morning, Sarah! 👋
            </h1>
            <p className="text-muted-foreground">
              You have 8 tasks today. Let's get productive!
            </p>
          </div>

          {/* Stats Overview */}
          <StatsCards />

          {/* Filters */}
          <TaskFilters 
            filters={filters}
            onFiltersChange={setFilters}
          />

          {/* Main Content */}
          {renderMainContent()}
        </div>
      </main>
    </div>
  );
};

export default Index;
