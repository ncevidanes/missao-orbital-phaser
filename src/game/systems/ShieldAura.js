export class ShieldAura {
  constructor(scene, player) {
    this.aura = scene.add.circle(player.x, player.y, 40, 0x68e8ff, 0.08)
      .setStrokeStyle(4, 0x85f2ff, 0.9)
      .setDepth(player.depth + 1)
      .setVisible(false);

    scene.tweens.add({
      targets: this.aura,
      alpha: 0.42,
      scale: 1.1,
      duration: 520,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  update(player, active) {
    this.aura
      .setPosition(player.x, player.y)
      .setVisible(active && player.active && player.alpha > 0);
  }

  hide() {
    this.aura.setVisible(false);
  }
}
