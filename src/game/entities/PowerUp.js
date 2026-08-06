import Phaser from 'phaser';

export class PowerUp extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, type) {
    super(scene, x, y, `powerup-${type}`);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.powerUpType = type;
    this.setCircle(22, 4, 4);
    this.setDepth(8);

    scene.tweens.add({
      targets: this,
      scale: 1.12,
      angle: 8,
      duration: 620,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }
}
