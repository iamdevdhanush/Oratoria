'use client';

import { motion } from 'framer-motion';
import { useUIStore } from '@/store/uiStore';
import { useSessionStore } from '@/store/sessionStore';

export function BottomControls() {
  const {
    micEnabled,
    cameraEnabled,
    reactionsOpen,
    toggleMic,
    toggleCamera,
    toggleReactions,
    addNotification,
  } = useUIStore();
  const { session } = useSessionStore();

  const handleShare = () => {
    addNotification({
      message: 'Screen sharing requested (Presenter mode)',
      type: 'info',
      duration: 2500,
    });
  };

  const handleLeave = () => {
    addNotification({
      message: 'Session paused. Click Auditorium in the sidebar to return.',
      type: 'warning',
      duration: 3000,
    });
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 select-none">
      {/* Location Badge */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 25, stiffness: 220, delay: 0.1 }}
        className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-black/80 backdrop-blur-md border border-white/10 shadow-glass"
      >
        <div className="w-6 h-6 flex items-center justify-center text-auditorium-gold">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#c9a84c">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-white leading-tight">
            {session.location || 'Main Hall'}
          </span>
          <span className="text-[10px] text-auditorium-cream/50 leading-tight">
            Oratoria
          </span>
        </div>
      </motion.div>

      {/* Main Controls Capsule Dock */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
        className="relative"
      >
        <div className="flex items-center gap-2 px-5 py-2 rounded-2xl bg-black/75 backdrop-blur-md border border-white/10 shadow-glass">
          {/* 1. Mic */}
          <button
            onClick={() => {
              toggleMic();
              addNotification({
                message: micEnabled ? 'Microphone muted' : 'Microphone unmuted',
                type: 'info',
                duration: 2000,
              });
            }}
            className="flex flex-col items-center gap-1 min-w-[52px] py-1 text-auditorium-cream/80 hover:text-white transition-colors group"
            aria-label="Toggle microphone"
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                micEnabled
                  ? 'bg-auditorium-gold/20 text-auditorium-gold border border-auditorium-gold/40'
                  : 'bg-white/5 text-auditorium-cream/60 hover:bg-white/10'
              }`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="22" />
                {!micEnabled && <line x1="4" y1="4" x2="20" y2="20" />}
              </svg>
            </div>
            <span className="text-[10px] text-auditorium-cream/70 font-medium group-hover:text-white">
              Mic
            </span>
          </button>

          {/* 2. Camera */}
          <button
            onClick={() => {
              toggleCamera();
              addNotification({
                message: cameraEnabled ? 'Camera turned off' : 'Camera turned on',
                type: 'info',
                duration: 2000,
              });
            }}
            className="flex flex-col items-center gap-1 min-w-[52px] py-1 text-auditorium-cream/80 hover:text-white transition-colors group"
            aria-label="Toggle camera"
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                cameraEnabled
                  ? 'bg-auditorium-gold/20 text-auditorium-gold border border-auditorium-gold/40'
                  : 'bg-white/5 text-auditorium-cream/60 hover:bg-white/10'
              }`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="12" r="4" />
                {!cameraEnabled && <line x1="4" y1="4" x2="20" y2="20" />}
              </svg>
            </div>
            <span className="text-[10px] text-auditorium-cream/70 font-medium group-hover:text-white">
              Camera
            </span>
          </button>

          {/* 3. Reactions */}
          <button
            onClick={toggleReactions}
            className="flex flex-col items-center gap-1 min-w-[52px] py-1 text-auditorium-cream/80 hover:text-white transition-colors group"
            aria-label="Reactions"
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                reactionsOpen
                  ? 'bg-auditorium-gold/20 text-auditorium-gold border border-auditorium-gold/40'
                  : 'bg-white/5 text-auditorium-cream/60 hover:bg-white/10'
              }`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                <line x1="9" y1="9" x2="9.01" y2="9" />
                <line x1="15" y1="9" x2="15.01" y2="9" />
              </svg>
            </div>
            <span className="text-[10px] text-auditorium-cream/70 font-medium group-hover:text-white">
              Reactions
            </span>
          </button>

          {/* 4. Share */}
          <button
            onClick={handleShare}
            className="flex flex-col items-center gap-1 min-w-[52px] py-1 text-auditorium-cream/80 hover:text-white transition-colors group"
            aria-label="Share screen"
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 text-auditorium-cream/60 hover:bg-white/10 transition-all">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <polyline points="8 21 12 17 16 21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
            </div>
            <span className="text-[10px] text-auditorium-cream/70 font-medium group-hover:text-white">
              Share
            </span>
          </button>

          {/* 5. Leave Button */}
          <button
            onClick={handleLeave}
            className="flex flex-col items-center gap-1 min-w-[52px] py-1 text-auditorium-cream/80 hover:text-white transition-colors group"
            aria-label="Leave session"
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#dc2626] hover:bg-[#ef4444] text-white shadow-md transition-all active:scale-95">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08a.996.996 0 0 1 0-1.41C3.28 8.84 7.42 7 12 7c4.58 0 8.72 1.84 11.71 4.67.39.39.39 1.02 0 1.41l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.11-.7-.28-.79-.74-1.69-1.36-2.67-1.85-.33-.16-.56-.5-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z" />
              </svg>
            </div>
            <span className="text-[10px] text-auditorium-cream/70 font-medium group-hover:text-white">
              Leave
            </span>
          </button>
        </div>

        {/* Reactions Popup */}
        {reactionsOpen && <ReactionsPopup />}
      </motion.div>
    </div>
  );
}

function ReactionsPopup() {
  const { toggleReactions, addNotification } = useUIStore();

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
      initial={{ opacity: 0, y: 15, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 15, scale: 0.95 }}
      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-50 flex items-center gap-1.5 p-2 rounded-2xl bg-black/85 backdrop-blur-md border border-auditorium-gold/30 shadow-glass"
    >
      {REACTIONS.map((r) => (
        <button
          key={r.emoji}
          onClick={() => {
            addNotification({
              message: `You reacted with ${r.emoji}`,
              type: 'success',
              duration: 2000,
            });
            toggleReactions();
          }}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl hover:bg-white/10 hover:scale-110 active:scale-95 transition-transform"
          title={r.label}
        >
          {r.emoji}
        </button>
      ))}
    </motion.div>
  );
}