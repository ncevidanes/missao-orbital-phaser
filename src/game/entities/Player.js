import Phaser from 'phaser';

const PLAYER_SPEED = 310;

export class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player-ship');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setDepth(10);
    this.setCollideWorldBounds(true);
    this.setCircle(20, 12, 12);
  }

  move(cursors, wasd) {
    const horizontal = Number(cursors.right.isDown || wasd.right.isDown)
      - Number(cursors.left.isDown || wasd.left.isDown);
    const vertical = Number(cursors.down.isDown || wasd.down.isDown)
      - Number(cursors.up.isDown || wasd.up.isDown);

    const direction = new Phaser.Math.Vector2(horizontal, vertical);

    if (direction.lengthSq() === 0) {
      this.setVelocity(0, 0);
      return;
    }

    direction.normalize().scale(PLAYER_SPEED);
    this.setVelocity(direction.x, direction.y);
    this.setAngle(Phaser.Math.RadToDeg(Math.atan2(vertical, horizontal)) + 90);
  }

  resetPosition(x, y) {
    this.body.reset(x, y);
    this.setVelocity(0, 0);
    this.setAngle(0);
  }

  stop() {
    this.setVelocity(0, 0);
  }
}
