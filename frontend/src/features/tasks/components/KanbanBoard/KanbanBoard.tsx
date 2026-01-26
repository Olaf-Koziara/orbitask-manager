import { trpc } from "@/api/trpc";
import { useDebounce } from "@/features/shared/hooks/useDebounce";
import { FilterService } from "@/features/shared/services/filter.service";
import { RouterOutput, RouterInput } from "@/features/shared/types";
import { statusConfig } from "@/features/shared/config/task.config";
import KanbanColumn from "@/features/tasks/components/KanbanBoard/components/KanbanColumn";
import { useTasks } from "@/features/tasks/hooks/useTasks";
import { useFiltersStore } from "@/features/tasks/stores/filters.store";
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
import { InfiniteData } from "@tanstack/react-query";
import React, { useCallback, useRef, useState } from "react";
import { TaskCard } from "../TaskCard";

const KANBAN_COLUMNS = [
  { status: TaskStatus.TODO, title: statusConfig.todo.label },
  { status: TaskStatus.IN_PROGRESS, title: statusConfig["in-progress"].label },
  { status: TaskStatus.REVIEW, title: statusConfig.review.label },
  { status: TaskStatus.DONE, title: statusConfig.done.label },
] as const;

type TasksQueryOutput = RouterOutput["tasks"]["list"];
type TasksQueryInput = RouterInput["tasks"]["list"];

export const KanbanBoard: React.FC = () => {
  const { setTaskStatus } = useTasks();
  const utils = trpc.useUtils();
  const { taskFilters } = useFiltersStore();
  const debouncedFilters = useDebounce(taskFilters, 300);

  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const currentDragStatusRef = useRef<TaskStatus | null>(null);

  const customSensor = useSensor(CustomSensor, {
    activationConstraint: { distance: 3 },
  });

  const getQueryInput = useCallback(
    (status: TaskStatus) =>
      ({
        ...FilterService.prepareQueryFilters(debouncedFilters || {}),
        status,
      }) as TasksQueryInput,
    [debouncedFilters]
  );

  // Helper to update InfiniteData
  const updateTaskStatusInCache = useCallback(
    (
      taskId: string,
      sourceStatus: TaskStatus,
      destStatus: TaskStatus,
      task: Task
    ) => {
      // Remove from source
      utils.tasks.list.setInfiniteData(getQueryInput(sourceStatus), (old) => {
        if (!old) return undefined;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            items: page.items.filter((t) => t._id !== taskId),
          })),
        };
      });

      // Add to dest (at the top of first page)
      utils.tasks.list.setInfiniteData(getQueryInput(destStatus), (old) => {
        const updatedTask = { ...task, status: destStatus };
        if (!old) {
          return {
            pages: [{ items: [updatedTask], nextCursor: undefined }],
            pageParams: [0],
          };
        }
        const firstPage = old.pages[0];
        return {
          ...old,
          pages: [
            { ...firstPage, items: [updatedTask, ...firstPage.items] },
            ...old.pages.slice(1),
          ],
        };
      });
    },
    [utils, getQueryInput]
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    if (active.data.current?.task) {
      setDraggedTask(active.data.current.task);
      currentDragStatusRef.current = active.data.current.task.status;
    }
  }, []);

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event;

      if (!over?.id || !active?.id) return;

      const taskId = active.id as string;
      const newStatus = over.id as TaskStatus;
      const task = active.data.current?.task as Task;

      if (
        currentDragStatusRef.current &&
        newStatus !== currentDragStatusRef.current
      ) {
        updateTaskStatusInCache(
          taskId,
          currentDragStatusRef.current,
          newStatus,
          task
        );
        currentDragStatusRef.current = newStatus;
      }
    },
    [updateTaskStatusInCache]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (!over?.id || !active?.id) {
         setDraggedTask(null);
         currentDragStatusRef.current = null;
         return;
      }

      const taskId = active.id as string;
      const originalStatus = active.data.current?.status as TaskStatus;

      // If status changed during drag, trigger the mutation
      if (
        currentDragStatusRef.current &&
        currentDragStatusRef.current !== originalStatus
      ) {
        setTaskStatus(taskId, currentDragStatusRef.current);
      }

      setDraggedTask(null);
      currentDragStatusRef.current = null;
    },
    [setTaskStatus]
  );

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
                className="w-80 flex-shrink-0"
              />
            ))}
            <DragOverlay>
              {draggedTask && <TaskCard task={draggedTask} />}
            </DragOverlay>
          </DndContext>
        </div>
      </div>
    </div>
  );
};
