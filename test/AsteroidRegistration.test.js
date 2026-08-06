import assert from 'node:assert/strict';
import test from 'node:test';
import { addFallingAsteroid } from '../src/game/systems/AsteroidRegistration.js';

test('starts asteroid motion after the physics group applies its defaults', () => {
  const calls = [];
  const asteroid = {
    speed: null,
    startFalling(speed) {
      calls.push('startFalling');
      this.speed = speed;
    },
  };
  const group = {
    add(child) {
      calls.push('group.add');
      child.speed = 0;
    },
  };

  const result = addFallingAsteroid(group, asteroid, 180);

  assert.equal(result, asteroid);
  assert.equal(asteroid.speed, 180);
  assert.deepEqual(calls, ['group.add', 'startFalling']);
});
