import { Priority, Task, TaskCreateInput, TaskFilterValues, TaskFormValues, TaskStatus } from "../types";

const PRIORITY_ORDER: Record<Priority, number> = {
    [Priority.URGENT]: 4,
    [Priority.HIGH]: 3,
    [Priority.MEDIUM]: 2,
    [Priority.LOW]: 1,
};

export const TaskService = {
    prepareTaskForCreate: (
        formValues: TaskFormValues,
        userId: string
    ): TaskCreateInput => ({
        ...formValues,
        createdAt: new Date(),
        createdBy: userId,
    }),

    isOverdue: (dueDate: Date | string | null | undefined, status: string): boolean => {
        if (!dueDate) return false;
        const date = typeof dueDate === "string" ? new Date(dueDate) : dueDate;
        return date < new Date() && status !== TaskStatus.DONE;
    },

    isDueSoon: (dueDate: Date | string | null | undefined, status: string): boolean => {
        if (!dueDate) return false;
        const date = typeof dueDate === "string" ? new Date(dueDate) : dueDate;
        const threeDaysFromNow = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
        return date <= threeDaysFromNow && status !== TaskStatus.DONE;
    },

    sortByPriority: <T extends { priority: Priority }>(
        tasks: T[],
        order: "asc" | "desc" = "desc"
    ): T[] => {
        return [...tasks].sort((a, b) => {
            const diff = PRIORITY_ORDER[b.priority] - PRIORITY_ORDER[a.priority];
            return order === "asc" ? -diff : diff;
        });
    },

    groupByStatus: <T extends { status: TaskStatus }>(
        tasks: T[]
    ): Record<TaskStatus, T[]> => {
        const initial: Record<TaskStatus, T[]> = {
            [TaskStatus.TODO]: [],
            [TaskStatus.IN_PROGRESS]: [],
            [TaskStatus.REVIEW]: [],
            [TaskStatus.DONE]: [],
        };

        return tasks.reduce((acc, task) => {
            acc[task.status].push(task);
            return acc;
        }, initial);
    },

    filterTasks: (tasks: Task[], filters: Partial<TaskFilterValues>): Task[] => {
        return tasks.filter((task) => {
            if (filters.status && task.status !== filters.status) return false;
            if (filters.priority && task.priority !== filters.priority) return false;
            if (filters.assignee && task.assignee?._id !== filters.assignee) return false;
            if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                const titleMatch = task.title.toLowerCase().includes(searchLower);
                const descMatch = task.description?.toLowerCase().includes(searchLower);
                if (!titleMatch && !descMatch) return false;
            }
            if (filters.tags?.length) {
                const hasMatchingTag = filters.tags.some((tag) => task.tags.includes(tag));
                if (!hasMatchingTag) return false;
            }
            return true;
        });
    },

    getTaskStats: (tasks: Task[]): {
        total: number;
        completed: number;
        inProgress: number;
        overdue: number;
        completionRate: number;
    } => {
        const total = tasks.length;
        const completed = tasks.filter((t) => t.status === TaskStatus.DONE).length;
        const inProgress = tasks.filter((t) => t.status === TaskStatus.IN_PROGRESS).length;
        const overdue = tasks.filter(
            (t) => TaskService.isOverdue(t.dueDate, t.status)
        ).length;

        return {
            total,
            completed,
            inProgress,
            overdue,
            completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
        };
    },
};
