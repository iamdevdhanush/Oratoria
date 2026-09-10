'use client';

import { useEffect, useRef } from 'react';
import * as Phaser from 'phaser';
import { createGameConfig, AuditoriumScene } from './AuditoriumScene';
import { useCameraStore } from '@/store/cameraStore';

interface GameCanvasProps {
  onSceneReady?: () => void;
}

export function GameCanvas({ onSceneReady }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!canvasRef.current || gameRef.current) return;

    const config = createGameConfig(canvasRef.current);
    const game = new Phaser.Game(config);
    gameRef.current = game;

    game.events.once('ready', () => {
      onSceneReady?.();
    });

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        if (e.deltaY < 0) {
          useCameraStore.getState().zoomIn();
        } else {
          useCameraStore.getState().zoomOut();
        }
      }
    };

    const handleResize = () => {
      if (gameRef.current) {
        const w = window.innerWidth;
        const h = window.innerHeight;
        gameRef.current.scale.resize(w, h);
        const scene = gameRef.current.scene.getScene('AuditoriumScene');
        if (scene && (scene as any).cameras?.main) {
          const newZoom = Math.max(0.2, Math.min(2.0, h / 1536));
          useCameraStore.getState().setZoom(newZoom);
          (scene as any).cameras.main.setZoom(newZoom);
          (scene as any).cameras.main.centerOn(1344, 768);
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('resize', handleResize);
      game.destroy(true);
      gameRef.current = null;
    };
  }, [onSceneReady]);

  return (
    <canvas
      ref={canvasRef}
      id="game-canvas"
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
        touchAction: 'none',
      }}
      tabIndex={0}
    />
  );
}