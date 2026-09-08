export interface Vector2 {
  x: number;
  y: number;
}

export interface Player {
  id: string;
  name: string;
  position: Vector2;
  velocity: Vector2;
  isMoving: boolean;
  direction: 'up' | 'down' | 'left' | 'right' | 'idle';
  avatar: AvatarStyle;
}

export interface AvatarStyle {
  bodyColor: string;
  headColor: string;
  accentColor: string;
}

export interface CameraState {
  position: Vector2;
  zoom: number;
  targetPosition: Vector2;
  lerpFactor: number;
}

export interface InteractionZone {
  id: string;
  name: string;
  type: ZoneType;
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  prompt: string;
  actionKey: string;
}

export type ZoneType = 'stage' | 'podium' | 'seating' | 'entrance';

export interface Session {
  id: string;
  title: string;
  topic: string;
  host: string;
  participants: Participant[];
  maxParticipants: number;
  startTime: number;
  elapsedTime: number;
  isLive: boolean;
}

export interface Participant {
  id: string;
  name: string;
  avatar: AvatarStyle;
  isOnline: boolean;
  isSpeaking: boolean;
  hasRaisedHand: boolean;
  joinedAt: number;
}

export interface ChatMessage {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  timestamp: number;
  type: 'message' | 'system' | 'reaction';
}

export interface UIState {
  rightPanelOpen: boolean;
  peoplePanelOpen: boolean;
  chatOpen: boolean;
  activeTab: 'session' | 'people' | 'chat';
  notifications: Notification[];
}

export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  duration: number;
}

export interface ControlsState {
  micEnabled: boolean;
  cameraEnabled: boolean;
  reactionsOpen: boolean;
}

export interface GameConfig {
  worldWidth: number;
  worldHeight: number;
  minZoom: number;
  maxZoom: number;
  playerSpeed: number;
  cameraLerp: number;
}

export const GAME_CONFIG: GameConfig = {
  worldWidth: 2688,
  worldHeight: 1536,
  minZoom: 0.9,
  maxZoom: 1.2,
  playerSpeed: 200,
  cameraLerp: 0.1,
};

export const INTERACTION_ZONES: InteractionZone[] = [
  {
    id: 'stage',
    name: 'Stage',
    type: 'stage',
    bounds: { x: 800, y: 100, width: 1000, height: 400 },
    prompt: 'Press E to Speak',
    actionKey: 'E',
  },
  {
    id: 'podium',
    name: 'Podium',
    type: 'podium',
    bounds: { x: 1200, y: 350, width: 200, height: 150 },
    prompt: 'Press E to Present',
    actionKey: 'E',
  },
  {
    id: 'seating',
    name: 'Seating Area',
    type: 'seating',
    bounds: { x: 600, y: 600, width: 1500, height: 800 },
    prompt: 'Press E to Take a Seat',
    actionKey: 'E',
  },
  {
    id: 'entrance',
    name: 'Entrance',
    type: 'entrance',
    bounds: { x: 1100, y: 1300, width: 400, height: 200 },
    prompt: 'Press E to Exit',
    actionKey: 'E',
  },
];

export const DEFAULT_AVATAR: AvatarStyle = {
  bodyColor: '#722f37',
  headColor: '#e8d5b7',
  accentColor: '#c9a84c',
};

export const PLACEHOLDER_PARTICIPANTS: Participant[] = [
  { id: '1', name: 'Aarav', avatar: { bodyColor: '#722f37', headColor: '#e8d5b7', accentColor: '#c9a84c' }, isOnline: true, isSpeaking: false, hasRaisedHand: false, joinedAt: Date.now() - 3600000 },
  { id: '2', name: 'Ananya', avatar: { bodyColor: '#3d2914', headColor: '#f5e6cc', accentColor: '#c9a84c' }, isOnline: true, isSpeaking: false, hasRaisedHand: true, joinedAt: Date.now() - 1800000 },
  { id: '3', name: 'Karan', avatar: { bodyColor: '#8b3a45', headColor: '#e8d5b7', accentColor: '#e8c56d' }, isOnline: true, isSpeaking: true, hasRaisedHand: false, joinedAt: Date.now() - 900000 },
  { id: '4', name: 'Meera', avatar: { bodyColor: '#5d4037', headColor: '#f5e6cc', accentColor: '#d4a843' }, isOnline: true, isSpeaking: false, hasRaisedHand: false, joinedAt: Date.now() - 600000 },
];

export const INITIAL_SESSION: Session = {
  id: 'session-1',
  title: 'Live Session',
  topic: 'The Role of AI in Education',
  host: 'Prof. Anderson',
  participants: PLACEHOLDER_PARTICIPANTS,
  maxParticipants: 50,
  startTime: Date.now() - 1200000,
  elapsedTime: 1200000,
  isLive: true,
};