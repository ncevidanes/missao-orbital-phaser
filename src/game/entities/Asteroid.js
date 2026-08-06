import Phaser from 'phaser';

export class Asteroid extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, variant) {
    super(scene, x, y, variant.texture);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.variant = variant;
    this.setCircle(
      variant.bodyRadius,
      variant.bodyOffset,
      variant.bodyOffset,
    );
    this.setDepth(6);
  }

  startFalling(speed) {
    this.setVelocityY(speed * this.variant.speedMultiplier);
    this.setVelocityX(Phaser.Math.Between(-18, 18));
    this.setAngularVelocity(
      Phaser.Math.Between(-this.variant.angularSpeed, this.variant.angularSpeed),
    );
  }
}
