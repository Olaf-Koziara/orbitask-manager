import { describe, it, expect, beforeEach, vi } from "vitest";
import { TaskService } from "./task.service";
import { Priority, TaskStatus } from "../types";

describe("TaskService", () => {
    describe("prepareTaskForCreate", () => {
        it("should add createdAt and createdBy to form values", () => {
            const formValues = {
                title: "Test Task",
                description: "Test Description",
                status: TaskStatus.TODO,
                priority: Priority.MEDIUM,
            };
            const userId = "user-123";

            const result = TaskService.prepareTaskForCreate(formValues, userId);

            expect(result.title).toBe("Test Task");
            expect(result.createdBy).toBe("user-123");
            expect(result.createdAt).toBeInstanceOf(Date);
        });
    });

    describe("isOverdue", () => {
        it("should return true for past date with non-done status", () => {
            const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
            expect(TaskService.isOverdue(pastDate, TaskStatus.TODO)).toBe(true);
        });

        it("should return false for past date with done status", () => {
            const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
            expect(TaskService.isOverdue(pastDate, TaskStatus.DONE)).toBe(false);
        });

        it("should return false for future date", () => {
            const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
            expect(TaskService.isOverdue(futureDate, TaskStatus.TODO)).toBe(false);
        });

        it("should return false for null date", () => {
            expect(TaskService.isOverdue(null, TaskStatus.TODO)).toBe(false);
        });

        it("should handle string dates", () => {
            const pastDateString = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
            expect(TaskService.isOverdue(pastDateString, TaskStatus.TODO)).toBe(true);
        });
    });

    describe("isDueSoon", () => {
        it("should return true for date within 3 days and non-done status", () => {
            const soonDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
            expect(TaskService.isDueSoon(soonDate, TaskStatus.TODO)).toBe(true);
        });

        it("should return false for date beyond 3 days", () => {
            const laterDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
            expect(TaskService.isDueSoon(laterDate, TaskStatus.TODO)).toBe(false);
        });

        it("should return false for done status", () => {
            const soonDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
            expect(TaskService.isDueSoon(soonDate, TaskStatus.DONE)).toBe(false);
        });

        it("should return false for null date", () => {
            expect(TaskService.isDueSoon(null, TaskStatus.TODO)).toBe(false);
        });
    });

    describe("sortByPriority", () => {
        const tasks = [
            { id: "1", priority: Priority.LOW },
            { id: "2", priority: Priority.URGENT },
            { id: "3", priority: Priority.MEDIUM },
            { id: "4", priority: Priority.HIGH },
        ];

        it("should sort tasks by priority in descending order by default", () => {
            const sorted = TaskService.sortByPriority(tasks);
            expect(sorted[0].priority).toBe(Priority.URGENT);
            expect(sorted[1].priority).toBe(Priority.HIGH);
            expect(sorted[2].priority).toBe(Priority.MEDIUM);
            expect(sorted[3].priority).toBe(Priority.LOW);
        });

        it("should sort tasks by priority in ascending order", () => {
            const sorted = TaskService.sortByPriority(tasks, "asc");
            expect(sorted[0].priority).toBe(Priority.LOW);
            expect(sorted[3].priority).toBe(Priority.URGENT);
        });

        it("should not mutate original array", () => {
            const original = [...tasks];
            TaskService.sortByPriority(tasks);
            expect(tasks).toEqual(original);
        });
    });

    describe("groupByStatus", () => {
        const tasks = [
            { id: "1", status: TaskStatus.TODO },
            { id: "2", status: TaskStatus.DONE },
            { id: "3", status: TaskStatus.TODO },
            { id: "4", status: TaskStatus.IN_PROGRESS },
        ];

        it("should group tasks by status", () => {
            const grouped = TaskService.groupByStatus(tasks);

            expect(grouped[TaskStatus.TODO]).toHaveLength(2);
            expect(grouped[TaskStatus.DONE]).toHaveLength(1);
            expect(grouped[TaskStatus.IN_PROGRESS]).toHaveLength(1);
            expect(grouped[TaskStatus.REVIEW]).toHaveLength(0);
        });

        it("should return empty arrays for statuses with no tasks", () => {
            const grouped = TaskService.groupByStatus([]);

            expect(grouped[TaskStatus.TODO]).toEqual([]);
            expect(grouped[TaskStatus.DONE]).toEqual([]);
        });
    });

    describe("filterTasks", () => {
        const tasks = [
            {
                _id: "1",
                title: "First Task",
                description: "Description one",
                status: TaskStatus.TODO,
                priority: Priority.HIGH,
                tags: ["urgent", "bug"],
                assignee: { _id: "user-1", name: "John" },
            },
            {
                _id: "2",
                title: "Second Task",
                description: "Description two",
                status: TaskStatus.DONE,
                priority: Priority.LOW,
                tags: ["feature"],
                assignee: { _id: "user-2", name: "Jane" },
            },
        ] as any;

        it("should filter by status", () => {
            const result = TaskService.filterTasks(tasks, { status: TaskStatus.TODO });
            expect(result).toHaveLength(1);
            expect(result[0].title).toBe("First Task");
        });

        it("should filter by priority", () => {
            const result = TaskService.filterTasks(tasks, { priority: Priority.LOW });
            expect(result).toHaveLength(1);
            expect(result[0].title).toBe("Second Task");
        });

        it("should filter by search in title", () => {
            const result = TaskService.filterTasks(tasks, { search: "First" });
            expect(result).toHaveLength(1);
            expect(result[0].title).toBe("First Task");
        });

        it("should filter by search in description", () => {
            const result = TaskService.filterTasks(tasks, { search: "two" });
            expect(result).toHaveLength(1);
            expect(result[0].title).toBe("Second Task");
        });

        it("should filter by assignee", () => {
            const result = TaskService.filterTasks(tasks, { assignee: "user-1" });
            expect(result).toHaveLength(1);
            expect(result[0].assignee._id).toBe("user-1");
        });

        it("should filter by tags", () => {
            const result = TaskService.filterTasks(tasks, { tags: ["bug"] });
            expect(result).toHaveLength(1);
            expect(result[0].tags).toContain("bug");
        });

        it("should combine multiple filters", () => {
            const result = TaskService.filterTasks(tasks, {
                status: TaskStatus.TODO,
                priority: Priority.HIGH,
            });
            expect(result).toHaveLength(1);
        });

        it("should return all tasks when no filters", () => {
            const result = TaskService.filterTasks(tasks, {});
            expect(result).toHaveLength(2);
        });
    });

    describe("getTaskStats", () => {
        it("should calculate correct stats", () => {
            const tasks = [
                { status: TaskStatus.DONE, dueDate: null },
                { status: TaskStatus.TODO, dueDate: new Date(Date.now() - 1000) },
                { status: TaskStatus.IN_PROGRESS, dueDate: null },
                { status: TaskStatus.DONE, dueDate: null },
            ] as any;

            const stats = TaskService.getTaskStats(tasks);

            expect(stats.total).toBe(4);
            expect(stats.completed).toBe(2);
            expect(stats.inProgress).toBe(1);
            expect(stats.overdue).toBe(1);
            expect(stats.completionRate).toBe(50);
        });

        it("should return 0 completion rate for empty array", () => {
            const stats = TaskService.getTaskStats([]);

            expect(stats.total).toBe(0);
            expect(stats.completionRate).toBe(0);
        });
    });
});
