import { Badge } from "@/features/shared/components/ui/badge";
import { Button } from "@/features/shared/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/features/shared/components/ui/tooltip";
import { statusConfig } from "@/features/shared/config/task.config";
import { cn } from "@/features/shared/utils";
import { TaskCard } from "@/features/tasks/components/TaskCard";
import { useTasks } from "@/features/tasks/hooks/useTasks";
import { useTaskDialogStore } from "@/features/tasks/stores/taskDialog.store";
import { Task, TaskStatus } from "@/features/tasks/types";
import { useDroppable } from "@dnd-kit/core";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Loader2, Plus } from "lucide-react";
import { useEffect, useRef } from "react";

type KanbanColumnProps = {
  title: string;
  status: TaskStatus;
  onAddTask?: () => void;
  onTaskUpdate?: (taskId: string, update: Partial<{ status: string }>) => void;
  className?: string;
};

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  title,
  status,
  onAddTask,
  onTaskUpdate,
  className,
}) => {
  const { tasks, fetchNextPage, hasNextPage, isFetchingNextPage } = useTasks({
    status,
  });
  const config = statusConfig[status];
  const {
    isOver,
    over,
    active,
    setNodeRef: setDroppableRef,
  } = useDroppable({
    id: status,
  });
  const { openDialog } = useTaskDialogStore();
  const parentRef = useRef<HTMLDivElement>(null);

  const shouldVirtualize = tasks.length > 5;

  const virtualizer = useVirtualizer({
    count: hasNextPage ? tasks.length + 1 : tasks.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 120,
    overscan: 5,
    enabled: shouldVirtualize,
  });

  useEffect(() => {
    const [lastItem] = [...virtualizer.getVirtualItems()].reverse();
    if (!lastItem) return;

    if (
      lastItem.index >= tasks.length - 1 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [
    hasNextPage,
    fetchNextPage,
    tasks.length,
    isFetchingNextPage,
    virtualizer.getVirtualItems(),
  ]);

  const renderTaskCard = (task: Task) => (
    <TaskCard
      task={task}
      draggable={true}
      onStatusChange={(taskId, newStatus) =>
        onTaskUpdate?.(taskId, { status: newStatus })
      }
      preview={isOver && active.id === task._id}
      onEdit={() => openDialog({ task, viewMode: "edit" })}
      onClick={() => openDialog({ task, viewMode: "view" })}
    />
  );

  return (
    <div
      ref={setDroppableRef}
      className={cn("flex flex-col h-full max-h-[calc(100vh-12rem)] min-h-[300px]", className)}
    >
      <div className="flex items-center justify-between px-1 mb-3 shrink-0">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm text-foreground/80 tracking-tight">{title}</h3>
          <span className="text-xs text-muted-foreground font-medium bg-muted px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              onClick={() =>
                openDialog({ initialData: { status }, viewMode: "create" })
              }
              aria-label={`Add task to ${title}`}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Add task to {title}</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <div className={cn(
        "flex-1 rounded-2xl bg-muted/40 p-2 transition-colors duration-200 overflow-hidden flex flex-col",
        isOver && "bg-primary/5 ring-2 ring-primary/20"
      )}>
        {tasks.length === 0 ? (
          <button
            type="button"
            className="w-full flex flex-col h-full items-center justify-start py-12 text-center opacity-50 hover:opacity-100 transition-opacity focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 rounded-lg"
            onClick={() =>
              openDialog({ initialData: { status }, viewMode: "create" })
            }
            aria-label={`Create new task in ${title} column`}
          >
            <div className="w-10 h-10 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center mb-2">
               <Plus className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground font-medium">Add task</p>
          </button>
        ) : shouldVirtualize ? (
          <div
            ref={parentRef}
            className="flex-1 pr-1 overflow-y-auto scrollbar-hide"
            style={{ contain: "strict" }}
          >
            <div
              style={{
                height: `${virtualizer.getTotalSize()}px`,
                width: "100%",
                position: "relative",
              }}
            >
              {virtualizer.getVirtualItems().map((virtualRow) => {
                const isLoaderRow = virtualRow.index > tasks.length - 1;
                const task = tasks[virtualRow.index];

                return (
                  <div
                    key={virtualRow.key}
                    data-index={virtualRow.index}
                    ref={virtualizer.measureElement}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  >
                    {isLoaderRow ? (
                      <div className="py-4 flex justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      </div>
                    ) : (
                      <div className="pb-3 px-1">{renderTaskCard(task)}</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex-1 space-y-3 overflow-y-auto scrollbar-hide px-1 pb-2">
            {tasks.map((task) => renderTaskCard(task))}
          </div>
        )}
      </div>
    </div>
  );
};
export default KanbanColumn;
