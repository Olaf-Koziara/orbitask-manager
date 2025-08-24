import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, MoreHorizontal } from 'lucide-react';
import { TaskCard } from './TaskCard';
import { Task, Status, getTasksByStatus } from '@/lib/mockData';
import { cn } from '@/lib/utils';

interface KanbanColumnProps {
  title: string;
  status: Status;
  tasks: Task[];
  onAddTask?: (status: Status) => void;
  onTaskUpdate?: (taskId: string, updates: Partial<Task>) => void;
  className?: string;
}

const statusConfig: Record<Status, { 
  label: string; 
  className: string; 
  bgColor: string;
  textColor: string;
}> = {
  todo: { 
    label: 'To Do', 
    className: 'status-todo',
    bgColor: 'bg-slate-100',
    textColor: 'text-slate-700'
  },
  progress: { 
    label: 'In Progress', 
    className: 'status-progress',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-700'
  },
  review: { 
    label: 'Review', 
    className: 'status-review',
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-700'
  },
  done: { 
    label: 'Done', 
    className: 'status-done',
    bgColor: 'bg-green-100',
    textColor: 'text-green-700'
  }
};

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  title,
  status,
  tasks,
  onAddTask,
  onTaskUpdate,
  className
}) => {
  const config = statusConfig[status];
  
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {/* Column Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm">{title}</h3>
          <Badge 
            variant="secondary" 
            className={cn(
              "h-5 px-2 text-xs font-medium rounded-full",
              config.bgColor,
              config.textColor
            )}
          >
            {tasks.length}
          </Badge>
        </div>
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6"
            onClick={() => onAddTask?.(status)}
          >
            <Plus className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <MoreHorizontal className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Column Content */}
      <div className="flex-1 min-h-[400px]">
        <div 
          className={cn(
            "h-full p-3 rounded-lg border-2 border-dashed transition-colors",
            "border-border/50 bg-muted/20",
            "hover:border-primary/30 hover:bg-primary/5"
          )}
        >
          <div className="space-y-3">
            {tasks.map((task) => (
              <TaskCard 
                key={task.id} 
                task={task}
                onStatusChange={(taskId, newStatus) => 
                  onTaskUpdate?.(taskId, { status: newStatus })
                }
              />
            ))}
            
            {tasks.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                  <Plus className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  No tasks in {title.toLowerCase()}
                </p>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onAddTask?.(status)}
                  className="text-xs"
                >
                  Add Task
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const KanbanBoard: React.FC = () => {
  const [tasks, setTasks] = useState(() => {
    return {
      todo: getTasksByStatus('todo'),
      progress: getTasksByStatus('progress'),
      review: getTasksByStatus('review'),
      done: getTasksByStatus('done')
    };
  });

  const handleAddTask = (status: Status) => {
    // Mock function - would open create task modal
    console.log('Add task to', status);
  };

  const handleTaskUpdate = (taskId: string, updates: Partial<Task>) => {
    // Mock function - would update task via API
    console.log('Update task', taskId, updates);
  };

  const columns: Array<{ status: Status; title: string }> = [
    { status: 'todo', title: 'To Do' },
    { status: 'progress', title: 'In Progress' },
    { status: 'review', title: 'Review' },
    { status: 'done', title: 'Done' }
  ];

  return (
    <div className="flex-1 overflow-hidden">
      <div className="h-full overflow-x-auto">
        <div className="flex gap-6 min-w-max p-6">
          {columns.map(({ status, title }) => (
            <KanbanColumn
              key={status}
              title={title}
              status={status}
              tasks={tasks[status]}
              onAddTask={handleAddTask}
              onTaskUpdate={handleTaskUpdate}
              className="w-80 flex-shrink-0"
            />
          ))}
        </div>
      </div>
    </div>
  );
};