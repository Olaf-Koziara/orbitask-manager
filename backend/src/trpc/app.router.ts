import {  router } from './trpc';
import { authRouter } from './auth.router';
import { taskRouter } from './task.router';
import { projectRouter } from './project.router';
import { notificationRouter } from './notification.router';

export const appRouter = router({
  auth: authRouter,
  tasks: taskRouter,
  projects: projectRouter,
  notifications: notificationRouter,
});

export type AppRouter = typeof appRouter;
