import { create } from 'zustand';
import { UIState, Notification, ControlsState } from '@/types';

interface UIStore extends UIState, ControlsState {
  toggleRightPanel: () => void;
  setRightPanelOpen: (open: boolean) => void;
  togglePeoplePanel: () => void;
  setPeoplePanelOpen: (open: boolean) => void;
  toggleChat: () => void;
  setChatOpen: (open: boolean) => void;
  setActiveTab: (tab: UIState['activeTab']) => void;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  toggleMic: () => void;
  toggleCamera: () => void;
  toggleReactions: () => void;
  setMicEnabled: (enabled: boolean) => void;
  setCameraEnabled: (enabled: boolean) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  rightPanelOpen: true,
  peoplePanelOpen: false,
  chatOpen: true,
  activeTab: 'session',
  notifications: [],
  micEnabled: true,
  cameraEnabled: false,
  reactionsOpen: false,
  toggleRightPanel: () => set((state) => ({ rightPanelOpen: !state.rightPanelOpen })),
  setRightPanelOpen: (open) => set({ rightPanelOpen: open }),
  togglePeoplePanel: () => set((state) => ({ peoplePanelOpen: !state.peoplePanelOpen })),
  setPeoplePanelOpen: (open) => set({ peoplePanelOpen: open }),
  toggleChat: () => set((state) => ({ chatOpen: !state.chatOpen })),
  setChatOpen: (open) => set({ chatOpen: open }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        ...state.notifications,
        { ...notification, id: crypto.randomUUID() },
      ],
    })),
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
  toggleMic: () => set((state) => ({ micEnabled: !state.micEnabled })),
  toggleCamera: () => set((state) => ({ cameraEnabled: !state.cameraEnabled })),
  toggleReactions: () => set((state) => ({ reactionsOpen: !state.reactionsOpen })),
  setMicEnabled: (enabled) => set({ micEnabled: enabled }),
  setCameraEnabled: (enabled) => set({ cameraEnabled: enabled }),
}));