import assert from 'node:assert/strict';
import test from 'node:test';
import {
  POWER_UP_TYPES,
  selectPowerUpType,
} from '../src/game/config/PowerUpCatalog.js';

test('prioritizes repair when a life is missing', () => {
  assert.equal(
    selectPowerUpType({ lives: 2, maxLives: 3, randomValue: 0.4 }),
    POWER_UP_TYPES.REPAIR,
  );
});

test('does not offer repair while lives are full', () => {
  assert.equal(
    selectPowerUpType({ lives: 3, maxLives: 3, randomValue: 0 }),
    POWER_UP_TYPES.SHIELD,
  );
});
