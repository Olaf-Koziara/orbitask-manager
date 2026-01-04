import { Card } from "@/features/shared/components/ui/card";
import { TaskCard } from "@/features/tasks/components/TaskCard";
import { useTasks } from "@/features/tasks/hooks/useTasks";
import { useTaskDialogStore } from "@/features/tasks/stores/taskDialog.store";
import { useVirtualizer } from "@tanstack/react-virtual";
import { List } from "lucide-react";
import { useRef } from "react";

const ListView = () => {
  const parentRef = useRef<HTMLDivElement>(null);
  const { tasks, isLoading } = useTasks();
  const { openDialog } = useTaskDialogStore();

  const virtualizer = useVirtualizer({
    count: tasks.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 120, // Szacowana wysokość TaskCard w px
    overscan: 5, // Renderuj 5 dodatkowych elementów poza widocznym obszarem
  });

  // Jeśli loading, pokaż loader
  if (isLoading) {
    return (
      <Card className="flex-1 flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <List className="h-16 w-16 mx-auto text-muted-foreground animate-pulse" />
          <p className="text-muted-foreground">Loading tasks...</p>
        </div>
      </Card>
    );
  }

  // Jeśli brak zadań, pokaż pustą wiadomość
  if (tasks.length === 0) {
    return (
      <Card className="flex-1 flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <List className="h-16 w-16 mx-auto text-muted-foreground" />
          <h3 className="text-lg font-semibold">No Tasks</h3>
          <p className="text-muted-foreground max-w-sm">
            Create your first task to get started!
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="flex-1 flex flex-col overflow-hidden min-h-[400px]">
      <div
        ref={parentRef}
        className="flex-1 overflow-auto p-4"
        style={{
          contain: "strict", // Optymalizacja CSS containment
        }}
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
                    onEdit={() => openDialog({ task, viewMode: "edit" })}
                    onClick={() => openDialog({ task, viewMode: "view" })}
                    draggable={false}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

export default ListView;
