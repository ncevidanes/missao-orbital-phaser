import Phaser from 'phaser';
import { GameScene } from '../scenes/GameScene.js';
import { MenuScene } from '../scenes/MenuScene.js';

export function createGameConfig(parent) {
  return {
    type: Phaser.AUTO,
    parent,
    width: 1280,
    height: 720,
    backgroundColor: '#081225',
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { x: 0, y: 0 },
        debug: false,
      },
    },
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [MenuScene, GameScene],
  };
}
