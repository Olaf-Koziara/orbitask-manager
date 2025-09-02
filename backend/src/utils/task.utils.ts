import { TaskMongoResponse, TaskResponse } from '../types/task';

/**
 * Transforms MongoDB task document to API response format
 * Converts _id to id and handles populated fields correctly
 */
export const transformMongoTask = (task: TaskMongoResponse): TaskResponse => {
  return {
    id: task._id.toString(),
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    tags: task.tags,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
    dueDate: task.dueDate?.toISOString(),
    createdBy: {
      id: task.createdBy._id.toString(),
      name: task.createdBy.name,
      avatarUrl: task.createdBy.avatarUrl,
    },
    assignee: task.assignee ? {
      id: task.assignee._id.toString(),
      name: task.assignee.name,
      avatarUrl: task.assignee.avatarUrl,
    } : undefined,
  };
};

/**
 * Transforms array of MongoDB task documents to API response format
 */
export const transformMongoTasks = (tasks: TaskMongoResponse[]): TaskResponse[] => {
  return tasks.map(transformMongoTask);
};
