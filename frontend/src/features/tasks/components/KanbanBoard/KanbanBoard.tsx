import { useState, useEffect } from 'react';
import { useTaskStore } from '../../stores/task.store';
import { trpc } from '@/utils/trpc';
import { TaskForm } from '../TaskForm';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Task, TaskStatus } from '../../types';
import KanbanColumn from './components/KanbanColumn';
import { useTaskActions } from '../../hooks/useTaskActions';



export const KanbanBoard: React.FC = () => {
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus | null>(null);
  
  const { tasks } = useTaskStore();
  const { createTask } = useTaskActions();
  
  const todoQuery = trpc.tasks.getByStatus.useQuery('todo');
  const progressQuery = trpc.tasks.getByStatus.useQuery('in-progress');
  const reviewQuery = trpc.tasks.getByStatus.useQuery('review');
  const doneQuery = trpc.tasks.getByStatus.useQuery('done');
  
  useEffect(() => {
    if (todoQuery.data && progressQuery.data && reviewQuery.data && doneQuery.data) {
      useTaskStore.setState({
        tasks: {
          todo: todoQuery.data,
          'in-progress': progressQuery.data,
          review: reviewQuery.data,
          done: doneQuery.data
        }
      });
    }
  }, [todoQuery.data, progressQuery.data, reviewQuery.data, doneQuery.data]);

  const handleAddTaskModalOpen = (status: TaskStatus) => {
    setSelectedStatus(status);
    setIsAddTaskOpen(true);
  };
  const handleTaskFormSubmit = async (data: Task) => {
    await createTask({ ...data, status: selectedStatus || TaskStatus.TODO });
    setIsAddTaskOpen(false);
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