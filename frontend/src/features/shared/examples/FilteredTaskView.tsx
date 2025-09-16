import { Header } from "@/features/shared/components/Header";
import { KanbanBoard } from "@/features/tasks/components/KanbanBoard/KanbanBoard";
import { TaskFilters } from "@/features/tasks/components/TaskFilters";
import React from "react";

/**
 * Simple example - no providers needed!
 * Project selection in Header automatically filters tasks everywhere
 */
const ExampleTaskView: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header currentView="kanban" />

      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col gap-6">
          <TaskFilters />
          <KanbanBoard />
        </div>
      </main>
    </div>
  );
};

export default ExampleTaskView;
