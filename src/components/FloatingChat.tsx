'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSessionStore } from '@/store/sessionStore';
import { useUIStore } from '@/store/uiStore';
import { GlassCard } from './GlassCard';

export function FloatingChat() {
  const { chatOpen, setChatOpen, rightPanelOpen, activeTab } = useUIStore();
  const { messages, addMessage } = useSessionStore();
  const [inputText, setInputText] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // If the right panel is currently open to the chat tab, don't overlap with floating chat
  const isRightPanelShowingChat = rightPanelOpen && activeTab === 'chat';

  useEffect(() => {
    if (!isMinimized && chatOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isMinimized, chatOpen]);

  if (!chatOpen || isRightPanelShowingChat) {
    return null;
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    addMessage({
      authorId: 'local-player',
      authorName: 'You',
      content: inputText.trim(),
      type: 'message',
    });
    setInputText('');
  };

  return (
    <div className="fixed bottom-24 right-6 z-40">
      <AnimatePresence>
        {isMinimized ? (
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={() => setIsMinimized(false)}
            className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-auditorium-bg/85 backdrop-blur-glass border border-auditorium-gold/30 shadow-gold-glow text-auditorium-cream hover:text-auditorium-gold hover:border-auditorium-gold/50 transition-all group"
          >
            <span className="text-lg">💬</span>
            <span className="text-xs font-medium">Chat ({messages.length})</span>
          </motion.button>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="w-80 md:w-96"
          >
            <GlassCard padding="none" className="border-auditorium-gold/30 shadow-glass overflow-hidden flex flex-col h-96">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-auditorium-gold/20 bg-auditorium-bg/50">
                <div className="flex items-center gap-2">
                  <span className="text-base">💬</span>
                  <span className="font-serif text-sm font-medium text-auditorium-cream">Live Chat</span>
                  <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-auditorium-gold/15 text-auditorium-gold">
                    {messages.length}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setIsMinimized(true)}
                    className="p-1 rounded-lg text-auditorium-cream/50 hover:text-auditorium-cream hover:bg-auditorium-gold/10 text-xs transition-colors"
                    title="Minimize"
                  >
                    ⚊
                  </button>
                  <button
                    onClick={() => setChatOpen(false)}
                    className="p-1 rounded-lg text-auditorium-cream/50 hover:text-auditorium-cream hover:bg-auditorium-gold/10 text-xs transition-colors"
                    title="Close"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Message List */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2.5 text-xs">
                {messages.map((msg) => {
                  const isOwn = msg.authorId === 'local-player';
                  const isSystem = msg.type === 'system';

                  if (isSystem) {
                    return (
                      <div key={msg.id} className="text-center py-1 text-[11px] text-auditorium-gold/70 italic">
                        {msg.content}
                      </div>
                    );
                  }

                  return (
                    <div key={msg.id} className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
                      {!isOwn && (
                        <span className="text-[10px] text-auditorium-gold font-medium mb-0.5 ml-1">
                          {msg.authorName}
                        </span>
                      )}
                      <div
                        className={`max-w-[85%] px-3 py-2 rounded-xl text-xs leading-relaxed ${
                          isOwn
                            ? 'bg-auditorium-gold/20 text-auditorium-cream border border-auditorium-gold/30 rounded-tr-none'
                            : 'bg-auditorium-walnut/60 text-auditorium-cream border border-auditorium-gold/10 rounded-tl-none'
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Form */}
              <form onSubmit={handleSendMessage} className="p-2.5 border-t border-auditorium-gold/15 bg-auditorium-bg/40">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Say something..."
                    className="flex-1 bg-auditorium-bg/60 border border-auditorium-gold/20 rounded-xl px-3 py-1.5 text-xs text-auditorium-cream placeholder-auditorium-cream/40 focus:outline-none focus:border-auditorium-gold/50 transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim()}
                    className="px-3 py-1.5 bg-auditorium-gold/20 hover:bg-auditorium-gold/30 text-auditorium-gold rounded-xl font-medium text-xs disabled:opacity-40 transition-colors"
                  >
                    Send
                  </button>
                </div>
              </form>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
