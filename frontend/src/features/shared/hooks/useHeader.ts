import { trpc } from '@/features/shared/api/trpc';
import { useEffect } from 'react';
import { User, Notification } from '@/types/api';

export const useHeader = () => {
  const { data: currentUser } = trpc.auth.me.useQuery() as { data: User | undefined };
  const { data: notifications = [], refetch: refetchNotifications } = trpc.notifications.list.useQuery() as { data: Notification[] | undefined, refetch: () => void };
  const { data: unreadCount = 0, refetch: refetchUnreadCount } = trpc.notifications.unreadCount.useQuery() as { data: number | undefined, refetch: () => void };
  
  const { mutate: markAsRead } = trpc.notifications.markAsRead.useMutation({
    onSuccess: () => {
      refetchNotifications();
      refetchUnreadCount();
    }
  });

  const { mutate: markAllAsRead } = trpc.notifications.markAllAsRead.useMutation({
    onSuccess: () => {
      refetchNotifications();
      refetchUnreadCount();
    }
  });

  // Polling for new notifications
  useEffect(() => {
    const interval = setInterval(() => {
      refetchUnreadCount();
    }, 30000); // Poll every 30 seconds

    return () => clearInterval(interval);
  }, [refetchUnreadCount]);

  return {
    currentUser,
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
  };
};
