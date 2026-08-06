const DIRECTIONS = ['up', 'left', 'down', 'right'];

function isPressed(source, direction) {
  const value = source?.[direction];
  return Boolean(value?.isDown ?? value);
}

export function resolveMovementAxes(...sources) {
  const pressed = Object.fromEntries(
    DIRECTIONS.map((direction) => [
      direction,
      sources.some((source) => isPressed(source, direction)),
    ]),
  );

  return {
    horizontal: Number(pressed.right) - Number(pressed.left),
    vertical: Number(pressed.down) - Number(pressed.up),
  };
}
