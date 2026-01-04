import { describe, it, expect } from "vitest";
import { TaskService } from "@/features/tasks/services/task.service";
import { Priority, TaskStatus } from "@/features/tasks/types";

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

    describe("createOptimisticTask", () => {
        const mockUser = {
            id: "user-123",
            name: "John Doe",
            email: "john@example.com",
        };

        const baseTaskInput = {
            title: "Test Task",
            description: "Test Description",
            status: TaskStatus.TODO,
            priority: Priority.HIGH,
            tags: ["urgent", "bug"],
            projectId: "project-456",
            createdBy: "user-123",
            createdAt: new Date(),
        };

        it("should create optimistic task with all required fields", () => {
            const result = TaskService.createOptimisticTask(baseTaskInput, mockUser);

            expect(result.title).toBe("Test Task");
            expect(result.description).toBe("Test Description");
            expect(result.status).toBe(TaskStatus.TODO);
            expect(result.priority).toBe(Priority.HIGH);
            expect(result.tags).toEqual(["urgent", "bug"]);
            expect(result.projectId).toBe("project-456");
        });

        it("should generate temporary ID with 'temp-' prefix", () => {
            const result = TaskService.createOptimisticTask(baseTaskInput, mockUser);

            expect(result._id).toBeDefined();
            expect(result._id).toMatch(/^temp-\d+$/);
        });

        it("should set createdAt and updatedAt as ISO strings", () => {
            const beforeTest = new Date().toISOString();
            const result = TaskService.createOptimisticTask(baseTaskInput, mockUser);
            const afterTest = new Date().toISOString();

            expect(result.createdAt).toBeDefined();
            expect(result.updatedAt).toBeDefined();
            expect(typeof result.createdAt).toBe("string");
            expect(typeof result.updatedAt).toBe("string");
            expect(result.createdAt).toBe(result.updatedAt);
            
            // Verify it's a valid ISO string within test time range
            expect(result.createdAt! >= beforeTest).toBe(true);
            expect(result.createdAt! <= afterTest).toBe(true);
        });

        it("should populate createdBy with user information", () => {
            const result = TaskService.createOptimisticTask(baseTaskInput, mockUser);

            expect(result.createdBy).toBeDefined();
            expect(result.createdBy?._id).toBe("user-123");
            expect(result.createdBy?.name).toBe("John Doe");
            expect(result.createdBy?.email).toBe("john@example.com");
        });

        it("should handle task with assignee", () => {
            const taskWithAssignee = {
                ...baseTaskInput,
                assignee: "user-789",
            };

            const result = TaskService.createOptimisticTask(taskWithAssignee, mockUser);

            expect(result.assignee).toBeDefined();
            expect(result.assignee?._id).toBe("user-789");
            expect(result.assignee?.name).toBe("Loading...");
            expect(result.assignee?.email).toBe("");
        });

        it("should handle task without assignee", () => {
            const taskWithoutAssignee = {
                ...baseTaskInput,
                assignee: undefined,
            };

            const result = TaskService.createOptimisticTask(taskWithoutAssignee, mockUser);

            expect(result.assignee).toBeUndefined();
        });

        it("should convert dueDate to ISO string when provided", () => {
            const dueDate = new Date("2025-12-31");
            const taskWithDueDate = {
                ...baseTaskInput,
                dueDate,
            };

            const result = TaskService.createOptimisticTask(taskWithDueDate, mockUser);

            expect(result.dueDate).toBe(dueDate.toISOString());
            expect(typeof result.dueDate).toBe("string");
        });

        it("should handle undefined dueDate", () => {
            const taskWithoutDueDate = {
                ...baseTaskInput,
                dueDate: undefined,
            };

            const result = TaskService.createOptimisticTask(taskWithoutDueDate, mockUser);

            expect(result.dueDate).toBeUndefined();
        });

        it("should set project to undefined", () => {
            const result = TaskService.createOptimisticTask(baseTaskInput, mockUser);

            expect(result.project).toBeUndefined();
        });

        it("should handle task with minimal fields", () => {
            const minimalTask = {
                title: "Minimal Task",
                status: TaskStatus.TODO,
                priority: Priority.MEDIUM,
                tags: [],
                createdBy: "user-123",
                createdAt: new Date(),
            };

            const result = TaskService.createOptimisticTask(minimalTask, mockUser);

            expect(result.title).toBe("Minimal Task");
            expect(result.description).toBeUndefined();
            expect(result.projectId).toBeUndefined();
            expect(result.assignee).toBeUndefined();
            expect(result.dueDate).toBeUndefined();
        });

        it("should generate IDs based on timestamp", () => {
            const beforeTimestamp = Date.now();
            const result = TaskService.createOptimisticTask(baseTaskInput, mockUser);
            const afterTimestamp = Date.now();

            expect(result._id).toMatch(/^temp-\d+$/);
            
            // Extract timestamp from ID
            const idTimestamp = parseInt(result._id!.replace("temp-", ""));
            expect(idTimestamp).toBeGreaterThanOrEqual(beforeTimestamp);
            expect(idTimestamp).toBeLessThanOrEqual(afterTimestamp);
        });

        it("should handle empty tags array", () => {
            const taskWithEmptyTags = {
                ...baseTaskInput,
                tags: [],
            };

            const result = TaskService.createOptimisticTask(taskWithEmptyTags, mockUser);

            expect(result.tags).toEqual([]);
        });

        it("should preserve all task statuses", () => {
            const statuses = [
                TaskStatus.TODO,
                TaskStatus.IN_PROGRESS,
                TaskStatus.REVIEW,
                TaskStatus.DONE,
            ];

            statuses.forEach((status) => {
                const task = { ...baseTaskInput, status };
                const result = TaskService.createOptimisticTask(task, mockUser);
                expect(result.status).toBe(status);
            });
        });

        it("should preserve all priority levels", () => {
            const priorities = [
                Priority.LOW,
                Priority.MEDIUM,
                Priority.HIGH,
                Priority.URGENT,
            ];

            priorities.forEach((priority) => {
                const task = { ...baseTaskInput, priority };
                const result = TaskService.createOptimisticTask(task, mockUser);
                expect(result.priority).toBe(priority);
            });
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
        it("should return true for date within 5 days and non-done status", () => {
            const soonDate = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000); ``
            expect(TaskService.isDueSoon(soonDate, TaskStatus.TODO, 5)).toBe(true);
        });

        it("should return false for done status", () => {
            const soonDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
            expect(TaskService.isDueSoon(soonDate, TaskStatus.DONE)).toBe(false);
        });
        it("should return false for overdue date", () => {
            const soonDate = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
            expect(TaskService.isDueSoon(soonDate, TaskStatus.TODO)).toBe(false);
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
