import Phaser from 'phaser';
import './style.css';
import { createGameConfig } from './game/config/gameConfig.js';

const game = new Phaser.Game(createGameConfig('game-container'));

window.addEventListener('beforeunload', () => {
  game.destroy(true);
});
