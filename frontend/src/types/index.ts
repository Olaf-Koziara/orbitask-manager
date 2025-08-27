import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "../../../backend/src/trpc/app.router";
import { Priority, TaskStatus } from "../../../backend/src/types/task";

/**
 * Core type definitions for the application
 */

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;

export type FilterState = {
  status?: TaskStatus;
  priority?: Priority;
  assignee?: string;
  tags?: string[];
  search?: string;
  dateRange?: {
    from: Date;
    to: Date;
  };
};
export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: UserRole;
}

export enum UserRole {
  ADMIN = 'admin',
  MEMBER = 'member',
  VIEWER = 'viewer'
}

export enum NotificationType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error'
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  createdAt: Date;
  read: boolean;
}
