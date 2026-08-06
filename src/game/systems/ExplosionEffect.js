import Phaser from 'phaser';

function scatterParticle(scene, x, y, color, index) {
  const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
  const distance = Phaser.Math.Between(34, 105);
  const particle = scene.add.circle(
    x,
    y,
    Phaser.Math.FloatBetween(2.5, 7),
    index % 3 === 0 ? 0xffe5a3 : color,
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

export function createExplosion(scene, x, y, color = 0xff8748) {
  const flash = scene.add.circle(x, y, 18, 0xffffff, 0.92).setDepth(23);
  scene.tweens.add({
    targets: flash,
    radius: 48,
    alpha: 0,
    duration: 230,
    ease: 'Quad.easeOut',
    onComplete: () => flash.destroy(),
  });

  for (let index = 0; index < 18; index += 1) {
    scatterParticle(scene, x, y, color, index);
  }
}

export function createPickupBurst(scene, x, y, color = 0x68e8ff) {
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
