import assert from 'node:assert/strict';
import test from 'node:test';
import {
  getAsteroidVariants,
  selectAsteroidVariant,
} from '../src/game/config/AsteroidCatalog.js';

test('selects all three asteroid variants from their weighted ranges', () => {
  assert.equal(selectAsteroidVariant(0).id, 'small');
  assert.equal(selectAsteroidVariant(0.299).id, 'small');
  assert.equal(selectAsteroidVariant(0.3).id, 'medium');
  assert.equal(selectAsteroidVariant(0.799).id, 'medium');
  assert.equal(selectAsteroidVariant(0.8).id, 'large');
  assert.equal(selectAsteroidVariant(0.999).id, 'large');
});

test('smaller asteroids are faster and large asteroids have larger bodies', () => {
  const [small, medium, large] = getAsteroidVariants();

  assert.ok(small.speedMultiplier > medium.speedMultiplier);
  assert.ok(medium.speedMultiplier > large.speedMultiplier);
  assert.ok(small.bodyRadius < medium.bodyRadius);
  assert.ok(medium.bodyRadius < large.bodyRadius);
});
