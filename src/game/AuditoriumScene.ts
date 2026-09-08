import Phaser from 'phaser';
import { GAME_CONFIG, INTERACTION_ZONES, InteractionZone, Vector2 } from '@/types';
import { usePlayerStore } from '@/store/playerStore';
import { useCameraStore } from '@/store/cameraStore';
import { useUIStore } from '@/store/uiStore';

export class AuditoriumScene extends Phaser.Scene {
  private background!: Phaser.GameObjects.Image;
  private playerGraphics!: Phaser.GameObjects.Graphics;
  private playerShadow!: Phaser.GameObjects.Graphics;
  private zoneGraphics!: Phaser.GameObjects.Graphics;
  private promptText!: Phaser.GameObjects.Text;
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
    this.drawPlayer(player.position);
    this.drawShadow(player.position);
  }

  private drawPlayer(position: Vector2) {
    const { avatar } = usePlayerStore.getState().player;
    const g = this.playerGraphics;
    g.clear();

    const bodyRadius = 24;
    const headRadius = 16;
    const bodyY = position.y;
    const headY = position.y - bodyRadius - headRadius + 4;

    g.fillStyle(Phaser.Display.Color.HexStringToColor('#000000').color, 0.15);
    g.fillEllipse(position.x, bodyY + 8, bodyRadius * 1.8, 8);

    g.fillStyle(Phaser.Display.Color.HexStringToColor(avatar.bodyColor).color);
    g.fillEllipse(position.x, bodyY, bodyRadius * 2, bodyRadius * 2);

    g.fillStyle(Phaser.Display.Color.HexStringToColor(avatar.headColor).color);
    g.fillCircle(position.x, headY, headRadius);

    g.lineStyle(2, Phaser.Display.Color.HexStringToColor(avatar.accentColor).color, 1);
    g.strokeCircle(position.x, headY, headRadius);

    g.fillStyle(Phaser.Display.Color.HexStringToColor(avatar.accentColor).color);
    g.fillCircle(position.x - 5, headY - 3, 2);
    g.fillCircle(position.x + 5, headY - 3, 2);
  }

  private drawShadow(position: Vector2) {
    const g = this.playerShadow;
    g.clear();
    g.fillStyle(0x000000, 0.2);
    g.fillEllipse(position.x, position.y + 28, 40, 10);
  }

  private setupZones() {
    this.zoneGraphics = this.add.graphics();
    this.zoneGraphics.setDepth(5);
    this.zoneGraphics.setVisible(false);

    this.promptText = this.add.text(0, 0, '', {
      fontFamily: 'Georgia, serif',
      fontSize: '14px',
      color: '#c9a84c',
      backgroundColor: 'rgba(26, 22, 18, 0.9)',
      padding: { x: 12, y: 8 },
      align: 'center',
    });
    this.promptText.setOrigin(0.5);
    this.promptText.setDepth(20);
    this.promptText.setVisible(false);
    this.promptText.setStroke('#000000', 2);
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
    const { player } = usePlayerStore.getState();
    this.cameras.main.centerOn(player.position.x, player.position.y);
  }

  private setupClickToMove() {
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (pointer.rightButtonDown()) return;
      const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
      this.targetPosition = { x: worldPoint.x, y: worldPoint.y };
      this.isClickMoving = true;
    });
  }

  private handleMovement(): Vector2 | null {
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
    const { player } = usePlayerStore.getState();
    this.promptText.setText(`${zone.prompt} (${zone.actionKey})`);
    this.promptText.setPosition(player.position.x, player.position.y - 80);
    this.promptText.setVisible(true);
    this.tweens.add({
      targets: this.promptText,
      alpha: { from: 0, to: 1 },
      y: player.position.y - 90,
      duration: 200,
      ease: 'Power2',
    });
  }

  private hidePrompt() {
    this.tweens.add({
      targets: this.promptText,
      alpha: 0,
      y: this.promptText.y - 10,
      duration: 150,
      ease: 'Power2',
      onComplete: () => this.promptText.setVisible(false),
    });
  }

  private handleZoneAction(zone: InteractionZone) {
    const { addNotification } = useUIStore.getState();
    const messages: Record<string, string> = {
      stage: 'You stepped onto the stage. Microphone activated.',
      podium: 'You approached the podium. Ready to present.',
      seating: 'You took a seat. Enjoy the session.',
      entrance: 'You exited the auditorium.',
    };
    addNotification({
      message: messages[zone.type] || `Interacted with ${zone.name}`,
      type: 'info',
      duration: 3000,
    });
  }

  update() {
    const newPosition = this.handleMovement();
    if (newPosition) {
      this.drawPlayer(newPosition);
      this.drawShadow(newPosition);
      this.checkZones(newPosition);

      useCameraStore.getState().setTargetPosition(newPosition);
    }

    useCameraStore.getState().updatePosition();
    const { position, zoom } = useCameraStore.getState();
    this.cameras.main.centerOn(position.x, position.y);
    this.cameras.main.setZoom(zoom);

    if (this.currentZone) {
      const { player } = usePlayerStore.getState();
      this.promptText.setPosition(player.position.x, player.position.y - 90);
    }
  }
}

export const createGameConfig = (canvas: HTMLCanvasElement): Phaser.Types.Core.GameConfig => ({
  type: Phaser.WEBGL,
  canvas,
  parent: 'game-container',
  width: window.innerWidth,
  height: window.innerHeight,
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