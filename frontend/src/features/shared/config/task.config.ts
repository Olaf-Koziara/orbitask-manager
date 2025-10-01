import { Priority, TaskStatus } from "../../tasks/types";

export const priorityConfig: Record<
  Priority,
  { 
    label: string; 
    className: string;
    color: string;
    bgColor: string;
    textColor: string;
    borderColor: string;
  }
> = {
  low: {
    label: "Low",
    className:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    color: "142 71% 45%", // hsl for green
    bgColor: "bg-green-100",
    textColor: "text-green-800",
    borderColor: "border-l-green-400",
  },
  medium: {
    label: "Medium",
    className:
      "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    color: "25 95% 53%", // hsl for orange
    bgColor: "bg-orange-100",
    textColor: "text-orange-800",
    borderColor: "border-l-orange-400",
  },
  high: {
    label: "High",
    className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    color: "0 84% 60%", // hsl for red
    bgColor: "bg-red-100",
    textColor: "text-red-800",
    borderColor: "border-l-red-400",
  },
  urgent: {
    label: "Urgent",
    className: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
    color: "0 0% 40%", // hsl for gray
    bgColor: "bg-gray-100",
    textColor: "text-gray-800",
    borderColor: "border-l-gray-600",
  },
};

export const statusConfig: Record<
  TaskStatus,
  {
    label: string;
    className: string;
    bgColor: string;
    textColor: string;
    dotColor: string;
  }
> = {
  todo: {
    label: "To Do",
    className: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
    bgColor: "bg-slate-100",
    textColor: "text-slate-700",
    dotColor: "bg-slate-400",
  },
  "in-progress": {
    label: "In Progress",
    className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    bgColor: "bg-blue-100",
    textColor: "text-blue-700",
    dotColor: "bg-blue-500",
  },
  review: {
    label: "Review",
    className:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    bgColor: "bg-purple-100",
    textColor: "text-purple-700",
    dotColor: "bg-purple-500",
  },
  done: {
    label: "Done",
    className:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    bgColor: "bg-green-100",
    textColor: "text-green-700",
    dotColor: "bg-green-500",
  },
};
