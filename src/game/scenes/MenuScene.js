import Phaser from 'phaser';
import { HighScoreRepository } from '../systems/HighScoreRepository.js';
import { getSoundManager } from '../systems/SynthSoundManager.js';
import { createStarfield } from '../systems/Starfield.js';
import { createGameTextures } from '../systems/TextureFactory.js';
import { createTextButton } from '../ui/TextButton.js';

const TITLE_STYLE = {
  fontFamily: 'Inter, Arial, sans-serif',
  fontStyle: 'bold',
  stroke: '#06101f',
  strokeThickness: 8,
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
    const orbit = this.add.circle(width / 2, 255, 148, 0x07162c, 0.7)
      .setStrokeStyle(2, 0x2a79a6, 0.48);
    this.add.circle(width / 2, 255, 105, 0x07162c, 0)
      .setStrokeStyle(1, 0x68e8ff, 0.28);

    const ship = this.add.image(width / 2, 248, 'player-ship')
      .setScale(1.5)
      .setDepth(4);
    const shieldIcon = this.add.image(width / 2 - 155, 258, 'powerup-shield')
      .setDepth(4);
    const repairIcon = this.add.image(width / 2 + 155, 258, 'powerup-repair')
      .setDepth(4);
    this.tweens.add({
      targets: ship,
      y: 260,
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

    this.add.text(width / 2, 72, 'MISSÃO ORBITAL', {
      ...TITLE_STYLE,
      fontSize: '66px',
      color: '#85f2ff',
    }).setOrigin(0.5).setDepth(5);
    this.add.text(width / 2, 128, 'COLETE · DESVIE · SOBREVIVA', {
      ...TITLE_STYLE,
      fontSize: '19px',
      color: '#b8d2e5',
      letterSpacing: 5,
      strokeThickness: 4,
    }).setOrigin(0.5).setDepth(5);

    const highScore = new HighScoreRepository().read();
    this.add.text(width / 2, 406, `RECORDE: ${highScore}`, {
      ...TITLE_STYLE,
      fontSize: '27px',
      color: '#ffe09a',
      strokeThickness: 5,
    }).setOrigin(0.5);

    createTextButton(
      this,
      width / 2,
      480,
      'INICIAR MISSÃO',
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
        color: '#d8f6ff',
        backgroundColor: '#173756',
        hoverColor: '#245578',
        padding: { x: 20, y: 10 },
      },
    );
    this.updateSoundButton();

    this.add.text(width / 2, 606, 'Setas ou WASD · Escudo azul · Reparo verde', {
      ...TITLE_STYLE,
      fontSize: '20px',
      fontStyle: 'normal',
      color: '#a9bdd1',
      strokeThickness: 4,
    }).setOrigin(0.5);
    this.add.text(width / 2, 647, 'Sobreviva por 60 segundos e supere seu recorde', {
      ...TITLE_STYLE,
      fontSize: '16px',
      fontStyle: 'normal',
      color: '#6f91aa',
      strokeThickness: 3,
    }).setOrigin(0.5);

    this.add.text(width - 24, height - 20, 'v0.3.0', {
      ...TITLE_STYLE,
      fontSize: '14px',
      color: '#577a94',
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
    this.cameras.main.fadeOut(260, 4, 11, 24);
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
