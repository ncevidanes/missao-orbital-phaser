import Phaser from 'phaser';

function scatterParticle(scene, x, y, color, index) {
  const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
  const distance = Phaser.Math.Between(34, 105);
  const particle = scene.add.rectangle(
    x,
    y,
    Phaser.Math.Between(4, 9),
    Phaser.Math.Between(4, 9),
    index % 3 === 0 ? 0xb8ffca : color,
    0.95,
  ).setDepth(24);

  scene.tweens.add({
    targets: particle,
    x: x + Math.cos(angle) * distance,
    y: y + Math.sin(angle) * distance,
    alpha: 0,
    scale: 0.25,
    duration: Phaser.Math.Between(300, 560),
    ease: 'Cubic.easeOut',
    onComplete: () => particle.destroy(),
  });
}

export function createExplosion(scene, x, y, color = 0x39ff70) {
  const flash = scene.add.rectangle(x, y, 34, 34, 0xb8ffca, 0.92).setDepth(23);
  scene.tweens.add({
    targets: flash,
    scale: 2.8,
    alpha: 0,
    duration: 230,
    ease: 'Quad.easeOut',
    onComplete: () => flash.destroy(),
  });

  for (let index = 0; index < 18; index += 1) {
    scatterParticle(scene, x, y, color, index);
  }
}

export function createPickupBurst(scene, x, y, color = 0x39ff70) {
  const ring = scene.add.circle(x, y, 16, color, 0)
    .setStrokeStyle(4, color, 0.95)
    .setDepth(23);

  scene.tweens.add({
    targets: ring,
    radius: 52,
    alpha: 0,
    duration: 330,
    ease: 'Quad.easeOut',
    onComplete: () => ring.destroy(),
  });
}
