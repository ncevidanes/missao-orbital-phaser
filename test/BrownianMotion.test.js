import assert from 'node:assert/strict';
import test from 'node:test';
import {
  advanceBrownianVelocity,
  getBrownianMeteorProfile,
  getBrownianSpawnDelay,
} from '../src/game/systems/BrownianMotion.js';

test('makes wandering meteors faster and less frequent at early levels', () => {
  const first = getBrownianMeteorProfile(1);
  const last = getBrownianMeteorProfile(5);

  assert.ok(last.verticalSpeed > first.verticalSpeed);
  assert.ok(last.noiseStrength > first.noiseStrength);
  assert.ok(last.maxLateralSpeed > first.maxLateralSpeed);
  assert.ok(last.minSpawnDelay < first.minSpawnDelay);
  assert.ok(last.maxActive > first.maxActive);
});

test('selects a deterministic spawn delay inside the configured range', () => {
  const profile = getBrownianMeteorProfile(3);

  assert.equal(getBrownianSpawnDelay(3, () => 0), profile.minSpawnDelay);
  assert.equal(
    getBrownianSpawnDelay(3, () => 0.999999),
    profile.maxSpawnDelay,
  );
});

test('adds frame-rate-aware random impulses without abrupt direction changes', () => {
  const profile = getBrownianMeteorProfile(1);
  const stillMovingRight = advanceBrownianVelocity(60, 16, profile, () => 0);
  const pushedRight = advanceBrownianVelocity(0, 50, profile, () => 1);
  const pushedLeft = advanceBrownianVelocity(0, 50, profile, () => 0);

  assert.ok(stillMovingRight > 0);
  assert.ok(pushedRight > 0);
  assert.ok(pushedLeft < 0);
  assert.ok(Math.abs(pushedRight) <= profile.maxLateralSpeed);
  assert.ok(Math.abs(pushedLeft) <= profile.maxLateralSpeed);
});

test('clamps invalid levels and ignores invalid or paused frame durations', () => {
  assert.equal(getBrownianMeteorProfile(-10).level, 1);
  assert.equal(getBrownianMeteorProfile(99).level, 5);

  const profile = getBrownianMeteorProfile(2);
  assert.equal(advanceBrownianVelocity(25, 0, profile, () => 1), 25);
  assert.equal(advanceBrownianVelocity(Number.NaN, Number.NaN, profile), 0);
});
