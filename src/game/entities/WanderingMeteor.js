import Phaser from 'phaser';
import { advanceBrownianVelocity } from '../systems/BrownianMotion.js';

const EDGE_MARGIN = 28;

export class WanderingMeteor extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, profile, random = Math.random) {
    super(scene, x, y, 'wandering-meteor');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.profile = profile;
    this.random = random;
    this.lateralVelocity = (random() * 2 - 1) * profile.maxLateralSpeed * 0.32;
    this.setCircle(13, 11, 31);
    this.setDepth(9);
  }

  startDrifting() {
    this.setVelocity(this.lateralVelocity, this.profile.verticalSpeed);
  }

  updateBrownian(delta) {
    this.lateralVelocity = advanceBrownianVelocity(
      this.lateralVelocity,
      delta,
      this.profile,
      this.random,
    );

    const rightEdge = this.scene.scale.width - EDGE_MARGIN;
    if (this.x <= EDGE_MARGIN && this.lateralVelocity < 0) {
      this.lateralVelocity = Math.abs(this.lateralVelocity) * 0.82;
      this.setX(EDGE_MARGIN);
    } else if (this.x >= rightEdge && this.lateralVelocity > 0) {
      this.lateralVelocity = -Math.abs(this.lateralVelocity) * 0.82;
      this.setX(rightEdge);
    }

    this.setVelocity(this.lateralVelocity, this.profile.verticalSpeed);
    this.setAngle(Phaser.Math.Clamp(
      this.lateralVelocity / this.profile.maxLateralSpeed * 18,
      -18,
      18,
    ));
  }
}
