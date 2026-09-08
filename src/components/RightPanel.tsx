'use client';

import { motion, useState } from 'framer-motion';
import { GlassCard } from './GlassCard';
import { useSessionStore } from '@/store/sessionStore';
import { useUIStore } from '@/store/uiStore';

export function RightPanel() {
  const { rightPanelOpen, setRightPanelOpen, activeTab, setActiveTab } = useUIStore();
  const { session, raiseHand, lowerHand, toggleHand } = useSessionStore();
  const { localParticipant } = useSessionStore();

  if (!rightPanelOpen) return null;

  const participantCount = session.participants.length + 1;
  const elapsedMinutes = Math.floor(session.elapsedTime / 60000);
  const elapsedSeconds = Math.floor((session.elapsedTime % 60000) / 1000);
  const elapsedString = `${elapsedMinutes}:${elapsedSeconds.toString().padStart(2, '0')}`;

  const tabs = [
    { id: 'session', label: 'Session', icon: '🎙️' },
    { id: 'people', label: 'People', icon: '👥' },
    { id: 'chat', label: 'Chat', icon: '💬' },
  ] as const;

  return (
    <motion.aside
      initial={{ x: 320, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 320, opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed right-0 top-0 h-full w-80 md:w-96 z-40 flex flex-col"
      style={{ transformOrigin: 'right center' }}
    >
      <div className="absolute inset-0 bg-black/30" onClick={() => setRightPanelOpen(false)} aria-hidden="true" />

      <div className="relative flex flex-col h-full bg-auditorium-bg/70 backdrop-blur-glass border-l border-auditorium-gold/20">
        <div className="flex items-center justify-between p-4 border-b border-auditorium-gold/20">
          <h2 className="font-serif text-xl text-auditorium-cream font-medium">Live Session</h2>
          <button
            onClick={() => setRightPanelOpen(false)}
            className="p-2 rounded-lg text-auditorium-cream/60 hover:text-auditorium-cream hover:bg-auditorium-gold/10 transition-colors"
            aria-label="Close panel"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="flex border-b border-auditorium-gold/10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-3 text-sm font-medium transition-colors relative ${
                activeTab === tab.id
                  ? 'text-auditorium-gold'
                  : 'text-auditorium-cream/60 hover:text-auditorium-cream/80'
              }`}
            >
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeTab === 'session' && (
            <SessionTab session={session} elapsedString={elapsedString} participantCount={participantCount} localParticipant={localParticipant} onRaiseHand={toggleHand} />
          )}
          {activeTab === 'people' && <PeopleTab />}
          {activeTab === 'chat' && <ChatTab />}
        </div>
      </div>
    </motion.aside>
  );
}

function SessionTab({
  session,
  elapsedString,
  participantCount,
  localParticipant,
  onRaiseHand,
}: {
  session: ReturnType<typeof useSessionStore>['session'];
  elapsedString: string;
  participantCount: number;
  localParticipant: ReturnType<typeof useSessionStore>['localParticipant'];
  onRaiseHand: () => void;
}) {
  return (
    <div className="space-y-4">
      <GlassCard className="border-auditorium-gold/30 shadow-gold-glow" padding="md">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-auditorium-gold uppercase tracking-wider">Open Talk</span>
            <span className="w-px h-4 bg-auditorium-gold/30" />
            <span className="text-auditorium-cream/60 text-sm">Live</span>
          </div>
          <h3 className="font-serif text-lg text-auditorium-cream leading-snug">"{session.topic}"</h3>
          <p className="text-auditorium-cream/50 text-sm">Hosted by {session.host}</p>
        </div>
      </GlassCard>

      <div className="grid grid-cols-2 gap-3">
        <GlassCard padding="sm" className="text-center">
          <div className="text-2xl font-serif text-auditorium-gold font-bold">{participantCount}</div>
          <div className="text-xs text-auditorium-cream/60 uppercase tracking-wider">/{session.maxParticipants}</div>
          <div className="text-xs text-auditorium-cream/50">Participants</div>
        </GlassCard>
        <GlassCard padding="sm" className="text-center">
          <div className="text-2xl font-serif text-auditorium-gold font-bold tabular-nums">{elapsedString}</div>
          <div className="text-xs text-auditorium-cream/50">Elapsed</div>
        </GlassCard>
      </div>

      <GlassCard padding="md" className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-auditorium-cream">Your Status</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            localParticipant.hasRaisedHand
              ? 'bg-auditorium-gold/20 text-auditorium-gold'
              : 'bg-auditorium-burgundy/30 text-auditorium-cream/60'
          }`}>
            {localParticipant.hasRaisedHand ? 'Hand Raised' : 'Listening'}
          </span>
        </div>
        <button
          onClick={onRaiseHand}
          className={`w-full py-3 rounded-xl font-medium text-sm transition-all ${
            localParticipant.hasRaisedHand
              ? 'bg-auditorium-burgundy text-auditorium-cream hover:bg-auditorium-burgundyLight'
              : 'bg-gradient-to-r from-auditorium-gold to-auditorium-amber text-auditorium-bg font-semibold hover:shadow-gold-glow-lg'
          }`}
        >
          {localParticipant.hasRaisedHand ? 'Lower Hand' : 'Raise Hand'}
        </button>
      </GlassCard>

      <GlassCard padding="md">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-auditorium-cream">Quick Actions</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <QuickActionButton icon="🎤" label="Request to Speak" />
          <QuickActionButton icon="📝" label="Take Notes" />
          <QuickActionButton icon="❓" label="Ask Question" />
          <QuickActionButton icon="👏" label="Applaud" />
        </div>
      </GlassCard>
    </div>
  );
}

