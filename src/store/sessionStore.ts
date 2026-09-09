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
    { id: '1', authorId: '1', authorName: 'Aarav', content: 'Excited for this session!', timestamp: Date.now() - 120000, timeStr: '10:24 AM', type: 'message' },
    { id: '2', authorId: '2', authorName: 'Ananya', content: 'Such a relevant topic.', timestamp: Date.now() - 60000, timeStr: '10:25 AM', type: 'message' },
    { id: '3', authorId: '3', authorName: 'Karan', content: 'Looking forward to the discussion!', timestamp: Date.now() - 10000, timeStr: '10:26 AM', type: 'message' },
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