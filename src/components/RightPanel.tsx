'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSessionStore } from '@/store/sessionStore';
import { useUIStore } from '@/store/uiStore';

export function RightPanel() {
  const { rightPanelOpen, setRightPanelOpen, setPeoplePanelOpen } = useUIStore();
  const { session, localParticipant, toggleHand, messages, addMessage } = useSessionStore();
  const [activeTab, setActiveTab] = useState<'session' | 'people' | 'chat'>('session');
  const [chatInput, setChatInput] = useState('');
  const [chatMinimized, setChatMinimized] = useState(false);

  if (!rightPanelOpen) return null;

  const participantCount = session.participants.length + 1;
  const elapsedMinutes = Math.floor(session.elapsedTime / 60000);
  const elapsedSeconds = Math.floor((session.elapsedTime % 60000) / 1000);
  const elapsedString = `${elapsedMinutes.toString().padStart(2, '0')}:${elapsedSeconds.toString().padStart(2, '0')}`;

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    addMessage({
      authorId: 'local-player',
      authorName: 'You',
      content: chatInput.trim(),
      type: 'message',
    });
    setChatInput('');
  };

  return (
    <aside className="fixed right-6 top-16 bottom-4 z-40 w-[350px] flex flex-col gap-3 pointer-events-none select-none">
      {/* CARD 1: LIVE SESSION */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
        className="pointer-events-auto rounded-2xl bg-black/70 backdrop-blur-md border border-white/10 p-4 shadow-glass text-auditorium-cream flex flex-col gap-3.5"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-white tracking-tight">Live Session</h2>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-[11px] font-medium text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Live</span>
          </div>
        </div>

        {/* Open Talk Hero Box */}
        <div className="p-3 rounded-xl bg-gradient-to-r from-[#2c1a16]/80 to-[#1f1614]/80 border border-auditorium-gold/20 flex flex-col gap-2.5">
          <div className="flex items-start gap-3">
            {/* Temple Icon Badge */}
            <div className="w-10 h-10 rounded-xl bg-[#4a1c1d] border border-auditorium-gold/30 flex items-center justify-center text-auditorium-gold shrink-0 shadow-sm">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7v2h20V7L12 2zM4 11v8h2v-8H4zm5 0v8h2v-8H9zm5 0v8h2v-8h-2zm5 0v8h2v-8h-2zM2 20v2h20v-2H2z" />
              </svg>
            </div>

            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-semibold text-auditorium-gold tracking-widest uppercase block leading-tight">
                OPEN TALK
              </span>
              <h3 className="text-sm font-bold text-white leading-snug mt-0.5 truncate">
                "{session.topic}"
              </h3>
              <p className="text-[11px] text-auditorium-cream/50 mt-0.5">
                Hosted by {session.host}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-auditorium-cream/60 pt-1 border-t border-white/5 font-mono">
            <span className="flex items-center gap-1.5">
              👥 {participantCount} / {session.maxParticipants} participants
            </span>
            <span className="flex items-center gap-1.5">
              ⏱ 00:{elapsedString}
            </span>
          </div>
        </div>

        {/* Solid Gold Raise Hand CTA */}
        <button
          onClick={toggleHand}
          className={`w-full py-2.5 px-4 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-sm ${
            localParticipant.hasRaisedHand
              ? 'bg-[#722f37] text-white border border-auditorium-gold/40 hover:bg-[#8b3a45]'
              : 'bg-gradient-to-r from-[#eec068] to-[#e6b152] text-[#1a1612] hover:brightness-105 active:scale-[0.99]'
          }`}
        >
          <span className="text-sm">✋</span>
          <span>{localParticipant.hasRaisedHand ? 'Lower Hand' : 'Raise Hand'}</span>
        </button>

        {/* Tab Segment Switcher */}
        <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-black/40 border border-white/5">
          <button
            onClick={() => setActiveTab('session')}
            className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'session'
                ? 'bg-black/70 text-auditorium-gold border border-auditorium-gold/30 shadow-sm'
                : 'text-auditorium-cream/60 hover:text-auditorium-cream'
            }`}
          >
            <span>🏛</span>
            <span>Session</span>
          </button>
          <button
            onClick={() => setActiveTab('people')}
            className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'people'
                ? 'bg-black/70 text-auditorium-gold border border-auditorium-gold/30 shadow-sm'
                : 'text-auditorium-cream/60 hover:text-auditorium-cream'
            }`}
          >
            <span>👥</span>
            <span>People</span>
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'chat'
                ? 'bg-black/70 text-auditorium-gold border border-auditorium-gold/30 shadow-sm'
                : 'text-auditorium-cream/60 hover:text-auditorium-cream'
            }`}
          >
            <span>💬</span>
            <span>Chat</span>
          </button>
        </div>

        {/* Tab Body */}
        {activeTab === 'session' && (
          <div className="flex flex-col gap-2.5 text-xs">
            <div>
              <h4 className="font-medium text-white text-xs mb-1">Session Details</h4>
              <p className="text-[11px] text-auditorium-cream/60 leading-relaxed">
                {session.description || "Let's discuss how AI is shaping education and what opportunities it creates for future learners."}
              </p>
            </div>

            {/* 3-column Metadata Grid */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/5 text-center">
              <div className="flex flex-col">
                <span className="text-[10px] text-auditorium-cream/40">Category</span>
                <span className="text-[11px] font-medium text-white mt-0.5">
                  {session.category || 'Education'}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-auditorium-cream/40">Language</span>
                <span className="text-[11px] font-medium text-white mt-0.5">
                  {session.language || 'English'}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-auditorium-cream/40">Audience</span>
                <span className="text-[11px] font-medium text-white mt-0.5">
                  {session.audience || 'Open for All'}
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'people' && (
          <div className="flex flex-col gap-2 max-h-44 overflow-y-auto pr-1">
            <div className="flex items-center justify-between pb-1 border-b border-white/5">
              <span className="text-xs text-auditorium-cream/60">Participants ({participantCount})</span>
              <button
                onClick={() => setPeoplePanelOpen(true)}
                className="text-[11px] text-auditorium-gold hover:underline"
              >
                View all →
              </button>
            </div>
            {session.participants.map((p) => (
              <div key={p.id} className="flex items-center justify-between py-1 text-xs">
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] text-white font-serif"
                    style={{ backgroundColor: p.avatar.bodyColor }}
                  >
                    {p.name[0]}
                  </div>
                  <span className="text-auditorium-cream font-medium">{p.name}</span>
                </div>
                {p.hasRaisedHand && <span className="text-xs">✋</span>}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="text-xs text-auditorium-cream/60 text-center py-2">
            See the live chat window below ↓
          </div>
        )}
      </motion.div>

      {/* CARD 2: LIVE CHAT */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 220, delay: 0.1 }}
        className="pointer-events-auto rounded-2xl bg-black/70 backdrop-blur-md border border-white/10 shadow-glass flex flex-col flex-1 max-h-72 min-h-[200px] overflow-hidden"
      >
        {/* Chat Header */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-sm">💬</span>
            <h3 className="text-xs font-semibold text-white tracking-wide">Live Chat</h3>
          </div>
          <div className="flex items-center gap-2 text-auditorium-cream/50 text-xs">
            <button
              onClick={() => setChatMinimized(!chatMinimized)}
              className="hover:text-white p-0.5"
              aria-label="Minimize chat"
            >
              —
            </button>
            <button
              onClick={() => setRightPanelOpen(false)}
              className="hover:text-white p-0.5"
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>
        </div>

        {!chatMinimized && (
          <>
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
              {messages.map((msg) => {
                const isLocal = msg.authorId === 'local-player';
                const time = msg.timeStr || new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                return (
                  <div key={msg.id} className="flex items-start gap-2.5">
                    {/* User Avatar */}
                    <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 border border-white/10 shadow-sm mt-0.5 bg-[#251d18] flex items-center justify-center">
                      {msg.authorName === 'Aarav' ? (
                        <svg viewBox="0 0 32 32" className="w-full h-full">
                          <circle cx="16" cy="16" r="16" fill="#3b82f6" />
                          <circle cx="16" cy="12" r="6" fill="#fed7aa" />
                          <path d="M10 11c0-4 3-6 6-6s6 2 6 6c-2-1-4-1-6-1s-4 0-6 1z" fill="#451a03" />
                          <path d="M9 28c1-6 4-8 7-8s6 2 7 8" fill="#1e3a8a" />
                        </svg>
                      ) : msg.authorName === 'Ananya' ? (
                        <svg viewBox="0 0 32 32" className="w-full h-full">
                          <circle cx="16" cy="16" r="16" fill="#ec4899" />
                          <circle cx="16" cy="12" r="6" fill="#fde68a" />
                          <path d="M9 13c0-5 3-7 7-7s7 2 7 7c-2-2-4-2-7-2s-5 0-7 2z" fill="#701a75" />
                          <path d="M8 28c1-6 4-8 8-8s7 2 8 8" fill="#831843" />
                        </svg>
                      ) : msg.authorName === 'Karan' ? (
                        <svg viewBox="0 0 32 32" className="w-full h-full">
                          <circle cx="16" cy="16" r="16" fill="#0d9488" />
                          <circle cx="16" cy="12" r="6" fill="#fed7aa" />
                          <path d="M10 11c0-4 3-6 6-6s6 2 6 6c-2-1-4-1-6-1s-4 0-6 1z" fill="#1c1917" />
                          <path d="M9 28c1-6 4-8 7-8s6 2 7 8" fill="#134e4a" />
                        </svg>
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-[10px] font-bold text-white">
                          {msg.authorName[0]}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-white truncate">{msg.authorName}</span>
                        <span className="text-[10px] text-auditorium-cream/50 font-sans">{time}</span>
                      </div>
                      <p className="text-xs text-auditorium-cream/90 mt-0.5 break-words leading-relaxed">
                        {msg.content}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendChat} className="p-2.5 border-t border-white/10 bg-black/30">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Type a message..."
                  className="w-full bg-black/50 border border-white/15 rounded-xl px-3.5 py-2 pr-9 text-xs text-white placeholder-auditorium-cream/40 focus:outline-none focus:border-auditorium-gold/50 transition-colors"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim()}
                  className="absolute right-2 p-1.5 text-auditorium-gold hover:text-white disabled:opacity-30 transition-colors"
                  aria-label="Send message"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                  </svg>
                </button>
              </div>
            </form>
          </>
        )}
      </motion.div>
    </aside>
  );
}