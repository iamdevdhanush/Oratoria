'use client';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useUIStore } from '@/store/uiStore';
import { useSessionStore } from '@/store/sessionStore';

const CONTROLS = [
  { id: 'mic', label: 'Mic', icon: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="22" />
    </svg>
  ), activeIcon: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="22" />
      <line x1="4" y1="4" x2="20" y2="20" />
    </svg>
  )},
  { id: 'camera', label: 'Camera', icon: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  ), activeIcon: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="12" r="4" />
      <line x1="4" y1="4" x2="20" y2="20" />
    </svg>
  )},
  { id: 'reactions', label: 'Reactions', icon: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <line x1="9" y1="9" x2="9.01" y2="9" />
      <line x1="15" y1="9" x2="15.01" y2="9" />
    </svg>
  ), activeIcon: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" fill="url(#grad)" />
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c9a84c" />
          <stop offset="100%" stopColor="#e8c56d" />
        </linearGradient>
      </defs>
      <path d="M8 14s1.5 2 4 2 4-2 4-2" stroke="white" strokeWidth="2" fill="none" />
      <circle cx="9" cy="9" r="1.5" fill="white" />
      <circle cx="15" cy="9" r="1.5" fill="white" />
    </svg>
  )},
  { id: 'leave', label: 'Leave', icon: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ), activeIcon: null, variant: 'danger' as const },
] as const;

export function BottomControls() {
  const { micEnabled, cameraEnabled, reactionsOpen, toggleMic, toggleCamera, toggleReactions } = useUIStore();

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200, delay: 0.2 }}
      className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50 mb-6"
    >
      <div className="flex items-center gap-2 px-3 py-2 bg-auditorium-bg/70 backdrop-blur-glass border border-auditorium-gold/20 rounded-2xl shadow-glass">
        {CONTROLS.map((control, index) => (
          <motion.button
            key={control.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.05 * index, type: 'spring', damping: 20, stiffness: 180 }}
            onClick={() => {
              if (control.id === 'mic') toggleMic();
              else if (control.id === 'camera') toggleCamera();
              else if (control.id === 'reactions') toggleReactions();
            }}
            className={`relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 ${
              control.variant === 'danger'
                ? 'text-auditorium-cream/60 hover:text-auditorium-burgundyLight hover:bg-auditorium-burgundy/10'
                : 'text-auditorium-cream/70 hover:text-auditorium-cream'
            } ${
              (control.id === 'mic' && micEnabled) ||
              (control.id === 'camera' && cameraEnabled) ||
              (control.id === 'reactions' && reactionsOpen)
                ? 'bg-auditorium-gold/15 text-auditorium-gold'
                : 'hover:bg-auditorium-gold/5'
            }`}
            aria-label={control.label}
            aria-pressed={
              (control.id === 'mic' && micEnabled) ||
              (control.id === 'camera' && cameraEnabled) ||
              (control.id === 'reactions' && reactionsOpen)
            }
          >
            {((control.id === 'mic' && micEnabled) ||
              (control.id === 'camera' && cameraEnabled) ||
              (control.id === 'reactions' && reactionsOpen)) && control.activeIcon
              ? control.activeIcon
              : control.icon}

            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-full mb-2 px-2 py-1 bg-auditorium-bg/90 backdrop-blur-sm border border-auditorium-gold/20 rounded text-xs font-medium text-auditorium-cream white-space-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity"
            >
              {control.label}
            </motion.span>
          </motion.button>
        ))}
      </div>

      {reactionsOpen && <ReactionsPanel />}
    </motion.div>
  );
}

function ReactionsPanel() {
  const { reactionsOpen, toggleReactions } = useUIStore();
  const { addNotification } = useUIStore();
  const { localParticipant } = useSessionStore();

  const REACTIONS = [
    { emoji: '👏', label: 'Applaud' },
    { emoji: '👍', label: 'Agree' },
    { emoji: '❤️', label: 'Love' },
    { emoji: '🤔', label: 'Thinking' },
    { emoji: '😮', label: 'Surprised' },
    { emoji: '🎉', label: 'Celebrate' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50"
    >
      <div className="flex items-center gap-2 px-4 py-3 bg-auditorium-bg/80 backdrop-blur-glass border border-auditorium-gold/30 rounded-2xl shadow-glass">
        {REACTIONS.map((reaction, index) => (
          <motion.button
            key={reaction.emoji}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ delay: 0.03 * index, type: 'spring', damping: 20, stiffness: 180 }}
            onClick={() => {
              addNotification({ message: `Sent ${reaction.label} reaction`, type: 'success', duration: 2000 });
              toggleReactions();
            }}
            className="w-12 h-12 rounded-xl flex flex-col items-center justify-center gap-1 bg-auditorium-bg/50 border border-auditorium-gold/10 hover:border-auditorium-gold/30 hover:bg-auditorium-gold/5 transition-all text-2xl"
            aria-label={reaction.label}
          >
            <span>{reaction.emoji}</span>
            <span className="text-xs text-auditorium-cream/60">{reaction.label}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}