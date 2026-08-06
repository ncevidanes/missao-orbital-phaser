import Phaser from 'phaser';

export function createStarfield(scene, { animated = false } = {}) {
  const { width, height } = scene.scale;
  const background = scene.add.graphics().setDepth(-20);
  background.fillStyle(0x081225, 1);
  background.fillRect(0, 0, width, height);

  scene.add.circle(width * 0.18, height * 0.28, 235, 0x153c67, 0.1)
    .setDepth(-19);
  scene.add.circle(width * 0.84, height * 0.72, 300, 0x37275f, 0.08)
    .setDepth(-19);

  for (let index = 0; index < 125; index += 1) {
    const brightness = Phaser.Math.FloatBetween(0.24, 0.92);
    const size = Phaser.Math.FloatBetween(0.8, 2.4);
    const star = scene.add.circle(
      Phaser.Math.Between(0, width),
      Phaser.Math.Between(0, height),
      size,
      0xcceeff,
      brightness,
    ).setDepth(-10);

    if (animated) {
      if (index % 5 === 0) {
        scene.tweens.add({
          targets: star,
          alpha: Phaser.Math.FloatBetween(0.15, 0.45),
          duration: Phaser.Math.Between(650, 1450),
          yoyo: true,
          repeat: -1,
        });
      }

      if (index % 3 === 0) {
        scene.tweens.add({
          targets: star,
          y: height + 8,
          duration: Phaser.Math.Between(9000, 19000),
          delay: Phaser.Math.Between(0, 5000),
          repeat: -1,
          ease: 'Linear',
        });
      }
    }
  }
}
