import { Priority, TaskStatus } from "@/features/tasks/types";

export const priorityConfig: Record<
  Priority,
  { label: string; className: string }
> = {
  low: {
    label: "Low",
    className:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  },
  medium: {
    label: "Medium",
    className:
      "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  },
  high: {
    label: "High",
    className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  },
  urgent: {
    label: "Urgent",
    className: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
  },
};

export const statusConfig: Record<
  TaskStatus,
  {
    label: string;
    className: string;
    bgColor: string;
    textColor: string;
  }
> = {
  todo: {
    label: "To Do",
    className: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
    bgColor: "bg-slate-100",
    textColor: "text-slate-700",
  },
  "in-progress": {
    label: "In Progress",
    className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    bgColor: "bg-blue-100",
    textColor: "text-blue-700",
  },
  review: {
    label: "Review",
    className:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    bgColor: "bg-purple-100",
    textColor: "text-purple-700",
  },
  done: {
    label: "Done",
    className:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    bgColor: "bg-green-100",
    textColor: "text-green-700",
  },
};
