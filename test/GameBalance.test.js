import assert from 'node:assert/strict';
import test from 'node:test';
import { getDifficulty } from '../src/game/config/GameBalance.js';

test('starts at level one and progresses through all five levels', () => {
  assert.equal(getDifficulty(0).level, 1);
  assert.equal(getDifficulty(11).level, 1);
  assert.equal(getDifficulty(12).level, 2);
  assert.equal(getDifficulty(25).level, 3);
  assert.equal(getDifficulty(38).level, 4);
  assert.equal(getDifficulty(50).level, 5);
  assert.equal(getDifficulty(999).level, 5);
});

test('higher levels spawn faster and move asteroids faster', () => {
  const first = getDifficulty(0);
  const last = getDifficulty(60);

  assert.ok(last.spawnDelay < first.spawnDelay);
  assert.ok(last.minSpeed > first.minSpeed);
  assert.ok(last.maxSpeed > first.maxSpeed);
  assert.ok(last.maxActive > first.maxActive);
});

test('invalid elapsed time safely falls back to level one', () => {
  assert.equal(getDifficulty(Number.NaN).level, 1);
  assert.equal(getDifficulty(-10).level, 1);
});
