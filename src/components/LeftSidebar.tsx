'use client';

import { motion } from 'framer-motion';
import { useUIStore } from '@/store/uiStore';

const NAV_ITEMS = [
  { id: 'auditorium', label: 'Auditorium', icon: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )},
  { id: 'explore', label: 'Explore', icon: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )},
  { id: 'profile', label: 'Profile', icon: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )},
  { id: 'settings', label: 'Settings', icon: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  )},
] as const;

export function LeftSidebar() {
  return (
    <motion.nav
      initial={{ x: -72, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200, delay: 0.1 }}
      className="fixed left-0 top-0 h-full z-40 flex flex-col"
    >
      <div className="flex flex-col h-full bg-auditorium-bg/70 backdrop-blur-glass border-r border-auditorium-gold/20">
        <div className="p-4 border-b border-auditorium-gold/20">
          <h1 className="font-serif text-xl text-auditorium-gold font-medium tracking-tight">Oratoria</h1>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-3 space-y-2">
          {NAV_ITEMS.map((item, index) => (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + index * 0.08 }}
              className="relative w-12 h-12 rounded-xl flex items-center justify-center text-auditorium-cream/60 hover:text-auditorium-cream hover:bg-auditorium-gold/10 transition-all duration-200 group"
              aria-label={item.label}
            >
              <div className="relative z-10">{item.icon}</div>
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="absolute left-full ml-3 px-3 py-1.5 bg-auditorium-bg/90 backdrop-blur-sm border border-auditorium-gold/20 rounded-lg text-xs font-medium text-auditorium-cream white-space-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity"
              >
                {item.label}
              </motion.span>
            </motion.button>
          ))}
        </div>

        <div className="p-4 border-t border-auditorium-gold/20">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-auditorium-gold/5 border border-auditorium-gold/20">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-auditorium-burgundy to-auditorium-walnut flex items-center justify-center text-xs font-serif text-auditorium-cream">
              Y
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-auditorium-cream truncate">You</p>
              <p className="text-xs text-auditorium-cream/50">Guest</p>
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}