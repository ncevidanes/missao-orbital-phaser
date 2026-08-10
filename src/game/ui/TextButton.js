const DEFAULT_STYLE = {
  fontFamily: '"Courier New", Courier, monospace',
  fontSize: '23px',
  fontStyle: 'bold',
  color: '#010401',
  backgroundColor: '#39ff70',
  padding: { x: 26, y: 14 },
};

export function createTextButton(scene, x, y, label, onActivate, options = {}) {
  const baseColor = options.backgroundColor ?? DEFAULT_STYLE.backgroundColor;
  const hoverColor = options.hoverColor ?? '#b8ffca';
  const button = scene.add.text(x, y, label, {
    ...DEFAULT_STYLE,
    ...options,
    backgroundColor: baseColor,
    padding: options.padding ?? DEFAULT_STYLE.padding,
  })
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true })
    .on('pointerdown', onActivate)
    .on('pointerover', () => button.setBackgroundColor(hoverColor))
    .on('pointerout', () => button.setBackgroundColor(baseColor));

  return button;
}
