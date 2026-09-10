import * as Phaser from 'phaser';
import { GAME_CONFIG, Vector2, Player } from '@/types';
import { usePlayerStore } from '@/store/playerStore';
import { useCameraStore } from '@/store/cameraStore';
import { useUIStore } from '@/store/uiStore';

interface Seat {
  id: string;
  x: number;
  y: number;
  aisleX: number;
}

// Seat positions along the left and right aisle edges and front row
const ACCESSIBLE_SEATS: Seat[] = [
  // Left aisle row heads
  { id: 'L-row1', x: 1215, y: 1040, aisleX: 1245 },
  { id: 'L-row2', x: 1215, y: 1095, aisleX: 1245 },
  { id: 'L-row3', x: 1215, y: 1150, aisleX: 1245 },
  { id: 'L-row4', x: 1215, y: 1205, aisleX: 1245 },
  { id: 'L-row5', x: 1215, y: 1260, aisleX: 1245 },
  // Right aisle row heads
  { id: 'R-row1', x: 1473, y: 1040, aisleX: 1443 },
  { id: 'R-row2', x: 1473, y: 1095, aisleX: 1443 },
  { id: 'R-row3', x: 1473, y: 1150, aisleX: 1443 },
  { id: 'R-row4', x: 1473, y: 1205, aisleX: 1443 },
  { id: 'R-row5', x: 1473, y: 1260, aisleX: 1443 },
  // Front row seats accessible from front stage floor
  { id: 'F-L1', x: 1145, y: 990, aisleX: 1145 },
  { id: 'F-L2', x: 1080, y: 990, aisleX: 1080 },
  { id: 'F-R1', x: 1545, y: 990, aisleX: 1545 },
  { id: 'F-R2', x: 1605, y: 990, aisleX: 1605 },
];

// Walkable rectangles
const WALKABLE_RECTS = [
  // Center red carpet aisle
  { x: 1210, y: 955, width: 268, height: 330 },
  // Front stage floor
  { x: 420, y: 940, width: 1848, height: 55 },
  // Bottom entrance
  { x: 1140, y: 1240, width: 408, height: 48 },
  // Left side walking strip
  { x: 420, y: 940, width: 135, height: 345 },
  // Right side walking strip
  { x: 2133, y: 940, width: 135, height: 345 },
  // Stage center stairs to podium
  { x: 1270, y: 720, width: 148, height: 235 },
  // Small space around podium
  { x: 1260, y: 705, width: 168, height: 55 },
];

// Invisible collision rectangles for blocked areas (seating blocks, walls, railings)
const BLOCKED_RECTS = [
  // Entire left seating block
  { x: 555, y: 995, width: 660, height: 285 },
  // Entire right seating block
  { x: 1473, y: 995, width: 660, height: 285 },
  // Left wall
  { x: 0, y: 0, width: 420, height: 1536 },
  // Right wall
  { x: 2268, y: 0, width: 420, height: 1536 },
  // Bottom left railing / balustrade
  { x: 420, y: 1285, width: 720, height: 251 },
  // Bottom right railing / balustrade
  { x: 1548, y: 1285, width: 720, height: 251 },
  // Stage left wing
  { x: 420, y: 700, width: 850, height: 240 },
  // Stage right wing
  { x: 1418, y: 700, width: 850, height: 240 },
  // Stage curtains / backstage
  { x: 0, y: 0, width: 2688, height: 705 },
  // Podium furniture itself (can't stand inside podium)
  { x: 1320, y: 670, width: 48, height: 45 },
];

type ActiveZoneType = 'podium' | 'seat' | 'exit' | null;

export class AuditoriumScene extends Phaser.Scene {
  private background!: Phaser.GameObjects.Image;
  private playerGraphics!: Phaser.GameObjects.Graphics;
  private playerShadow!: Phaser.GameObjects.Graphics;
  private playerNameplate!: Phaser.GameObjects.Container;
  private seatHighlightGraphics!: Phaser.GameObjects.Graphics;
  private promptContainer!: Phaser.GameObjects.Container;
  private promptBg!: Phaser.GameObjects.Graphics;
  private promptTxt!: Phaser.GameObjects.Text;

  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasdKeys!: { W: Phaser.Input.Keyboard.Key; A: Phaser.Input.Keyboard.Key; S: Phaser.Input.Keyboard.Key; D: Phaser.Input.Keyboard.Key };
  private eKey!: Phaser.Input.Keyboard.Key;

  private targetPosition: Vector2 | null = null;
  private isClickMoving = false;

