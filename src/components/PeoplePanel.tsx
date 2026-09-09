'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '@/store/uiStore';
import { useSessionStore } from '@/store/sessionStore';
import { GlassCard } from './GlassCard';
import { Participant } from '@/types';

export function PeoplePanel() {
  const { peoplePanelOpen, setPeoplePanelOpen } = useUIStore();
  const { session, localParticipant } = useSessionStore();
  const [searchQuery, setSearchQuery] = useState('');

  if (!peoplePanelOpen) return null;

  const allParticipants: Participant[] = [
    localParticipant,
    ...session.participants.filter((p) => p.id !== localParticipant.id),
  ];

  const filteredParticipants = allParticipants.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setPeoplePanelOpen(false)}
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 250 }}
          className="relative w-full max-w-lg z-10"
        >
          <GlassCard padding="lg" className="border-auditorium-gold/30 shadow-gold-glow flex flex-col max-h-[85vh]">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-auditorium-gold/20">
              <div>
                <h3 className="font-serif text-2xl text-auditorium-cream font-medium">Auditorium Attendees</h3>
                <p className="text-xs text-auditorium-cream/50 mt-0.5">
                  {allParticipants.length} people present in this session
                </p>
              </div>
              <button
                onClick={() => setPeoplePanelOpen(false)}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-auditorium-cream/60 hover:text-auditorium-cream hover:bg-auditorium-gold/10 transition-colors"
                aria-label="Close people panel"
              >
                ✕
              </button>
            </div>

            {/* Search Input */}
            <div className="mt-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search participants by name..."
                  className="w-full bg-auditorium-bg/70 border border-auditorium-gold/20 rounded-xl px-4 py-2.5 pl-10 text-sm text-auditorium-cream placeholder-auditorium-cream/40 focus:outline-none focus:border-auditorium-gold/50 transition-colors"
                />
                <span className="absolute left-3.5 top-2.5 text-auditorium-cream/40 text-sm">🔍</span>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-2.5 text-xs text-auditorium-cream/40 hover:text-auditorium-cream"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Participants List */}
            <div className="flex-1 overflow-y-auto mt-4 space-y-2 pr-1">
              {filteredParticipants.length === 0 ? (
                <div className="text-center py-8 text-sm text-auditorium-cream/40">
                  No participants match "{searchQuery}"
                </div>
              ) : (
                filteredParticipants.map((participant) => {
                  const isLocal = participant.id === localParticipant.id;
                  const isHost = participant.name === session.host;

                  return (
                    <div
                      key={participant.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-auditorium-bg/40 border border-auditorium-gold/10 hover:border-auditorium-gold/25 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-serif font-bold text-auditorium-cream shadow-sm"
                            style={{
                              backgroundColor: participant.avatar?.bodyColor || '#722f37',
                              border: `2px solid ${participant.avatar?.accentColor || '#c9a84c'}`,
                            }}
                          >
                            {participant.name[0]}
                          </div>
                          <span
                            className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-auditorium-bg ${
                              participant.isOnline ? 'bg-emerald-500' : 'bg-zinc-500'
                            }`}
                          />
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-auditorium-cream">
                              {participant.name} {isLocal && <span className="text-auditorium-gold">(You)</span>}
                            </p>
                            {isHost && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-auditorium-gold/20 text-auditorium-gold">
                                Host
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-auditorium-cream/40">
                            {participant.isSpeaking
                              ? '🎙️ Speaking'
                              : participant.hasRaisedHand
                              ? '✋ Hand raised'
                              : 'Listening'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {participant.hasRaisedHand && (
                          <span className="text-base animate-bounce" title="Raised hand">
                            ✋
                          </span>
                        )}
                        {participant.isSpeaking && (
                          <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-auditorium-gold opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-auditorium-gold"></span>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="mt-4 pt-3 border-t border-auditorium-gold/10 flex justify-end">
              <button
                onClick={() => setPeoplePanelOpen(false)}
                className="px-5 py-2 rounded-xl bg-auditorium-gold/15 hover:bg-auditorium-gold/25 text-auditorium-gold text-sm font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
