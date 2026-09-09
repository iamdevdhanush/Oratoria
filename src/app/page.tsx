'use client';

import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { LeftSidebar } from '@/components/LeftSidebar';
import { RightPanel } from '@/components/RightPanel';
import { TopStatsBar } from '@/components/TopStatsBar';
import { BottomControls } from '@/components/BottomControls';
import { PeoplePanel } from '@/components/PeoplePanel';
import { NotificationToast } from '@/components/NotificationToast';
import { useUIStore } from '@/store/uiStore';

const GameCanvas = dynamic(
  () => import('@/game/GameCanvas').then((mod) => mod.GameCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center bg-auditorium-bg text-auditorium-gold gap-3 select-none">
        <div className="w-10 h-10 rounded-full border-2 border-auditorium-gold/30 border-t-auditorium-gold animate-spin" />
        <p className="font-serif text-sm tracking-wider text-auditorium-cream/70">
          Entering Oratoria Auditorium...
        </p>
      </div>
    ),
  }
);

export default function AuditoriumPage() {
  const { rightPanelOpen, setRightPanelOpen } = useUIStore();

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-auditorium-bg select-none">
      {/* Phaser Canvas World */}
      <div className="absolute inset-0 w-full h-full z-0">
        <GameCanvas />
      </div>

      {/* Left Navigation Sidebar */}
      <LeftSidebar />

      {/* Top-Right Stats Pill */}
      <TopStatsBar />

      {/* Right Dual-Card Stack (Live Session + Live Chat) */}
      <AnimatePresence>
        {rightPanelOpen && <RightPanel />}
      </AnimatePresence>

      {/* Re-open Session button when collapsed */}
      {!rightPanelOpen && (
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => setRightPanelOpen(true)}
          className="fixed top-16 right-6 z-30 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-black/75 backdrop-blur-md border border-white/10 shadow-glass text-auditorium-cream hover:text-auditorium-gold transition-all"
          aria-label="Open session panel"
        >
          <span className="text-sm">🎙️</span>
          <span className="font-serif text-xs font-medium text-auditorium-cream">
            Live Session
          </span>
        </motion.button>
      )}

      {/* Bottom Floating Controls Dock */}
      <BottomControls />

      {/* People / Attendee List Modal */}
      <PeoplePanel />

      {/* Ambient Toast Notifications */}
      <NotificationToast />
    </main>
  );
}
