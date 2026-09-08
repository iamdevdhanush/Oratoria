import { create } from 'zustand';
import { CameraState, Vector2, GAME_CONFIG } from '@/types';

interface CameraStore extends CameraState {
  setTargetPosition: (position: Vector2) => void;
  updatePosition: () => void;
  setZoom: (zoom: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
}

const initialPosition: Vector2 = {
  x: GAME_CONFIG.worldWidth / 2,
  y: GAME_CONFIG.worldHeight / 2,
};

export const useCameraStore = create<CameraStore>((set, get) => ({
  position: initialPosition,
  zoom: 1,
  targetPosition: initialPosition,
  lerpFactor: GAME_CONFIG.cameraLerp,
  setTargetPosition: (targetPosition) => set({ targetPosition }),
  updatePosition: () => {
    const { position, targetPosition, lerpFactor } = get();
    const newPosition: Vector2 = {
      x: position.x + (targetPosition.x - position.x) * lerpFactor,
      y: position.y + (targetPosition.y - position.y) * lerpFactor,
    };
    set({ position: newPosition });
  },
  setZoom: (zoom) =>
    set((state) => ({
      zoom: Math.max(GAME_CONFIG.minZoom, Math.min(GAME_CONFIG.maxZoom, zoom)),
    })),
  zoomIn: () =>
    set((state) => ({
      zoom: Math.min(GAME_CONFIG.maxZoom, state.zoom + 0.05),
    })),
  zoomOut: () =>
    set((state) => ({
      zoom: Math.max(GAME_CONFIG.minZoom, state.zoom - 0.05),
    })),
}));