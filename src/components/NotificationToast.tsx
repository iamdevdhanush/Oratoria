'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '@/store/uiStore';
import { Notification } from '@/types';

export function NotificationToast() {
  const { notifications, removeNotification } = useUIStore();
  // Queue size = 1: only one active toast
  const activeNotification = notifications[notifications.length - 1];

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center pointer-events-none">
      <AnimatePresence mode="wait">
        {activeNotification && (
          <ToastItem
            key={activeNotification.id}
            notification={activeNotification}
            onDismiss={() => removeNotification(activeNotification.id)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function ToastItem({
  notification,
  onDismiss,
}: {
  notification: Notification;
  onDismiss: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, notification.duration || 2500);
    return () => clearTimeout(timer);
  }, [notification.id, notification.duration, onDismiss]);

  const borderColors: Record<Notification['type'], string> = {
    info: 'border-auditorium-gold/40 text-auditorium-gold',
    success: 'border-emerald-500/40 text-emerald-400',
    warning: 'border-amber-500/40 text-amber-400',
    error: 'border-auditorium-burgundy/60 text-red-400',
  };

  const icons: Record<Notification['type'], string> = {
    info: '✦',
    success: '✓',
    warning: '⚠',
    error: '✕',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -16, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className={`pointer-events-auto flex items-center gap-3 px-4 py-2.5 rounded-xl bg-auditorium-bg/95 backdrop-blur-glass border ${borderColors[notification.type]} shadow-glass`}
    >
      <span className="font-serif text-sm">{icons[notification.type]}</span>
      <span className="text-sm font-medium text-auditorium-cream">{notification.message}</span>
      <button
        onClick={onDismiss}
        className="ml-2 text-auditorium-cream/40 hover:text-auditorium-cream text-xs transition-colors"
        aria-label="Dismiss notification"
      >
        ✕
      </button>
    </motion.div>
  );
}
