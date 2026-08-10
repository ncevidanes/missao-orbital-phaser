import Phaser from 'phaser';

export class ShipAnimator {
  constructor(scene, player) {
    this.scene = scene;
    this.flame = scene.add.image(player.x, player.y + 32, 'engine-flame')
      .setDepth(player.depth - 1);
    this.elapsedSinceTrail = 0;
  }

  update(player, delta) {
    if (!player.active || player.alpha <= 0) {
      this.flame.setVisible(false);
      return;
    }

    const angle = Phaser.Math.DegToRad(player.angle);
    const moving = player.body?.velocity.lengthSq() > 1;
    const engineDistance = 29;

    this.flame
      .setVisible(true)
      .setPosition(
        player.x - Math.sin(angle) * engineDistance,
        player.y + Math.cos(angle) * engineDistance,
      )
      .setAngle(player.angle)
      .setAlpha(moving ? 0.98 : 0.58)
      .setScale(
        moving ? Phaser.Math.FloatBetween(0.92, 1.08) : 0.68,
        moving ? Phaser.Math.FloatBetween(1.05, 1.42) : 0.7,
      );

    if (!moving) {
      return;
    }

    this.elapsedSinceTrail += delta;
    if (this.elapsedSinceTrail >= 72) {
      this.elapsedSinceTrail = 0;
      this.createTrailSpark(this.flame.x, this.flame.y, angle);
    }
  }

  createTrailSpark(x, y, angle) {
    const spark = this.scene.add.rectangle(x, y, 5, 5, 0x39ff70, 0.8).setDepth(8);
    this.scene.tweens.add({
      targets: spark,
      x: x - Math.sin(angle) * Phaser.Math.Between(8, 18),
      y: y + Math.cos(angle) * Phaser.Math.Between(8, 18),
      scale: 0.15,
      alpha: 0,
      duration: 260,
      onComplete: () => spark.destroy(),
    });
  }

  stop() {
    this.flame.setVisible(false);
  }
}
