import { create } from 'zustand';
import { Session, Participant, ChatMessage, GAME_CONFIG, INITIAL_SESSION, PLACEHOLDER_PARTICIPANTS } from '@/types';

interface SessionStore {
  session: Session;
  localParticipant: Participant;
  messages: ChatMessage[];
  raiseHand: () => void;
  lowerHand: () => void;
  toggleHand: () => void;
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  updateElapsedTime: () => void;
  setSpeaking: (participantId: string, isSpeaking: boolean) => void;
}

export const useSessionStore = create<SessionStore>((set, get) => ({
  session: INITIAL_SESSION,
  localParticipant: {
    id: 'local-player',
    name: 'You',
    avatar: { bodyColor: '#722f37', headColor: '#e8d5b7', accentColor: '#c9a84c' },
    isOnline: true,
    isSpeaking: false,
    hasRaisedHand: false,
    joinedAt: Date.now(),
  },
  messages: [
    { id: '1', authorId: 'system', authorName: 'System', content: 'Welcome to Oratoria Auditorium', timestamp: Date.now() - 1200000, type: 'system' },
    { id: '2', authorId: '3', authorName: 'Karan', content: 'Excited for this discussion on AI in education!', timestamp: Date.now() - 900000, type: 'message' },
    { id: '3', authorId: '2', authorName: 'Ananya', content: 'Same here. This is such a relevant topic.', timestamp: Date.now() - 600000, type: 'message' },
  ],
  raiseHand: () =>
    set((state) => ({
      localParticipant: { ...state.localParticipant, hasRaisedHand: true },
      session: {
        ...state.session,
        participants: state.session.participants.map((p) =>
          p.id === state.localParticipant.id ? { ...p, hasRaisedHand: true } : p
        ),
      },
    })),
  lowerHand: () =>
    set((state) => ({
      localParticipant: { ...state.localParticipant, hasRaisedHand: false },
      session: {
        ...state.session,
        participants: state.session.participants.map((p) =>
          p.id === state.localParticipant.id ? { ...p, hasRaisedHand: false } : p
        ),
      },
    })),
  toggleHand: () =>
    set((state) => {
      const newState = !state.localParticipant.hasRaisedHand;
      return {
        localParticipant: { ...state.localParticipant, hasRaisedHand: newState },
        session: {
          ...state.session,
          participants: state.session.participants.map((p) =>
            p.id === state.localParticipant.id ? { ...p, hasRaisedHand: newState } : p
          ),
        },
      };
    }),
  addMessage: (message) =>
    set((state) => ({
      messages: [
        ...state.messages,
        { ...message, id: crypto.randomUUID(), timestamp: Date.now() },
      ],
    })),
  updateElapsedTime: () =>
    set((state) => ({
      session: {
        ...state.session,
        elapsedTime: Date.now() - state.session.startTime,
      },
    })),
  setSpeaking: (participantId, isSpeaking) =>
    set((state) => ({
      session: {
        ...state.session,
        participants: state.session.participants.map((p) =>
          p.id === participantId ? { ...p, isSpeaking } : p
        ),
      },
      localParticipant:
        state.localParticipant.id === participantId
          ? { ...state.localParticipant, isSpeaking }
          : state.localParticipant,
    })),
}));