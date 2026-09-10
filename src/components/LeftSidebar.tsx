'use client';

import { motion } from 'framer-motion';
import { useUIStore } from '@/store/uiStore';

interface NavItem {
  id: string;
  label: string;
  icon: (active: boolean) => React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'auditorium',
    label: 'Auditorium',
    icon: (active) => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    id: 'explore',
    label: 'Explore',
    icon: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
];

export function LeftSidebar() {
  const { addNotification, toggleRightPanel, setPeoplePanelOpen } = useUIStore();

  const handleNavClick = (id: string, label: string) => {
    if (id === 'auditorium') {
      toggleRightPanel();
    } else if (id === 'explore') {
      setPeoplePanelOpen(true);
    } else {
      addNotification({ message: `${label} selected`, type: 'info', duration: 2000 });
    }
  };

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed left-4 top-4 bottom-4 z-40 flex flex-col justify-between pointer-events-none select-none"
    >
      {/* Top Nav Box */}
      <div className="flex flex-col gap-6 pointer-events-auto">
        {/* Brand Header */}
        <div className="flex flex-col items-center gap-1.5 pt-2">
          {/* Ornate Gold Monogram Crest */}
          <div className="text-auditorium-gold drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
            <svg width="44" height="48" viewBox="0 0 54 58" fill="none">
              <path d="M27 4L33 14H21L27 4Z" fill="#e8c56d" />
              <path d="M12 18H42M14 22V44M27 22V44M40 22V44M10 46H44M8 50H46" stroke="#e8c56d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M18 30H36M18 36H36" stroke="#f5e6cc" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <h1 className="font-serif text-xl tracking-wide text-[#e8c56d] font-normal drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            Oratoria
          </h1>
        </div>

        {/* Navigation List */}
        <nav className="flex flex-col gap-2 w-44">
          {NAV_ITEMS.map((item) => {
            const isActive = item.id === 'auditorium';

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id, item.label)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-black/75 backdrop-blur-md text-white border border-white/15 shadow-glass'
                    : 'text-auditorium-cream/80 hover:text-white hover:bg-black/40 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]'
                }`}
              >
                <div className={isActive ? 'text-white' : 'text-auditorium-cream/80'}>
                  {item.icon(isActive)}
                </div>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom User Pill Card */}
      <div className="pointer-events-auto">
        <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-black/80 backdrop-blur-md border border-white/10 shadow-glass w-40">
          <div className="relative">
            {/* User Avatar Circle */}
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] flex items-center justify-center border border-white/20 shadow-sm overflow-hidden">
              <svg viewBox="0 0 32 32" className="w-full h-full">
                <circle cx="16" cy="16" r="16" fill="#7c3aed" />
                <circle cx="16" cy="12" r="6" fill="#fed7aa" />
                <path d="M10 11c0-4 3-6 6-6s6 2 6 6c-2-1-4-1-6-1s-4 0-6 1z" fill="#451a03" />
                <path d="M9 28c1-6 4-8 7-8s6 2 7 8" fill="#581c87" />
              </svg>
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-black" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-white leading-tight">You</p>
            <p className="text-[11px] text-emerald-400/80 leading-tight">Online</p>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}