'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSessionStore } from '@/store/sessionStore';

export function TopStatsBar() {
  const { session } = useSessionStore();
  const [elapsed, setElapsed] = useState(session.elapsedTime);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed((prev) => prev + 1000);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const totalSeconds = Math.floor(elapsed / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const count = session.participants.length + 1; // including local user
  const max = session.maxParticipants || 50;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed top-4 right-6 z-40 flex items-center gap-3 px-4 py-2 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-xs text-auditorium-cream font-medium shadow-glass select-none"
    >
      {/* Participants */}
      <div className="flex items-center gap-2">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-auditorium-cream/70">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
        <span>{count} / {max}</span>
      </div>

      <div className="w-px h-3 bg-white/20" />

      {/* Elapsed Timer */}
      <div className="flex items-center gap-1.5 font-mono">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-auditorium-cream/70">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        <span>{timeString}</span>
      </div>

      <div className="w-px h-3 bg-white/20" />

      {/* Latency */}
      <div className="flex items-center gap-1.5 font-mono text-emerald-400">
        <div className="flex items-end gap-0.5 h-3">
          <span className="w-0.5 h-1 bg-emerald-400 rounded-sm" />
          <span className="w-0.5 h-1.5 bg-emerald-400 rounded-sm" />
          <span className="w-0.5 h-2 bg-emerald-400 rounded-sm" />
          <span className="w-0.5 h-3 bg-emerald-400 rounded-sm" />
        </div>
        <span>{session.pingMs || 32}ms</span>
      </div>
    </motion.div>
  );
}
