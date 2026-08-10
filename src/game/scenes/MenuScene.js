import Phaser from 'phaser';
import { HighScoreRepository } from '../systems/HighScoreRepository.js';
import { getSoundManager } from '../systems/SynthSoundManager.js';
import { createStarfield } from '../systems/Starfield.js';
import { createGameTextures } from '../systems/TextureFactory.js';
import { createTextButton } from '../ui/TextButton.js';

const TITLE_STYLE = {
  fontFamily: '"Courier New", Courier, monospace',
  fontStyle: 'bold',
  stroke: '#010401',
  strokeThickness: 6,
};

export class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create() {
    createGameTextures(this);
    createStarfield(this, { animated: true });
    this.soundManager = getSoundManager(this);
    this.starting = false;

    const { width, height } = this.scale;
    const orbit = this.add.circle(width / 2, 267, 148, 0x031003, 0.72)
      .setStrokeStyle(2, 0x17843b, 0.55);
    this.add.circle(width / 2, 267, 105, 0x031003, 0)
      .setStrokeStyle(1, 0x39ff70, 0.34);

    const ship = this.add.image(width / 2, 260, 'player-ship')
      .setScale(1.5)
      .setDepth(4);
    const shieldIcon = this.add.image(width / 2 - 155, 270, 'powerup-shield')
      .setDepth(4);
    const repairIcon = this.add.image(width / 2 + 155, 270, 'powerup-repair')
      .setDepth(4);
    this.tweens.add({
      targets: ship,
      y: 272,
      angle: 2,
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
    this.tweens.add({
      targets: orbit,
      alpha: 0.35,
      duration: 1600,
      yoyo: true,
      repeat: -1,
    });
    this.tweens.add({
      targets: [shieldIcon, repairIcon],
      y: '+=12',
      angle: 8,
      duration: 980,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    this.add.text(width / 2, 64, 'MISSÃO ORBITAL', {
      ...TITLE_STYLE,
      fontSize: '66px',
      color: '#39ff70',
    }).setOrigin(0.5).setDepth(5);
    this.add.text(width / 2, 116, 'GREEN TERMINAL BUILD // SYSTEM ONLINE', {
      ...TITLE_STYLE,
      fontSize: '18px',
      color: '#b8ffca',
      letterSpacing: 4,
      strokeThickness: 3,
    }).setOrigin(0.5).setDepth(5);

    this.add.text(width / 2, 158, '[STARFIELD: OK]  [THRUSTERS: OK]  [METEOR WATCH: ACTIVE]', {
      ...TITLE_STYLE,
      fontSize: '15px',
      color: '#17843b',
      strokeThickness: 2,
    }).setOrigin(0.5).setDepth(5);

    const highScore = new HighScoreRepository().read();
    this.add.text(width / 2, 418, `> RECORDE ${String(highScore).padStart(6, '0')}`, {
      ...TITLE_STYLE,
      fontSize: '27px',
      color: '#b8ffca',
      strokeThickness: 3,
    }).setOrigin(0.5);

    createTextButton(
      this,
      width / 2,
      480,
      '> INICIAR MISSÃO_',
      () => this.startGame(),
      { fontSize: '26px', padding: { x: 36, y: 17 } },
    );

    this.soundButton = createTextButton(
      this,
      width / 2,
      544,
      '',
      () => this.toggleSound(),
      {
        fontSize: '18px',
        color: '#39ff70',
        backgroundColor: '#061d0b',
        hoverColor: '#0b3217',
        padding: { x: 20, y: 10 },
      },
    );
    this.updateSoundButton();

    this.add.text(width / 2, 606, '> Setas, WASD ou toque // Escudo [S] // Reparo [+]', {
      ...TITLE_STYLE,
      fontSize: '20px',
      fontStyle: 'normal',
      color: '#39ff70',
      strokeThickness: 3,
    }).setOrigin(0.5);
    this.add.text(width / 2, 647, '> Sobreviva por 60s // Evite meteoros errantes', {
      ...TITLE_STYLE,
      fontSize: '16px',
      fontStyle: 'normal',
      color: '#17843b',
      strokeThickness: 2,
    }).setOrigin(0.5);

    this.add.text(width - 24, height - 20, 'v0.4.0 // CRT', {
      ...TITLE_STYLE,
      fontSize: '14px',
      color: '#17843b',
      strokeThickness: 2,
    }).setOrigin(1).setDepth(5);

    this.input.keyboard.once('keydown-ENTER', () => this.startGame());
    this.input.keyboard.once('keydown-SPACE', () => this.startGame());
  }

  startGame() {
    if (this.starting) {
      return;
    }

    this.starting = true;
    this.soundManager.unlock();
    this.soundManager.playStart();
    this.cameras.main.fadeOut(260, 1, 4, 1);
    this.time.delayedCall(270, () => this.scene.start('GameScene'));
  }

  toggleSound() {
    this.soundManager.unlock();
    const muted = this.soundManager.toggleMute();
    this.updateSoundButton();
    if (!muted) {
      this.soundManager.playCollect();
    }
  }

  updateSoundButton() {
    this.soundButton.setText(this.soundManager.muted ? 'SOM: DESLIGADO' : 'SOM: LIGADO');
  }
}
