import { CustomSensor } from "@/libs/dnd/customSensor";
import { DndContext, useSensor } from "@dnd-kit/core";
import { useTaskActions } from "../../hooks/useTaskActions";
import { useTaskStore } from "../../stores/task.store";
import { Task, TaskStatus } from "../../types";
import KanbanColumn from "./components/KanbanColumn";

export const KanbanBoard: React.FC = () => {
  const { tasks } = useTaskStore();
  const { setTaskStatus } = useTaskActions();
  const customSensor = useSensor(CustomSensor);
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
      console.log(event.active);
      if (newStatus === event.active.data.current.status) return;
      setTaskStatus(taskId, newStatus);
    }
  };

  return (
    <div className="flex-1 overflow-hidden">
      <div className="h-full overflow-x-auto">
        <div className="flex gap-6 min-w-max p-6">
          <DndContext sensors={[customSensor]} onDragEnd={handleDragEnd}>
            {columns.map(({ status, title }) => (
              <KanbanColumn
                key={status}
                title={title}
                status={status}
                tasks={filterTasksByStatus(tasks, status)}
                className="w-80 flex-shrink-0"
              />
            ))}
          </DndContext>
        </div>
      </div>
    </div>
  );
};
