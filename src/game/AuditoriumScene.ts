import * as Phaser from 'phaser';
import { GAME_CONFIG, INTERACTION_ZONES, InteractionZone, Vector2, Player } from '@/types';
import { usePlayerStore } from '@/store/playerStore';
import { useCameraStore } from '@/store/cameraStore';
import { useUIStore } from '@/store/uiStore';

export class AuditoriumScene extends Phaser.Scene {
  private background!: Phaser.GameObjects.Image;
  private playerGraphics!: Phaser.GameObjects.Graphics;
  private playerShadow!: Phaser.GameObjects.Graphics;
  private playerNameplate!: Phaser.GameObjects.Container;
  private promptContainer!: Phaser.GameObjects.Container;
  private currentZone: InteractionZone | null = null;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasdKeys!: { W: Phaser.Input.Keyboard.Key; A: Phaser.Input.Keyboard.Key; S: Phaser.Input.Keyboard.Key; D: Phaser.Input.Keyboard.Key };
  private eKey!: Phaser.Input.Keyboard.Key;
  private targetPosition: Vector2 | null = null;
  private isClickMoving = false;

  constructor() {
    super({ key: 'AuditoriumScene' });
  }

  preload() {
    this.load.image('auditorium-bg', '/bg.svg');
  }

  create() {
    this.setupBackground();
    this.setupPlayer();
    this.setupZones();
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

  private setupPlayer() {
    const { player } = usePlayerStore.getState();
    this.playerShadow = this.add.graphics();
    this.playerShadow.setDepth(10);
    this.playerGraphics = this.add.graphics();
    this.playerGraphics.setDepth(11);

    // Floating 'You' badge container
    this.playerNameplate = this.add.container(player.position.x, player.position.y - 48);
    this.playerNameplate.setDepth(15);

    const bgG = this.add.graphics();
    bgG.fillStyle(0x000000, 0.65);
    bgG.fillRoundedRect(-22, -10, 44, 20, 10);
    bgG.lineStyle(1, 0xffffff, 0.15);
    bgG.strokeRoundedRect(-22, -10, 44, 20, 10);

    const dot = this.add.circle(-10, 0, 3, 0x22c55e);
    const txt = this.add.text(-2, 0, 'You', {
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

  private drawPlayer(position: Vector2) {
    const g = this.playerGraphics;
    g.clear();

    const cx = position.x;
    const cy = position.y;

    // Legs / Boots
    g.fillStyle(0x231c19, 1);
    g.fillRoundedRect(cx - 7, cy + 10, 5, 12, 2);
    g.fillRoundedRect(cx + 2, cy + 10, 5, 12, 2);

    // Brown Trench Coat / Body
    g.fillStyle(0x563e2e, 1);
    g.fillRoundedRect(cx - 12, cy - 8, 24, 22, 6);

    // Coat details & Collar (back angle)
    g.fillStyle(0x3e2c20, 1);
    g.fillTriangle(cx - 8, cy - 8, cx, cy - 2, cx - 4, cy + 6);
    g.fillTriangle(cx + 8, cy - 8, cx, cy - 2, cx + 4, cy + 6);
    g.lineStyle(1.5, 0x2b1d16, 1);
    g.strokeRoundedRect(cx - 12, cy - 8, 24, 22, 6);

    // Arms
    g.fillStyle(0x4a3426, 1);
    g.fillRoundedRect(cx - 15, cy - 6, 5, 14, 2.5);
    g.fillRoundedRect(cx + 10, cy - 6, 5, 14, 2.5);

    // Neck / Head base
    g.fillStyle(0x2d1f18, 1);
    g.fillCircle(cx, cy - 14, 11);

    // Dark Layered Hair (back/isometric view)
    g.fillStyle(0x201815, 1);
    g.fillCircle(cx, cy - 17, 12);
    g.fillCircle(cx - 4, cy - 15, 10);
    g.fillCircle(cx + 4, cy - 15, 10);
    g.fillStyle(0x352822, 0.6);
    g.fillCircle(cx, cy - 20, 8);

    if (this.playerNameplate) {
      this.playerNameplate.setPosition(cx, cy - 48);
    }
  }

  private drawShadow(position: Vector2) {
    const g = this.playerShadow;
    g.clear();
    g.fillStyle(0x000000, 0.28);
    g.fillEllipse(position.x, position.y + 22, 32, 10);
  }

  private setupZones() {
    // Stage Podium Floating Prompt pill [🏛 Press E to Speak]
    this.promptContainer = this.add.container(1344, 595);
    this.promptContainer.setDepth(20);

    const promptBg = this.add.graphics();
    promptBg.fillStyle(0x1a1410, 0.85);
    promptBg.fillRoundedRect(-85, -16, 170, 32, 16);
    promptBg.lineStyle(1.5, 0xc9a84c, 0.7);
    promptBg.strokeRoundedRect(-85, -16, 170, 32, 16);

    const promptTxt = this.add.text(0, 0, '🏛  Press E to Speak', {
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontSize: '12px',
      color: '#f5e6cc',
      fontStyle: 'bold',
      align: 'center',
    });
    promptTxt.setOrigin(0.5, 0.5);

    this.promptContainer.add([promptBg, promptTxt]);

    // Subtle gentle float animation on the podium prompt
    this.tweens.add({
      targets: this.promptContainer,
      y: 590,
      duration: 1800,
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

  private setupCamera() {
    this.cameras.main.setBounds(0, 0, GAME_CONFIG.worldWidth, GAME_CONFIG.worldHeight);
    this.cameras.main.setZoom(1);
    this.cameras.main.centerOn(1344, 820);
  }

  private setupClickToMove() {
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (pointer.rightButtonDown()) return;
      const target = pointer.event?.target as HTMLElement | null;
      if (target && target.id !== 'game-canvas') return;
      const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
      this.targetPosition = { x: worldPoint.x, y: worldPoint.y };
      this.isClickMoving = true;
    });
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

    if (isMoving) {
      const newX = Phaser.Math.Clamp(
        player.position.x + velocityX * (1 / 60),
        50,
        GAME_CONFIG.worldWidth - 50
      );
      const newY = Phaser.Math.Clamp(
        player.position.y + velocityY * (1 / 60),
        50,
        GAME_CONFIG.worldHeight - 50
      );

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

  private checkZones(position: Vector2) {
    let newZone: InteractionZone | null = null;

    for (const zone of INTERACTION_ZONES) {
      if (
        position.x >= zone.bounds.x &&
        position.x <= zone.bounds.x + zone.bounds.width &&
        position.y >= zone.bounds.y &&
        position.y <= zone.bounds.y + zone.bounds.height
      ) {
        newZone = zone;
        break;
      }
    }

    if (newZone !== this.currentZone) {
      this.currentZone = newZone;
      if (newZone) {
        this.showPrompt(newZone);
      } else {
        this.hidePrompt();
      }
    }

    if (this.currentZone && Phaser.Input.Keyboard.JustDown(this.eKey)) {
      this.handleZoneAction(this.currentZone);
    }
  }

  private showPrompt(zone: InteractionZone) {
    if (this.promptContainer) {
      this.tweens.add({
        targets: this.promptContainer,
        scaleX: 1.08,
        scaleY: 1.08,
        duration: 200,
        ease: 'Power2',
      });
    }
  }

  private hidePrompt() {
    if (this.promptContainer) {
      this.tweens.add({
        targets: this.promptContainer,
        scaleX: 1,
        scaleY: 1,
        duration: 200,
        ease: 'Power2',
      });
    }
  }

  private handleZoneAction(zone: InteractionZone) {
    const { addNotification } = useUIStore.getState();
    const messages: Record<string, string> = {
      stage: 'You approached the stage. Microphone activated.',
      podium: 'You approached the podium. Ready to present.',
      seating: 'You took a seat in the auditorium.',
      entrance: 'You are at the main hall entrance.',
    };
    addNotification({
      message: messages[zone.type] || `Interacted with ${zone.name}`,
      type: 'info',
      duration: 3000,
    });
  }

  update() {
    const newPosition = this.handleMovement();
    const currentPosition = newPosition || usePlayerStore.getState().player.position;

    if (newPosition) {
      this.drawPlayer(newPosition);
      this.drawShadow(newPosition);
      const cam = this.cameras.main;
      cam.scrollX += (currentPosition.x - cam.width / 2 - cam.scrollX) * 0.05;
      cam.scrollY += (currentPosition.y - 150 - cam.height / 2 - cam.scrollY) * 0.05;
    }

    this.checkZones(currentPosition);

    const zoom = useCameraStore.getState().zoom;
    this.cameras.main.setZoom(zoom);
  }
}

export const createGameConfig = (canvas: HTMLCanvasElement): Phaser.Types.Core.GameConfig => ({
  type: Phaser.WEBGL,
  canvas,
  width: typeof window !== 'undefined' ? window.innerWidth : 1920,
  height: typeof window !== 'undefined' ? window.innerHeight : 1080,
  backgroundColor: '#1a1612',
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