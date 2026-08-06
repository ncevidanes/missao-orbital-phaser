import Phaser from 'phaser';

export class Crystal extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'crystal');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCircle(18, 6, 6);
    this.setDepth(5);

    scene.tweens.add({
      targets: this,
      scale: 1.16,
      duration: 650,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }
}
