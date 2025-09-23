import { CustomSensor } from "@/libs/dnd/customSensor";
import { DndContext, DragEndEvent, useSensor } from "@dnd-kit/core";
import React, { useCallback, useMemo } from "react";
import { statusConfig } from "../../../shared/config/task.config";
import { useTasks } from "../../hooks/useTasks";
import { Task, TaskStatus } from "../../types";
import KanbanColumn from "./components/KanbanColumn";

// Define columns configuration outside component to prevent recreation
const KANBAN_COLUMNS = [
  { status: TaskStatus.TODO, title: statusConfig.todo.label },
  { status: TaskStatus.IN_PROGRESS, title: statusConfig["in-progress"].label },
  { status: TaskStatus.REVIEW, title: statusConfig.review.label },
  { status: TaskStatus.DONE, title: statusConfig.done.label },
] as const;

export const KanbanBoard: React.FC = () => {
  const { tasks, setTaskStatus } = useTasks();
  const customSensor = useSensor(CustomSensor, {
    activationConstraint: { distance: 3 },
  });

  // Memoize filtered tasks to prevent unnecessary recalculations
  const tasksByStatus = useMemo(() => {
    return KANBAN_COLUMNS.reduce((acc, { status }) => {
      acc[status] = tasks.filter((task) => task.status === status);
      return acc;
    }, {} as Record<TaskStatus, Task[]>);
  }, [tasks]);

  // Optimize drag end handler
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (!over?.id || !active?.id) return;

      const taskId = active.id as string;
      const newStatus = over.id as TaskStatus;
      const currentStatus = active.data.current?.status;

      // Only update if status actually changed
      if (newStatus !== currentStatus) {
        setTaskStatus(taskId, newStatus);
      }
    },
    [setTaskStatus]
  );

  return (
    <div className="flex-1  mx-auto overflow-hidden">
      <div className="h-full overflow-x-auto">
        <div className="flex gap-6 min-w-max p-6 py-0">
          <DndContext sensors={[customSensor]} onDragEnd={handleDragEnd}>
            {KANBAN_COLUMNS.map(({ status, title }) => (
              <KanbanColumn
                key={status}
                title={title}
                status={status}
                tasks={tasksByStatus[status]}
                className="w-80 flex-shrink-0"
              />
            ))}
          </DndContext>
        </div>
      </div>
    </div>
  );
};
