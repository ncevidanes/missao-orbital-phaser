import Phaser from 'phaser';
import './style.css';
import { createGameConfig } from './game/config/gameConfig.js';
import { installGameViewport } from './game/systems/GameViewport.js';

const removeViewportSync = installGameViewport();
const game = new Phaser.Game(createGameConfig('game-container'));

window.addEventListener('beforeunload', () => {
  removeViewportSync();
  game.destroy(true);
});
