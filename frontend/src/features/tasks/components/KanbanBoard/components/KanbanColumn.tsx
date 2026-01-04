import { Button } from "@/features/shared/components/ui/button";
import { statusConfig } from "@/features/shared/config/task.config";
import { cn } from "@/features/shared/utils";
import { TaskCard } from "@/features/tasks/components/TaskCard";
import { useTaskDialogStore } from "@/features/tasks/stores/taskDialog.store";
import { Task, TaskStatus } from "@/features/tasks/types";
import { useDroppable } from "@dnd-kit/core";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Badge, Plus } from "lucide-react";
import { useRef } from "react";

// Add KanbanColumnProps type
type KanbanColumnProps = {
  title: string;
  status: TaskStatus; // Adjust to enum if you have one
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
  const { isOver, setNodeRef: setDroppableRef } = useDroppable({
    id: status,
  });
  const { openDialog } = useTaskDialogStore();
  const parentRef = useRef<HTMLDivElement>(null);

  // Używamy wirtualizacji tylko gdy jest więcej niż 10 zadań
  const shouldVirtualize = tasks.length > 10;

  const virtualizer = useVirtualizer({
    count: tasks.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 120, // Szacowana wysokość TaskCard
    overscan: 3,
    enabled: shouldVirtualize,
  });

  return (
    <div ref={setDroppableRef} className={cn("flex flex-col gap-3", className)}>
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
            onClick={() =>
              openDialog({ initialData: { status }, viewMode: "create" })
            }
          >
            <Plus className="h-3 w-3" />
          </Button>

          {/* <Button variant="ghost" size="icon" className="h-6 w-6">
            <MoreHorizontal className="h-3 w-3" />
          </Button> */}
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
          {tasks.length === 0 ? (
            <div
              className="flex flex-col h-full items-center justify-center py-8 text-center cursor-pointer hover:bg-gray-100/20 rounded-lg"
              onClick={() =>
                openDialog({ initialData: { status }, viewMode: "create" })
              }
            >
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                <Plus className="h-5 w-5 text-muted-foreground" />
              </div>

              <p className="text-sm text-muted-foreground mb-2">
                No tasks in {title.toLowerCase()}
              </p>
            </div>
          ) : shouldVirtualize ? (
            <div
              ref={parentRef}
              className="h-full overflow-auto pr-1"
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
                      <div className="pb-3">
                        <TaskCard
                          task={task}
                          draggable={true}
                          onStatusChange={(taskId, newStatus) =>
                            onTaskUpdate?.(taskId, { status: newStatus })
                          }
                          onEdit={() => openDialog({ task, viewMode: "edit" })}
                          onClick={() => openDialog({ task, viewMode: "view" })}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-3 h-full overflow-auto pr-1">
              {tasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  draggable={true}
                  onStatusChange={(taskId, newStatus) =>
                    onTaskUpdate?.(taskId, { status: newStatus })
                  }
                  onEdit={() => openDialog({ task, viewMode: "edit" })}
                  onClick={() => openDialog({ task, viewMode: "view" })}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default KanbanColumn;
