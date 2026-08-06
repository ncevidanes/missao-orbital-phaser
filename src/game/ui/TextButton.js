const DEFAULT_STYLE = {
  fontFamily: 'Inter, Arial, sans-serif',
  fontSize: '23px',
  fontStyle: 'bold',
  color: '#061329',
  backgroundColor: '#68e8ff',
  padding: { x: 26, y: 14 },
};

export function createTextButton(scene, x, y, label, onActivate, options = {}) {
  const baseColor = options.backgroundColor ?? DEFAULT_STYLE.backgroundColor;
  const hoverColor = options.hoverColor ?? '#ffffff';
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
