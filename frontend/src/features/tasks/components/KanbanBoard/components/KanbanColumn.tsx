import { Badge } from "@/features/shared/components/ui/badge";
import { Button } from "@/features/shared/components/ui/button";
import { statusConfig } from "@/features/shared/config/task.config";
import { cn } from "@/features/shared/utils";
import { TaskCard } from "@/features/tasks/components/TaskCard";
import { useTaskDialogStore } from "@/features/tasks/stores/taskDialog.store";
import { Task, TaskStatus } from "@/features/tasks/types";
import { useDroppable } from "@dnd-kit/core";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Plus } from "lucide-react";
import { useRef } from "react";

type KanbanColumnProps = {
  title: string;
  status: TaskStatus; 
  tasks: Task[];
  onAddTask?: () => void;
  onTaskUpdate?: (taskId: string, update: Partial<{ status: string }>) => void;
  className?: string;
};

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  title,
  status,
  tasks,
  onAddTask,
  onTaskUpdate,
  className,
}) => {
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

  const shouldVirtualize = tasks.length > 15;

  const virtualizer = useVirtualizer({
    count: tasks.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 120,
    overscan: 5,
    enabled: shouldVirtualize,
  });

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
    <div ref={setDroppableRef} className={cn("flex flex-col h-full", className)}>
      <div className="flex items-center justify-between px-1 mb-3">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm text-foreground/80 tracking-tight">{title}</h3>
          <span className="text-xs text-muted-foreground font-medium bg-muted px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          onClick={() =>
            openDialog({ initialData: { status }, viewMode: "create" })
          }
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className={cn(
        "flex-1 min-h-[150px] rounded-2xl bg-muted/40 p-2 transition-colors duration-200",
        isOver && "bg-primary/5 ring-2 ring-primary/20"
      )}>
        {tasks.length === 0 ? (
          <div
            className="flex flex-col h-full items-center justify-start py-12 text-center cursor-pointer opacity-50 hover:opacity-100 transition-opacity"
            onClick={() =>
              openDialog({ initialData: { status }, viewMode: "create" })
            }
          >
            <div className="w-10 h-10 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center mb-2">
               <Plus className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground font-medium">Add task</p>
          </div>
        ) : shouldVirtualize ? (
          <div
            ref={parentRef}
            className="h-full pr-1 overflow-y-auto scrollbar-hide"
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
                const task = tasks[virtualRow.index];
                return (
                  <div
                    key={task._id}
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
                    <div className="pb-3 px-1">{renderTaskCard(task)}</div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="space-y-3 h-full overflow-y-auto scrollbar-hide px-1 pb-2">
            {tasks.map((task) => renderTaskCard(task))}
          </div>
        )}
      </div>
    </div>
  );
};
export default KanbanColumn;
