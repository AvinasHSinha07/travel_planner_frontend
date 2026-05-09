'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  Bell, 
  Check,
  Loader2,
  Trash2,
  AlertCircle,
  Calendar,
  CreditCard,
  Info,
  CheckCheck
} from 'lucide-react';
import axiosInstance from '@/lib/axiosInstance';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface Notification {
  id: string;
  type: 'BOOKING' | 'TRIP_REMINDER' | 'PROMOTION' | 'SYSTEM';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

const typeIcons: Record<string, React.ReactNode> = {
  BOOKING: <CreditCard className="w-5 h-5" />,
  TRIP_REMINDER: <Calendar className="w-5 h-5" />,
  PROMOTION: <Bell className="w-5 h-5" />,
  SYSTEM: <Info className="w-5 h-5" />,
};

const typeColors: Record<string, string> = {
  BOOKING: 'bg-green-500/10 text-green-600',
  TRIP_REMINDER: 'bg-blue-500/10 text-blue-600',
  PROMOTION: 'bg-purple-500/10 text-purple-600',
  SYSTEM: 'bg-gray-500/10 text-gray-600',
};

const NotificationsPage = () => {
  const { data: session } = authClient.useSession();
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications', session?.user?.id],
    queryFn: async () => {
      const response = await axiosInstance.get('/notification');
      return response.data.data as Notification[];
    },
    enabled: !!session?.user?.id,
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      await axiosInstance.patch(`/notification/${id}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      await axiosInstance.patch('/notification/read-all');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('All notifications marked as read');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await axiosInstance.delete(`/notification/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      setDeletingId(null);
    },
  });

  const unreadCount = notifications?.filter(n => !n.isRead).length || 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground uppercase mb-2">
            Notifications
          </h1>
          <p className="text-muted-foreground font-medium uppercase tracking-[0.2em] text-xs">
            Stay Updated on Your Travel Plans
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {unreadCount > 0 && (
            <Badge variant="outline" className="rounded-full px-4 py-2 text-xs font-black uppercase">
              {unreadCount} Unread
            </Badge>
          )}
          {notifications && notifications.length > 0 && (
            <Button 
              variant="outline" 
              className="h-12 rounded-xl font-black uppercase text-xs tracking-widest"
              onClick={() => markAllAsReadMutation.mutate()}
              disabled={markAllAsReadMutation.isPending}
            >
              <CheckCheck className="w-4 h-4 mr-2" />
              Mark All Read
            </Button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      {notifications && notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`group relative bg-card border rounded-[2rem] p-6 transition-all ${
                notification.isRead 
                  ? 'border-border/50 opacity-70' 
                  : 'border-primary/30 shadow-md'
              }`}
            >
              <div className="flex items-start space-x-4">
                {/* Icon */}
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${typeColors[notification.type]}`}>
                  {typeIcons[notification.type]}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-1">
                    <h3 className={`font-black ${notification.isRead ? 'text-foreground' : 'text-foreground'}`}>
                      {notification.title}
                    </h3>
                    {!notification.isRead && (
                      <span className="w-2 h-2 bg-primary rounded-full" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {notification.message}
                  </p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {!notification.isRead && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-10 h-10 rounded-xl"
                      onClick={() => markAsReadMutation.mutate(notification.id)}
                      disabled={markAsReadMutation.isPending}
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-10 h-10 rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => {
                      setDeletingId(notification.id);
                      deleteMutation.mutate(notification.id);
                    }}
                    disabled={deleteMutation.isPending && deletingId === notification.id}
                  >
                    {deleteMutation.isPending && deletingId === notification.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-secondary/5 rounded-[3rem] border-2 border-dashed border-border">
          <Bell className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
          <h3 className="text-2xl font-black mb-2">No notifications</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            You&apos;re all caught up! Notifications about your trips and bookings will appear here.
          </p>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
