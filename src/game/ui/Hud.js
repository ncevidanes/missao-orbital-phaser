import { createTextButton } from './TextButton.js';

const TEXT_STYLE = {
  fontFamily: '"Courier New", Courier, monospace',
  fontSize: '28px',
  fontStyle: 'bold',
  color: '#39ff70',
  stroke: '#010401',
  strokeThickness: 4,
};

const SECONDARY_STYLE = {
  ...TEXT_STYLE,
  fontSize: '17px',
  color: '#17843b',
  strokeThickness: 3,
};

export class Hud {
  constructor(scene, { onToggleSound, soundMuted }) {
    this.scene = scene;
    this.scoreText = scene.add.text(28, 22, '', TEXT_STYLE).setDepth(30);
    this.recordText = scene.add.text(30, 61, '', SECONDARY_STYLE).setDepth(30);
    this.livesText = scene.add.text(640, 22, '', TEXT_STYLE)
      .setOrigin(0.5, 0)
      .setDepth(30);
    this.levelText = scene.add.text(640, 61, '', SECONDARY_STYLE)
      .setOrigin(0.5, 0)
      .setDepth(30);
    this.powerUpText = scene.add.text(640, 91, '', {
      ...SECONDARY_STYLE,
      color: '#b8ffca',
    })
      .setOrigin(0.5, 0)
      .setDepth(30);
    this.timeText = scene.add.text(1252, 22, '', TEXT_STYLE)
      .setOrigin(1, 0)
      .setDepth(30);
    this.soundButton = scene.add.text(1250, 63, '', {
      ...SECONDARY_STYLE,
      color: '#39ff70',
      backgroundColor: '#061d0b',
      padding: { x: 9, y: 5 },
    })
      .setOrigin(1, 0)
      .setDepth(31)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', onToggleSound)
      .on('pointerover', () => this.soundButton.setBackgroundColor('#0b3217'))
      .on('pointerout', () => this.soundButton.setBackgroundColor('#061d0b'));
    this.setSoundMuted(soundMuted);
  }

  update({ score, lives, remainingTime, level, highScore, shieldSeconds = 0 }) {
    this.scoreText.setText(`SCORE ${String(score).padStart(6, '0')}`);
    this.recordText.setText(`HI-SCORE ${String(highScore).padStart(6, '0')}`);
    this.livesText.setText(`LIFE [${'■'.repeat(Math.max(0, lives)).padEnd(3, '·')}]`);
    this.levelText.setText(`SECTOR ${level}/5`);
    this.powerUpText.setText(shieldSeconds > 0 ? `SHIELD ${shieldSeconds}s` : '');
    this.timeText.setText(`TIME ${String(remainingTime).padStart(2, '0')}`);
  }

  setSoundMuted(muted) {
    this.soundButton.setText(muted ? '[AUDIO OFF]' : '[AUDIO ON]');
  }

  showLevelUp(level) {
    const { width, height } = this.scene.scale;
    const announcement = this.scene.add.text(width / 2, height / 2 - 125, `> SECTOR ${level} LOADED_`, {
      ...TEXT_STYLE,
      fontSize: '44px',
      color: '#b8ffca',
    }).setOrigin(0.5).setDepth(50).setScale(0.75).setAlpha(0);

    this.scene.tweens.add({
      targets: announcement,
      alpha: 1,
      scale: 1,
      yoyo: true,
      hold: 380,
      duration: 240,
      onComplete: () => announcement.destroy(),
    });
  }

  showPowerUp(message, color = '#39ff70') {
    const { width, height } = this.scene.scale;
    const announcement = this.scene.add.text(width / 2, height / 2 - 90, message, {
      ...TEXT_STYLE,
      fontSize: '34px',
      color,
    }).setOrigin(0.5).setDepth(52).setScale(0.75).setAlpha(0);

    this.scene.tweens.add({
      targets: announcement,
      y: announcement.y - 24,
      alpha: 1,
      scale: 1,
      yoyo: true,
      hold: 420,
      duration: 230,
      onComplete: () => announcement.destroy(),
    });
  }

  showGameOver({ score, highScore, isNewRecord, reason, onRestart, onMenu }) {
    const { width, height } = this.scene.scale;
    const panel = this.scene.add.rectangle(0, 0, 680, 430, 0x010401, 0.97)
      .setStrokeStyle(3, 0x39ff70);
    const title = this.scene.add.text(0, -155, '> TRANSMISSÃO ENCERRADA_', {
      ...TEXT_STYLE,
      fontSize: '40px',
      color: '#39ff70',
    }).setOrigin(0.5);
    const reasonText = this.scene.add.text(0, -88, reason, {
      ...TEXT_STYLE,
      fontSize: '22px',
      fontStyle: 'normal',
    }).setOrigin(0.5);
    const scoreText = this.scene.add.text(0, -35, `SCORE ${String(score).padStart(6, '0')}`, {
      ...TEXT_STYLE,
      fontSize: '31px',
    }).setOrigin(0.5);
    const recordText = this.scene.add.text(
      0,
      14,
      isNewRecord
        ? `NEW HI-SCORE ${String(highScore).padStart(6, '0')}`
        : `HI-SCORE ${String(highScore).padStart(6, '0')}`,
      {
        ...TEXT_STYLE,
        fontSize: '23px',
        color: isNewRecord ? '#b8ffca' : '#17843b',
      },
    ).setOrigin(0.5);

    const restartButton = createTextButton(
      this.scene,
      -145,
      91,
      'JOGAR NOVAMENTE',
      onRestart,
      { fontSize: '19px', padding: { x: 19, y: 13 } },
    );
    const menuButton = createTextButton(
      this.scene,
      145,
      91,
      'MENU INICIAL',
      onMenu,
      {
        fontSize: '19px',
        color: '#39ff70',
        backgroundColor: '#061d0b',
        hoverColor: '#0b3217',
        padding: { x: 22, y: 13 },
      },
    );
    const keyboardTip = this.scene.add.text(0, 154, 'R: reiniciar · M: menu', {
      ...SECONDARY_STYLE,
      fontStyle: 'normal',
    }).setOrigin(0.5);

    this.scene.add.container(width / 2, height / 2, [
      panel,
      title,
      reasonText,
      scoreText,
      recordText,
      restartButton,
      menuButton,
      keyboardTip,
    ]).setDepth(100);
  }
}
