import { create } from 'zustand';
import { Player, Vector2, AvatarStyle, GAME_CONFIG, DEFAULT_AVATAR } from '@/types';

interface PlayerState {
  player: Player;
  setPosition: (position: Vector2) => void;
  setVelocity: (velocity: Vector2) => void;
  setDirection: (direction: Player['direction']) => void;
  setMoving: (isMoving: boolean) => void;
  moveTo: (target: Vector2) => void;
}

const initialPosition: Vector2 = {
  x: GAME_CONFIG.worldWidth / 2,
  y: 980,
};

export const usePlayerStore = create<PlayerState>((set) => ({
  player: {
    id: 'local-player',
    name: 'You',
    position: initialPosition,
    velocity: { x: 0, y: 0 },
    isMoving: false,
    direction: 'idle',
    avatar: DEFAULT_AVATAR,
  },
  setPosition: (position) =>
    set((state) => ({
      player: { ...state.player, position },
    })),
  setVelocity: (velocity) =>
    set((state) => ({
      player: { ...state.player, velocity },
    })),
  setDirection: (direction) =>
    set((state) => ({
      player: { ...state.player, direction },
    })),
  setMoving: (isMoving) =>
    set((state) => ({
      player: { ...state.player, isMoving },
    })),
  moveTo: (target) =>
    set((state) => ({
      player: {
        ...state.player,
        position: target,
      },
    })),
}));