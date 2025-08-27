import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, MoreHorizontal } from 'lucide-react';
import { TaskCard } from './TaskCard';
import { cn } from '@/utils/utils';
import { trpc } from '@/utils/trpc';



import { TaskForm } from './TaskForm';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Task, TaskStatus } from '../types';


interface KanbanColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  onAddTask?: (status: TaskStatus) => void;
  onTaskUpdate?: (taskId: string, updates: Partial<Task>) => void;
  className?: string;
}

const statusConfig: Record<TaskStatus, { 
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
  'in-progress': { 
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
                key={task._id} 
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
  const utils = trpc.useContext();
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus | null>(null);
  
  const todoQuery = trpc.tasks.getByStatus.useQuery('todo');
  const progressQuery = trpc.tasks.getByStatus.useQuery('in-progress');
  const reviewQuery = trpc.tasks.getByStatus.useQuery('review');
  const doneQuery = trpc.tasks.getByStatus.useQuery('done');
  
  const updateTaskMutation = trpc.tasks.update.useMutation({
    onSuccess: () => {
      utils.tasks.getByStatus.invalidate();
    },
  });

  const createTaskMutation = trpc.tasks.create.useMutation({
    onSuccess: () => {
      utils.tasks.getByStatus.invalidate();
      setIsAddTaskOpen(false);
    },
  });
  
  const tasks = {
    todo: todoQuery.data || [],
    'in-progress': progressQuery.data || [],
    review: reviewQuery.data || [],
    done: doneQuery.data || []
  };

  const handleAddTaskModalOpen = (status: TaskStatus) => {
    setSelectedStatus(status);
    setIsAddTaskOpen(true);
  };
  const handleTaskFormSubmit = (data: Task) => {
    createTaskMutation.mutate({ ...data, status: selectedStatus });
  };

  const columns: Array<{ status: TaskStatus; title: string }> = [
    { status: TaskStatus.TODO, title: 'To Do' },
    { status: TaskStatus.IN_PROGRESS, title: 'In Progress' },
    { status: TaskStatus.REVIEW, title: 'Review' },
    { status: TaskStatus.DONE, title: 'Done' }
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
              onAddTask={handleAddTaskModalOpen}
              className="w-80 flex-shrink-0"
            />
          ))}
        </div>
      </div>

      <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          <TaskForm
            initialData={{ status: selectedStatus || TaskStatus.TODO }}
            submitLabel="Create Task"
            onSubmit={handleTaskFormSubmit}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};