function QuickActionButton({ icon, label }: { icon: string; label: string }) {
  return (
    <button className="flex flex-col items-center gap-2 p-3 rounded-xl bg-auditorium-bg/50 border border-auditorium-gold/10 hover:border-auditorium-gold/30 hover:bg-auditorium-gold/5 transition-all text-auditorium-cream/80">
      <span className="text-xl">{icon}</span>
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
}

function PeopleTab() {
  const { peoplePanelOpen, setPeoplePanelOpen } = useUIStore();
  const { participants } = useSessionStore();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-auditorium-cream">Participants</h4>
        <button
          onClick={() => setPeoplePanelOpen(true)}
          className="text-xs text-auditorium-gold hover:text-auditorium-goldLight transition-colors"
        >
          View all →
        </button>
      </div>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {participants.slice(0, 8).map((p) => (
          <ParticipantRow key={p.id} participant={p} isLocal={false} />
        ))}
      </div>
    </div>
  );
}

function ParticipantRow({ participant, isLocal }: { participant: ReturnType<typeof useSessionStore>['session']['participants'][0]; isLocal: boolean }) {
  return (
    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-auditorium-gold/5 transition-colors">
      <div className="relative">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-auditorium-burgundy to-auditorium-walnut flex items-center justify-center text-xs font-serif text-auditorium-cream">
          {participant.name[0]}
        </div>
        <span className={`absolute bottom-0 right-0 w-2 h-2 rounded-full border-2 border-auditorium-bg ${participant.isOnline ? 'bg-green-500' : 'bg-gray-500'}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-auditorium-cream truncate">{participant.name} {isLocal && '(You)'}</p>
        <p className="text-xs text-auditorium-cream/50">{participant.isSpeaking ? '🎤 Speaking' : 'Listening'}</p>
      </div>
      {participant.hasRaisedHand && (
        <span className="text-auditorium-gold text-lg">✋</span>
      )}
    </div>
  );
}

function ChatTab() {
  const { chatOpen, setChatOpen } = useUIStore();
  const { messages, addMessage } = useSessionStore();
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    addMessage({ authorId: 'local-player', authorName: 'You', content: input.trim(), type: 'message' });
    setInput('');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-3 pb-4">
        {messages.slice(-20).map((msg) => (
          <ChatMessage key={msg.id} message={msg} isOwn={msg.authorId === 'local-player'} />
        ))}
      </div>
      <form onSubmit={handleSubmit} className="border-t border-auditorium-gold/10 p-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-auditorium-bg/50 border border-auditorium-gold/20 rounded-xl px-4 py-2 text-auditorium-cream placeholder-auditorium-cream/40 focus:outline-none focus:border-auditorium-gold/50 transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="px-4 py-2 bg-auditorium-gold/20 text-auditorium-gold rounded-xl font-medium hover:bg-auditorium-gold/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}

function ChatMessage({ message, isOwn }: { message: ReturnType<typeof useSessionStore>['messages'][0]; isOwn: boolean }) {
  const time = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (message.type === 'system') {
    return (
      <div className="text-center text-xs text-auditorium-cream/40 py-2">
        {message.content}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`max-w-[70%] ${isOwn ? 'text-right' : 'text-left'}`}>
        {!isOwn && (
          <p className="text-xs text-auditorium-gold/80 mb-1">{message.authorName}</p>
        )}
        <div
          className={`inline-block px-4 py-2 rounded-2xl text-sm ${
            isOwn
              ? 'bg-auditorium-gold/20 text-auditorium-bg rounded-tr-none'
              : 'bg-auditorium-walnut/50 text-auditorium-cream rounded-tl-none'
          }`}
        >
          {message.content}
        </div>
        <p className={`text-xs mt-1 ${isOwn ? 'text-auditorium-cream/40' : 'text-auditorium-cream/30'}`}>{time}</p>
      </div>
    </motion.div>
  );
}