  // Seat interaction & edge detection state
  private wasInsideSeat = false;
  private isSeated = false;
  private currentSeat: Seat | null = null;
  private nearestSeat: Seat | null = null;

  // Prompt priority state
  private activeZone: ActiveZoneType = null;

  constructor() {
    super({ key: 'AuditoriumScene' });
  }

  preload() {
    this.load.image('auditorium-bg', '/bg.svg');
  }

  create() {
    this.setupBackground();
    this.setupSeatHighlight();
    this.setupPlayer();
    this.setupPrompt();
    this.setupInput();
    this.setupCamera();
    this.setupClickToMove();
    this.events.emit('scene-ready');
  }

  private setupBackground() {
    const { worldWidth, worldHeight } = GAME_CONFIG;
    this.background = this.add.image(worldWidth / 2, worldHeight / 2, 'auditorium-bg');
    this.background.setDisplaySize(worldWidth, worldHeight);
    this.background.setDepth(0);
  }

  private setupSeatHighlight() {
    this.seatHighlightGraphics = this.add.graphics();
    this.seatHighlightGraphics.setDepth(5);
  }

  private setupPlayer() {
    const { player } = usePlayerStore.getState();
    this.playerShadow = this.add.graphics();
    this.playerShadow.setDepth(10);
    this.playerGraphics = this.add.graphics();
    this.playerGraphics.setDepth(11);

    // Floating 'You' badge container (+20% scale: nameplate positioned at y - 62)
    this.playerNameplate = this.add.container(player.position.x, player.position.y - 62);
    this.playerNameplate.setDepth(15);

    const bgG = this.add.graphics();
    bgG.fillStyle(0x0b0a09, 0.85);
    bgG.fillRoundedRect(-24, -10, 48, 20, 10);
    bgG.lineStyle(1, 0xc9a84c, 0.4);
    bgG.strokeRoundedRect(-24, -10, 48, 20, 10);

    const dot = this.add.circle(-11, 0, 3.5, 0x22c55e);
    const txt = this.add.text(-3, 0, 'You', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '11px',
      color: '#ffffff',
      fontStyle: 'bold',
    });
    txt.setOrigin(0, 0.5);

    this.playerNameplate.add([bgG, dot, txt]);

