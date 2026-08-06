import assert from 'node:assert/strict';
import test from 'node:test';
import { resolveMovementAxes } from '../src/game/systems/MovementInput.js';
import {
  shouldShowTouchControls,
  TouchDirectionState,
} from '../src/game/systems/TouchDirectionState.js';

test('combines keyboard and touch input into one movement direction', () => {
  const keyboard = {
    up: { isDown: true },
    left: { isDown: false },
    down: { isDown: false },
    right: { isDown: false },
  };
  const touch = { right: true };

  assert.deepEqual(resolveMovementAxes(keyboard, touch), {
    horizontal: 1,
    vertical: -1,
  });
});

test('opposite directions cancel each other safely', () => {
  assert.deepEqual(resolveMovementAxes({ left: true, right: true }), {
    horizontal: 0,
    vertical: 0,
  });
});

test('tracks multiple touch pointers for diagonal movement', () => {
  const state = new TouchDirectionState();
  state.press('up', 1);
  state.press('right', 2);

  assert.deepEqual(resolveMovementAxes(state.snapshot()), {
    horizontal: 1,
    vertical: -1,
  });

  state.release(1);
  assert.equal(state.snapshot().up, false);
  assert.equal(state.snapshot().right, true);
});

test('shows mobile controls for touch or coarse-pointer devices', () => {
  assert.equal(shouldShowTouchControls({ maxTouchPoints: 2 }), true);
  assert.equal(shouldShowTouchControls({ coarsePointer: true }), true);
  assert.equal(shouldShowTouchControls(), false);
});
