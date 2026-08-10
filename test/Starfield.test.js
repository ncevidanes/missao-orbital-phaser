import assert from 'node:assert/strict';
import test from 'node:test';
import {
  advanceStarPosition,
  getStarfieldSpeedMultiplier,
  STARFIELD_LAYERS,
} from '../src/game/systems/Starfield.js';

test('uses three parallax layers with increasing speed and visible trails', () => {
  assert.deepEqual(STARFIELD_LAYERS.map(({ name }) => name), [
    'distant',
    'middle',
    'near',
  ]);
  assert.ok(STARFIELD_LAYERS[0].speed < STARFIELD_LAYERS[1].speed);
  assert.ok(STARFIELD_LAYERS[1].speed < STARFIELD_LAYERS[2].speed);
  assert.ok(STARFIELD_LAYERS[2].height > STARFIELD_LAYERS[0].height);
});

test('increases forward motion progressively across all five levels', () => {
  assert.equal(getStarfieldSpeedMultiplier(1), 1);
  assert.equal(getStarfieldSpeedMultiplier(3), 1.3);
  assert.equal(getStarfieldSpeedMultiplier(5), 1.6);
  assert.equal(getStarfieldSpeedMultiplier(99), 1.6);
});

test('moves stars downward and wraps them to a new horizontal position', () => {
  const star = { x: 20, y: 10, speed: 50, height: 4 };
  assert.deepEqual(advanceStarPosition(star, 1000, {
    width: 100,
    height: 100,
    level: 1,
  }), { x: 20, y: 60 });

  assert.deepEqual(advanceStarPosition({ ...star, y: 100 }, 1000, {
    width: 100,
    height: 100,
    level: 1,
    random: () => 0.75,
  }), { x: 75, y: -4 });
});