    this.drawPlayer(player.position);
    this.drawShadow(player.position);
  }

  // Avatar scale increased by 1.2x with feet touching the floor and soft shadow
  private drawPlayer(position: Vector2) {
    const g = this.playerGraphics;
    g.clear();
    g.setPosition(position.x, position.y);

    if (this.isSeated) {
      // Sitting pose (tucked legs, relaxed posture)
      g.fillStyle(0x231c19, 1);
      g.fillRoundedRect(-8, 8, 7, 12, 2);
      g.fillRoundedRect(1, 8, 7, 12, 2);

      // Body / Coat
      g.fillStyle(0x563e2e, 1);
      g.fillRoundedRect(-16, -10, 32, 22, 6);
      g.lineStyle(1.5, 0x2b1d16, 1);
      g.strokeRoundedRect(-16, -10, 32, 22, 6);

      // Arms on lap
      g.fillStyle(0x4a3426, 1);
      g.fillRoundedRect(-19, -6, 6, 14, 3);
      g.fillRoundedRect(13, -6, 6, 14, 3);

      // Head
      g.fillStyle(0x2d1f18, 1);
      g.fillCircle(0, -16, 14);
      g.fillStyle(0x201815, 1);
      g.fillCircle(0, -19, 15);
      g.fillCircle(-5, -17, 13);
      g.fillCircle(5, -17, 13);
      g.fillStyle(0x352822, 0.6);
      g.fillCircle(0, -22, 10);
    } else {
      // Standing pose (+20% larger: scale ~1.2)
      // Boots / Legs (feet touch floor at y = 29)
      g.fillStyle(0x231c19, 1);
      g.fillRoundedRect(-9, 14, 7, 15, 2);
      g.fillRoundedRect(2, 14, 7, 15, 2);

      // Brown Trench Coat / Body
      g.fillStyle(0x563e2e, 1);
      g.fillRoundedRect(-16, -12, 32, 30, 6);

      // Coat details & Collar (back angle)
      g.fillStyle(0x3e2c20, 1);
      g.fillTriangle(-11, -12, 0, -4, -6, 8);
      g.fillTriangle(11, -12, 0, -4, 6, 8);
      g.lineStyle(1.5, 0x2b1d16, 1);
      g.strokeRoundedRect(-16, -12, 32, 30, 6);

      // Arms
      g.fillStyle(0x4a3426, 1);
      g.fillRoundedRect(-21, -8, 7, 18, 3);
      g.fillRoundedRect(14, -8, 7, 18, 3);

      // Neck / Head base
      g.fillStyle(0x2d1f18, 1);
      g.fillCircle(0, -18, 15);

      // Dark Layered Hair (back/isometric view)
      g.fillStyle(0x201815, 1);
      g.fillCircle(0, -21, 16);
      g.fillCircle(-6, -19, 14);
      g.fillCircle(6, -19, 14);
      g.fillStyle(0x352822, 0.6);
      g.fillCircle(0, -24, 11);
    }

    if (this.playerNameplate) {
      this.playerNameplate.setPosition(position.x, position.y - (this.isSeated ? 54 : 62));
    }
  }

  // Soft dual-layer ambient occlusion shadow under feet
  private drawShadow(position: Vector2) {
    const g = this.playerShadow;
    g.clear();
    g.setPosition(position.x, position.y);
    // Outer soft fade
    g.fillStyle(0x000000, 0.12);
    g.fillEllipse(0, this.isSeated ? 20 : 29, 52, 16);
    // Inner contact shadow
    g.fillStyle(0x000000, 0.28);
    g.fillEllipse(0, this.isSeated ? 20 : 29, 40, 12);
  }

  // Exactly ONE interaction prompt container for the entire scene
  private setupPrompt() {
    this.promptContainer = this.add.container(1344, 595);
    this.promptContainer.setDepth(25);
    this.promptContainer.setAlpha(0);
    this.promptContainer.setVisible(false);

    this.promptBg = this.add.graphics();
    this.promptBg.fillStyle(0x120e0b, 0.92);
    this.promptBg.fillRoundedRect(-90, -17, 180, 34, 17);
    this.promptBg.lineStyle(1.5, 0xc9a84c, 0.85);
    this.promptBg.strokeRoundedRect(-90, -17, 180, 34, 17);

    this.promptTxt = this.add.text(0, 0, '🎙️  Press E to Speak', {
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontSize: '12px',
      color: '#f5e6cc',
      fontStyle: 'bold',
      align: 'center',
    });
    this.promptTxt.setOrigin(0.5, 0.5);

    this.promptContainer.add([this.promptBg, this.promptTxt]);

    // Subtle breathing float animation
    this.tweens.add({
      targets: this.promptContainer,
      y: '-=5',
      duration: 1600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  private setupInput() {
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasdKeys = {
      W: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      A: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      S: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      D: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };
    this.eKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.E);
  }

  // Locked camera: centered on auditorium center, no panning
  private setupCamera() {
    this.cameras.main.setBounds(0, 0, GAME_CONFIG.worldWidth, GAME_CONFIG.worldHeight);
    const optimalZoom = this.calculateOptimalZoom();
    this.cameras.main.setZoom(optimalZoom);
    useCameraStore.getState().setZoom(optimalZoom);
    this.cameras.main.centerOn(GAME_CONFIG.worldWidth / 2, GAME_CONFIG.worldHeight / 2);
  }

  private calculateOptimalZoom(): number {
    const h = this.cameras.main.height || (typeof window !== 'undefined' ? window.innerHeight : 1080);
    const zoom = h / GAME_CONFIG.worldHeight;
    return Math.max(GAME_CONFIG.minZoom, Math.min(GAME_CONFIG.maxZoom, zoom));
  }

  private setupClickToMove() {
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (pointer.rightButtonDown()) return;
      const target = pointer.event?.target as HTMLElement | null;
      if (target && target.id !== 'game-canvas') return;
      const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);

      // Only allow click moving if target is in a walkable area
      if (this.isWalkable(worldPoint.x, worldPoint.y)) {
        if (this.isSeated) {
          this.standUp();
        }
        this.targetPosition = { x: worldPoint.x, y: worldPoint.y };
        this.isClickMoving = true;
      }
    });
  }

  // Collision map logic: inside a walkable rect AND not in any blocked rect
  private isWalkable(x: number, y: number): boolean {
    for (const block of BLOCKED_RECTS) {
      if (
        x >= block.x &&
        x <= block.x + block.width &&
        y >= block.y &&
        y <= block.y + block.height
      ) {
        return false;
      }
    }
    for (const walk of WALKABLE_RECTS) {
      if (
        x >= walk.x &&
        x <= walk.x + walk.width &&
        y >= walk.y &&
        y <= walk.y + walk.height
      ) {
        return true;
      }
    }
    return false;
  }

  private handleMovement(): Vector2 | null {
    const activeEl = typeof document !== 'undefined' ? document.activeElement : null;
    const isTyping = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA');
    if (isTyping) {
      usePlayerStore.getState().setVelocity({ x: 0, y: 0 });
      usePlayerStore.getState().setDirection('idle');
      usePlayerStore.getState().setMoving(false);
      return null;
    }

    const { player } = usePlayerStore.getState();
    const speed = GAME_CONFIG.playerSpeed;
    let velocityX = 0;
    let velocityY = 0;
    let direction: Player['direction'] = 'idle';
    let isMoving = false;

    const up = this.cursors.up?.isDown || this.wasdKeys.W?.isDown;
    const down = this.cursors.down?.isDown || this.wasdKeys.S?.isDown;
    const left = this.cursors.left?.isDown || this.wasdKeys.A?.isDown;
    const right = this.cursors.right?.isDown || this.wasdKeys.D?.isDown;

    if (up) {
      velocityY = -speed;
      direction = 'up';
      isMoving = true;
    }
    if (down) {
      velocityY = speed;
      direction = 'down';
      isMoving = true;
    }
    if (left) {
      velocityX = -speed;
      direction = 'left';
      isMoving = true;
    }
    if (right) {
      velocityX = speed;
      direction = 'right';
      isMoving = true;
    }

    // Walking automatically stands up if seated
    if (this.isSeated && isMoving) {
      this.standUp();
    }

    if (this.isClickMoving && this.targetPosition) {
      const dx = this.targetPosition.x - player.position.x;
      const dy = this.targetPosition.y - player.position.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 5) {
        velocityX = (dx / dist) * speed;
        velocityY = (dy / dist) * speed;
        isMoving = true;
        if (Math.abs(dx) > Math.abs(dy)) {
          direction = dx > 0 ? 'right' : 'left';
        } else {
          direction = dy > 0 ? 'down' : 'up';
        }
      } else {
        this.isClickMoving = false;
        this.targetPosition = null;
      }
    }

    if (isMoving && !this.isSeated) {
      const stepX = velocityX * (1 / 60);
      const stepY = velocityY * (1 / 60);
      let newX = player.position.x;
      let newY = player.position.y;

      // Axis-separated sliding collision detection
      const proposedX = player.position.x + stepX;
      const proposedY = player.position.y + stepY;

      if (this.isWalkable(proposedX, proposedY)) {
        newX = proposedX;
        newY = proposedY;
      } else if (this.isWalkable(proposedX, player.position.y)) {
        newX = proposedX;
      } else if (this.isWalkable(player.position.x, proposedY)) {
        newY = proposedY;
      } else {
        // Obstructed in both directions
        this.isClickMoving = false;
        this.targetPosition = null;
      }

      usePlayerStore.getState().setPosition({ x: newX, y: newY });
      usePlayerStore.getState().setVelocity({ x: velocityX, y: velocityY });
      usePlayerStore.getState().setDirection(direction);
      usePlayerStore.getState().setMoving(true);

      return { x: newX, y: newY };
    } else {
      usePlayerStore.getState().setVelocity({ x: 0, y: 0 });
      usePlayerStore.getState().setDirection('idle');
      usePlayerStore.getState().setMoving(false);
    }

    return null;
  }

  // Priority check for interaction prompts: 1. Podium, 2. Seat, 3. Exit
  private checkInteractionZones(position: Vector2) {
    const isPodium = position.x >= 1260 && position.x <= 1428 && position.y >= 705 && position.y <= 770;

    // Find nearest accessible seat within interaction distance (65px)
    let closestSeat: Seat | null = null;
    let minSeatDist = Infinity;
    for (const seat of ACCESSIBLE_SEATS) {
      const dist = Phaser.Math.Distance.Between(position.x, position.y, seat.x, seat.y);
      if (dist < minSeatDist) {
        minSeatDist = dist;
        closestSeat = seat;
      }
    }
    const isInsideSeatZone = minSeatDist <= 65;
    this.nearestSeat = isInsideSeatZone ? closestSeat : null;

    // Edge detection for seating area: fire ONLY ONCE upon entering
    if (!this.wasInsideSeat && isInsideSeatZone) {
      useUIStore.getState().addNotification({
        message: 'Seating area: Press E to Sit',
        type: 'info',
        duration: 2500,
      });
    }
    this.wasInsideSeat = isInsideSeatZone;

    // Highlight nearest seat
    this.updateSeatHighlight(this.nearestSeat);

    const isExit = position.x >= 1180 && position.x <= 1508 && position.y >= 1240 && position.y <= 1285;

    // Priority Resolution
    let nextZone: ActiveZoneType = null;
    let promptX = 1344;
    let promptY = 595;
    let promptText = '';

    if (isPodium) {
      nextZone = 'podium';
      promptX = 1344;
      promptY = 595;
      promptText = '🎙️  Press E to Speak';
    } else if (isInsideSeatZone && this.nearestSeat) {
      nextZone = 'seat';
      promptX = this.nearestSeat.x;
      promptY = this.nearestSeat.y - 42;
      promptText = this.isSeated ? '🛋️  Press E to Stand' : '🛋️  Press E to Sit';
    } else if (isExit) {
      nextZone = 'exit';
      promptX = 1344;
      promptY = 1220;
      promptText = '🚪  Press E to Exit';
    }

    // Update single prompt container
    if (nextZone) {
      this.activeZone = nextZone;
      this.promptContainer.setPosition(promptX, promptY);
      this.promptTxt.setText(promptText);

      if (!this.promptContainer.visible) {
        this.promptContainer.setVisible(true);
        this.tweens.add({
          targets: this.promptContainer,
          alpha: 1,
          duration: 200,
          ease: 'Power2',
        });
      }
    } else if (this.activeZone !== null) {
      this.activeZone = null;
      this.tweens.add({
        targets: this.promptContainer,
        alpha: 0,
        duration: 180,
        ease: 'Power2',
        onComplete: () => {
          this.promptContainer.setVisible(false);
        },
      });
    }

    // Key E interaction
    if (Phaser.Input.Keyboard.JustDown(this.eKey)) {
      this.handleKeyPress();
    }
  }

  private updateSeatHighlight(seat: Seat | null) {
    const g = this.seatHighlightGraphics;
    g.clear();
    if (!seat) return;

    // Gentle pulsing highlight around targeted seat
    g.lineStyle(2, 0xc9a84c, 0.85);
    g.fillStyle(0xc9a84c, 0.18);
    g.fillRoundedRect(seat.x - 18, seat.y - 14, 36, 28, 6);
    g.strokeRoundedRect(seat.x - 18, seat.y - 14, 36, 28, 6);
  }

  private sitDown(seat: Seat) {
    this.isSeated = true;
    this.currentSeat = seat;
    usePlayerStore.getState().setPosition({ x: seat.x, y: seat.y });
    this.drawPlayer({ x: seat.x, y: seat.y });
    this.drawShadow({ x: seat.x, y: seat.y });

    useUIStore.getState().addNotification({
      message: 'You took a seat in the auditorium.',
      type: 'success',
      duration: 2500,
    });
  }

  private standUp() {
    if (!this.isSeated) return;
    this.isSeated = false;
    const returnX = this.currentSeat ? this.currentSeat.aisleX : usePlayerStore.getState().player.position.x;
    const currentY = usePlayerStore.getState().player.position.y;
    this.currentSeat = null;

    usePlayerStore.getState().setPosition({ x: returnX, y: currentY });
    this.drawPlayer({ x: returnX, y: currentY });
    this.drawShadow({ x: returnX, y: currentY });

    useUIStore.getState().addNotification({
      message: 'You stood up.',
      type: 'info',
      duration: 2500,
    });
  }

  private handleKeyPress() {
    if (this.activeZone === 'seat' && this.nearestSeat) {
      if (this.isSeated) {
        this.standUp();
      } else {
        this.sitDown(this.nearestSeat);
      }
    } else if (this.activeZone === 'podium') {
      useUIStore.getState().addNotification({
        message: 'You approached the podium. Ready to present.',
        type: 'info',
        duration: 2500,
      });
    } else if (this.activeZone === 'exit') {
      useUIStore.getState().addNotification({
        message: 'You are at the main hall entrance.',
        type: 'info',
        duration: 2500,
      });
    }
  }

  update() {
    const newPosition = this.handleMovement();
    const currentPosition = newPosition || usePlayerStore.getState().player.position;

    if (newPosition) {
      this.drawPlayer(newPosition);
      this.drawShadow(newPosition);
    }

    // Camera is permanently fixed on auditorium center. Do not pan or zoom.
    this.checkInteractionZones(currentPosition);
  }
}

export const createGameConfig = (canvas: HTMLCanvasElement): Phaser.Types.Core.GameConfig => ({
  type: Phaser.WEBGL,
  canvas,
  transparent: true,
  backgroundColor: '#00000000',
  width: typeof window !== 'undefined' ? window.innerWidth : 1920,
  height: typeof window !== 'undefined' ? window.innerHeight : 1080,
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'arcade',
    arcade: { debug: false },
  },
  scene: [AuditoriumScene],
  render: {
    antialias: true,
    pixelArt: false,
    roundPixels: false,
  },
});