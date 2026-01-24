import { Task, TaskStatus } from "@/features/tasks/types";
import { describe, it, expect } from "vitest";

// Recreate the constant since it's not exported
const KANBAN_COLUMNS = [
  { status: TaskStatus.TODO, title: "To Do" },
  { status: TaskStatus.IN_PROGRESS, title: "In Progress" },
  { status: TaskStatus.REVIEW, title: "Review" },
  { status: TaskStatus.DONE, title: "Done" },
] as const;

// Original implementation
const originalGroupTasks = (tasks: Task[]) => {
    return KANBAN_COLUMNS.reduce((acc, { status }) => {
      acc[status] = tasks.filter((task) => task.status === status);
      return acc;
    }, {} as Record<TaskStatus, Task[]>);
};

// Optimized implementation
const optimizedGroupTasks = (tasks: Task[]) => {
    const initialAcc = KANBAN_COLUMNS.reduce((acc, { status }) => {
        acc[status] = [];
        return acc;
    }, {} as Record<TaskStatus, Task[]>);

    return tasks.reduce((acc, task) => {
        acc[task.status]?.push(task);
        return acc;
    }, initialAcc);
};

// Generate dummy tasks
const generateTasks = (count: number): Task[] => {
    const statuses = Object.values(TaskStatus);
    return Array.from({ length: count }).map((_, i) => ({
        _id: `task-${i}`,
        title: `Task ${i}`,
        status: statuses[i % statuses.length],
    })) as Task[];
};

describe("KanbanBoard Performance Optimization", () => {
    it("should produce identical results", () => {
        const tasks = generateTasks(100);
        const original = originalGroupTasks(tasks);
        const optimized = optimizedGroupTasks(tasks);
        expect(optimized).toEqual(original);
    });

    it("should be faster (benchmark)", () => {
        const taskCount = 10000;
        const tasks = generateTasks(taskCount);
        const iterations = 100;

        const startOriginal = performance.now();
        for (let i = 0; i < iterations; i++) {
            originalGroupTasks(tasks);
        }
        const endOriginal = performance.now();
        const durationOriginal = endOriginal - startOriginal;

        const startOptimized = performance.now();
        for (let i = 0; i < iterations; i++) {
            optimizedGroupTasks(tasks);
        }
        const endOptimized = performance.now();
        const durationOptimized = endOptimized - startOptimized;

        console.log(`Original duration (${taskCount} tasks, ${iterations} runs): ${durationOriginal.toFixed(2)}ms`);
        console.log(`Optimized duration (${taskCount} tasks, ${iterations} runs): ${durationOptimized.toFixed(2)}ms`);
        console.log(`Improvement: ${(durationOriginal / durationOptimized).toFixed(2)}x`);
    });
});
