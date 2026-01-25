import { statusConfig } from "@/features/shared/config/task.config";
import KanbanColumn from "@/features/tasks/components/KanbanBoard/components/KanbanColumn";
import { useTasks } from "@/features/tasks/hooks/useTasks";
import { Task, TaskStatus } from "@/features/tasks/types";
import { CustomSensor } from "@/libs/dnd/customSensor";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  useSensor,
} from "@dnd-kit/core";
import React, { useCallback, useMemo, useState } from "react";
import { TaskCard } from "../TaskCard";

const KANBAN_COLUMNS = [
  { status: TaskStatus.TODO, title: statusConfig.todo.label },
  { status: TaskStatus.IN_PROGRESS, title: statusConfig["in-progress"].label },
  { status: TaskStatus.REVIEW, title: statusConfig.review.label },
  { status: TaskStatus.DONE, title: statusConfig.done.label },
] as const;

export const KanbanBoard: React.FC = () => {
  const { tasks, setTaskStatus, updateTaskOptimistic } = useTasks();
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const customSensor = useSensor(CustomSensor, {
    activationConstraint: { distance: 3 },
  });

  const tasksByStatus = useMemo(() => {
    const initialAcc = KANBAN_COLUMNS.reduce((acc, { status }) => {
      acc[status] = [];
      return acc;
    }, {} as Record<TaskStatus, Task[]>);

    return tasks.reduce((acc, task) => {
      acc[task.status]?.push(task);
      return acc;
    }, initialAcc);
  }, [tasks]);

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const { active } = event;
      if (!active.id) return;
      setActiveTaskId(active.id as string);
    },
    [setActiveTaskId]
  );

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event;

      if (!over?.id || !active?.id) return;
      const taskId = active.id as string;
      const newStatus = over.id as TaskStatus;
      const currentStatus = active.data.current?.status;

      if (newStatus !== currentStatus) {
        updateTaskOptimistic(taskId, { status: newStatus});
      }
    },
    [updateTaskOptimistic]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (!over?.id || !active?.id) return;

      const taskId = active.id as string;
      const newStatus = over.id as TaskStatus;
      const currentStatus = active.data.current?.status;
      setTaskStatus(taskId, newStatus);
    },
    [setTaskStatus]
  );

  const DraggedTask = useMemo(()=>{
      const activeTask =tasks.find((task) => task._id === activeTaskId);
      return( activeTask &&
      <TaskCard
        task={tasks.find((task) => task._id === activeTaskId)}
      ></TaskCard>
      )
    },[activeTaskId,tasks]
  )
 

  return (
    <div className="flex-1 overflow-hidden">
      <div className="h-full overflow-x-auto">
        <div className="flex gap-6 min-w-max p-6 py-0 justify-center">
          <DndContext
            sensors={[customSensor]}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
          >
            {KANBAN_COLUMNS.map(({ status, title }) => (
              <KanbanColumn
                key={status}
                title={title}
                status={status}
                tasks={tasksByStatus[status]}
                className="w-80 flex-shrink-0"
              />
            ))}
            <DragOverlay>
              {DraggedTask}
            </DragOverlay>
          </DndContext>
        </div>
      </div>
    </div>
  );
};
