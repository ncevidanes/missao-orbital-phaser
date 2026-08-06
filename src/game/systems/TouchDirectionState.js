const DIRECTIONS = new Set(['up', 'left', 'down', 'right']);

export function shouldShowTouchControls({ maxTouchPoints = 0, coarsePointer = false } = {}) {
  return maxTouchPoints > 0 || coarsePointer;
}

export class TouchDirectionState {
  constructor() {
    this.activePointers = new Map();
  }

  press(direction, pointerId) {
    if (!DIRECTIONS.has(direction)) {
      return;
    }

    this.activePointers.set(pointerId, direction);
  }

  release(pointerId) {
    this.activePointers.delete(pointerId);
  }

  clear() {
    this.activePointers.clear();
  }

  isPressed(direction) {
    return [...this.activePointers.values()].includes(direction);
  }

  snapshot() {
    return Object.fromEntries(
      [...DIRECTIONS].map((direction) => [direction, this.isPressed(direction)]),
    );
  }
}
