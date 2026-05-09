import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Notification {
  id: string;
  type: 'BOOKING' | 'TRIP_REMINDER' | 'PROMOTION' | 'SYSTEM';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationState {
  unreadCount: number;
  liveNotifications: Notification[];
  incrementUnread: () => void;
  decrementUnread: () => void;
  setUnreadCount: (count: number) => void;
  addLiveNotification: (notification: Notification) => void;
  markAllRead: () => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      unreadCount: 0,
      liveNotifications: [],
      incrementUnread: () => set((state) => ({ unreadCount: state.unreadCount + 1 })),
      decrementUnread: () => set((state) => ({ unreadCount: Math.max(0, state.unreadCount - 1) })),
      setUnreadCount: (count) => set({ unreadCount: count }),
      addLiveNotification: (notification) =>
        set((state) => ({
          liveNotifications: [notification, ...state.liveNotifications],
          unreadCount: state.unreadCount + 1,
        })),
      markAllRead: () => set({ unreadCount: 0 }),
    }),
    {
      name: 'notification-storage',
    },
  ),
);
