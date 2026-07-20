import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, CheckCircle2, CreditCard, Car, Clock, LogOut,
  AlertTriangle, FileText, Settings, Check, Trash2,
  ChevronRight, Filter, MailOpen, Mail
} from 'lucide-react';
import { mockNotifications } from '../../lib/data';
import { cn } from '../../lib/utils';

const iconMap: Record<string, any> = {
  CheckCircle: CheckCircle2,
  CreditCard,
  Car,
  Clock,
  LogOut,
  AlertTriangle,
  FileText,
};

const colorMap: Record<string, { bg: string; icon: string }> = {
  success: { bg: 'bg-green-50 dark:bg-green-900/20', icon: 'text-green-600 dark:text-green-400' },
  brand: { bg: 'bg-[#0F766E]/10 dark:bg-[#14B8A6]/10', icon: 'text-[#0F766E] dark:text-[#14B8A6]' },
  info: { bg: 'bg-blue-50 dark:bg-blue-900/20', icon: 'text-blue-600 dark:text-blue-400' },
  amber: { bg: 'bg-amber-50 dark:bg-amber-900/20', icon: 'text-amber-600 dark:text-amber-400' },
  secondary: { bg: 'bg-[#F8FAFC] dark:bg-[#334155]', icon: 'text-[#6B7280]' },
  danger: { bg: 'bg-red-50 dark:bg-red-900/20', icon: 'text-red-600 dark:text-red-400' },
};

export function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState('all');

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const markRead = (id: number) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const filteredNotifications = filter === 'all'
    ? notifications
    : filter === 'unread'
      ? notifications.filter(n => !n.read)
      : notifications.filter(n => n.type === filter);

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'unread', label: `Unread (${unreadCount})` },
    { id: 'booking', label: 'Bookings' },
    { id: 'payment', label: 'Payments' },
    { id: 'alert', label: 'Alerts' },
  ];

  return (
    <div className="page-shell max-w-3xl space-y-6">
      {/* Header */}
      <div className="page-hero flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-[#0F766E]/10 dark:bg-[#14B8A6]/10 flex items-center justify-center">
              <Bell className="w-5 h-5 text-[#0F766E] dark:text-[#14B8A6]" />
            </div>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#111827] dark:text-white tracking-tight">Notifications</h1>
            <p className="text-sm text-[#6B7280] dark:text-[#94A3B8] mt-0.5">
              {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="btn-ghost text-xs">
              <MailOpen className="w-3.5 h-3.5" />
              Mark all read
            </button>
          )}
          <button className="btn-ghost text-xs">
            <Settings className="w-3.5 h-3.5" />
            Settings
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        {filters.map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={cn(
              'pill-tab',
              filter === f.id
                ? 'bg-[#0F766E] text-white'
                : 'bg-white/80 dark:bg-white/5 border border-white/70 dark:border-white/10 text-[#6B7280]'
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Notification list */}
      <div className="space-y-2">
        <AnimatePresence>
          {filteredNotifications.map((notification, i) => {
            const Icon = iconMap[notification.icon] || Bell;
            const colors = colorMap[notification.color] || colorMap.secondary;

            return (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 50, height: 0 }}
                transition={{ delay: i * 0.05, duration: 0.2 }}
                onClick={() => markRead(notification.id)}
                className={cn(
                  'card p-4 flex items-start gap-4 cursor-pointer group',
                  !notification.read && 'border-l-4 border-l-[#0F766E] dark:border-l-[#14B8A6]'
                )}
              >
                {/* Icon */}
                <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0', colors.bg)}>
                  <Icon className={cn('w-4.5 h-4.5', colors.icon)} size={18} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className={cn(
                      'text-sm truncate',
                      notification.read ? 'font-medium text-[#6B7280] dark:text-[#94A3B8]' : 'font-bold text-[#111827] dark:text-white'
                    )}>
                      {notification.title}
                    </h3>
                    {!notification.read && (
                      <div className="w-2 h-2 rounded-full bg-[#0F766E] dark:bg-[#14B8A6] flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-[#6B7280] dark:text-[#94A3B8] mt-0.5 line-clamp-2">
                    {notification.message}
                  </p>
                  <span className="text-[11px] text-[#9CA3AF] mt-1 block">{notification.time}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  {!notification.read && (
                    <button
                      onClick={e => { e.stopPropagation(); markRead(notification.id); }}
                      className="p-1.5 rounded-lg hover:bg-[#F8FAFC] dark:hover:bg-[#334155] transition-colors"
                      title="Mark as read"
                    >
                      <Check className="w-3.5 h-3.5 text-[#6B7280]" />
                    </button>
                  )}
                  <button
                    onClick={e => { e.stopPropagation(); deleteNotification(notification.id); }}
                    className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-[#9CA3AF] hover:text-red-500" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Empty state */}
      {filteredNotifications.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="w-16 h-16 rounded-3xl bg-[#F8FAFC] dark:bg-[#334155] flex items-center justify-center mx-auto mb-4">
            <Bell className="w-8 h-8 text-[#9CA3AF]" />
          </div>
          <h3 className="text-lg font-bold text-[#111827] dark:text-white mb-1">
            {filter === 'unread' ? 'All caught up!' : 'No notifications'}
          </h3>
          <p className="text-sm text-[#6B7280] dark:text-[#94A3B8] mb-4">
            {filter === 'unread'
              ? 'You\'ve read all your notifications. Great job!'
              : 'When something happens, you\'ll see it here.'}
          </p>
          {filter !== 'all' && (
            <button onClick={() => setFilter('all')} className="btn-primary">
              View All Notifications
            </button>
          )}
        </motion.div>
      )}
    </div>
  );
}
