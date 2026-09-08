'use client';

import { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { createGameConfig, AuditoriumScene } from './AuditoriumScene';
import { useCameraStore } from '@/store/cameraStore';

interface GameCanvasProps {
  onSceneReady?: () => void;
}

export function GameCanvas({ onSceneReady }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const sceneRef = useRef<AuditoriumScene | null>(null);
  const [isReady, setIsReady] = useState(false);
  const { zoom, setZoom, zoomIn, zoomOut } = useCameraStore();

  useEffect(() => {
    if (!canvasRef.current || gameRef.current) return;

    const config = createGameConfig(canvasRef.current);
    const game = new Phaser.Game(config);
    gameRef.current = game;

    game.events.once('ready', () => {
      sceneRef.current = game.scene.getScene('AuditoriumScene') as AuditoriumScene;
      setIsReady(true);
      onSceneReady?.();
    });

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        if (e.deltaY < 0) zoomIn();
        else zoomOut();
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      game.destroy(true);
      gameRef.current = null;
      sceneRef.current = null;
      setIsReady(false);
    };
  }, [onSceneReady, zoomIn, zoomOut]);

  useEffect(() => {
    if (gameRef.current?.canvas) {
      gameRef.current.scale.resize(window.innerWidth, window.innerHeight);
    }
  }, []);

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