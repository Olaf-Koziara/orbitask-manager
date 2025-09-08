import { trpc } from "@/api/trpc";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DndContext } from "@dnd-kit/core";
import { useEffect, useState } from "react";
import { useTaskActions } from "../../hooks/useTaskActions";
import { useTaskStore } from "../../stores/task.store";
import { Task, TaskFormValues, TaskStatus } from "../../types";
import { TaskForm } from "../TaskForm";
import KanbanColumn from "./components/KanbanColumn";

export const KanbanBoard: React.FC = () => {
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus | null>(null);

  const { tasks } = useTaskStore();
  const { createTask, setTaskStatus } = useTaskActions();

  const todoQuery = trpc.tasks.getByStatus.useQuery("todo");
  const progressQuery = trpc.tasks.getByStatus.useQuery("in-progress");
  const reviewQuery = trpc.tasks.getByStatus.useQuery("review");
  const doneQuery = trpc.tasks.getByStatus.useQuery("done");

  useEffect(() => {
    if (
      todoQuery.data &&
      progressQuery.data &&
      reviewQuery.data &&
      doneQuery.data
    ) {
      useTaskStore.setState({
        tasks: [
          ...todoQuery.data,
          ...progressQuery.data,
          ...reviewQuery.data,
          ...doneQuery.data,
        ],
      });
    }
  }, [todoQuery.data, progressQuery.data, reviewQuery.data, doneQuery.data]);

  const handleAddTaskModalOpen = (status: TaskStatus) => {
    setSelectedStatus(status);
    setIsAddTaskOpen(true);
  };
  const handleTaskFormSubmit = async (data: TaskFormValues) => {
    await createTask({ ...data, status: selectedStatus || TaskStatus.TODO });
    setIsAddTaskOpen(false);
  };
  const filterTasksByStatus = (tasks: Task[], status: TaskStatus) => {
    return tasks.filter((task) => task.status === status);
  };
  const columns: Array<{ status: TaskStatus; title: string }> = [
    { status: TaskStatus.TODO, title: "To Do" },
    { status: TaskStatus.IN_PROGRESS, title: "In Progress" },
    { status: TaskStatus.REVIEW, title: "Review" },
    { status: TaskStatus.DONE, title: "Done" },
  ];
  const handleDragEnd = (event) => {
    if (event.over && event.over.id) {
      const taskId = event.active.id;
      const newStatus = event.over.id;

      setTaskStatus(taskId, newStatus);
    }
  };

  return (
    <div className="flex-1 overflow-hidden">
      <div className="h-full overflow-x-auto">
        <div className="flex gap-6 min-w-max p-6">
          <DndContext onDragEnd={handleDragEnd}>
            {columns.map(({ status, title }) => (
              <KanbanColumn
                key={status}
                title={title}
                status={status}
                tasks={filterTasksByStatus(tasks, status)}
                onAddTask={handleAddTaskModalOpen}
                className="w-80 flex-shrink-0"
              />
            ))}
          </DndContext>
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
