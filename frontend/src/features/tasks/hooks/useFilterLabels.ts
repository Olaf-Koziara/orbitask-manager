import { Priority, TaskStatus } from '@/features/tasks/types';

/**
 * Custom hook for managing filter labels
 * Centralizes label logic to follow DRY principles
 */
export const useFilterLabels = () => {
  const getStatusLabel = (status: TaskStatus): string => {
    const statusLabels: Record<TaskStatus, string> = {
      [TaskStatus.TODO]: 'To Do',
      [TaskStatus.IN_PROGRESS]: 'In Progress',
      [TaskStatus.REVIEW]: 'Review',
      [TaskStatus.DONE]: 'Done'
    };
    return statusLabels[status];
  };

  const getPriorityLabel = (priority: Priority): string => {
    const priorityLabels: Record<Priority, string> = {
      [Priority.LOW]: 'Low',
      [Priority.MEDIUM]: 'Medium',
      [Priority.HIGH]: 'High',
      [Priority.URGENT]: 'Urgent'
    };
    return priorityLabels[priority];
  };

  const getPriorityColor = (priority: Priority): string => {
    const priorityColors: Record<Priority, string> = {
      [Priority.LOW]: 'text-blue-600',
      [Priority.MEDIUM]: 'text-yellow-600',
      [Priority.HIGH]: 'text-orange-600',
      [Priority.URGENT]: 'text-red-600'
    };
    return priorityColors[priority];
  };

  const getStatusColor = (status: TaskStatus): string => {
    const statusColors: Record<TaskStatus, string> = {
      [TaskStatus.TODO]: 'text-gray-600',
      [TaskStatus.IN_PROGRESS]: 'text-blue-600',
      [TaskStatus.REVIEW]: 'text-purple-600',
      [TaskStatus.DONE]: 'text-green-600'
    };
    return statusColors[status];
  };

  return {
    getStatusLabel,
    getPriorityLabel,
    getPriorityColor,
    getStatusColor
  };
};
