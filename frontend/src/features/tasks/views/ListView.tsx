import { Card } from "@/features/shared/components/ui/card";
import { TaskCard } from "@/features/tasks/components/TaskCard";
import { useTasks } from "@/features/tasks/hooks/useTasks";
import { useTaskDialogStore } from "@/features/tasks/stores/taskDialog.store";
import { useVirtualizer } from "@tanstack/react-virtual";
import { List } from "lucide-react";
import { useRef } from "react";
import { motion } from "framer-motion";

const ListView = () => {
  const parentRef = useRef<HTMLDivElement>(null);
  const { tasks, isLoading } = useTasks();
  const { openDialog } = useTaskDialogStore();

  const virtualizer = useVirtualizer({
    count: tasks.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 120,
    overscan: 5,
  });

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-muted animate-pulse" />
          <p className="text-muted-foreground font-medium">Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px] border-2 border-dashed border-border/50 rounded-2xl bg-muted/20">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-white dark:bg-card shadow-sm flex items-center justify-center">
             <List className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">No Tasks</h3>
          <p className="text-muted-foreground max-w-sm px-4">
            Create your first task to get started!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden h-full rounded-2xl bg-background/50 backdrop-blur-sm border border-border/50">
      <div
        ref={parentRef}
        className="flex-1 overflow-auto p-4 md:p-6"
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
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "0px 0px -50px 0px" }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                    duration: 0.2
                  }}
                >
                  <div className="pb-3">
                    <TaskCard
                      task={task}
                      onEdit={() => openDialog({ task, viewMode: "edit" })}
                      onClick={() => openDialog({ task, viewMode: "view" })}
                      draggable={false}
                      className="hover:scale-[1.01]"
                    />
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ListView;
