import assert from 'node:assert/strict';
import test from 'node:test';
import { ShieldController } from '../src/game/systems/ShieldController.js';

test('activates for a limited duration and reports whole remaining seconds', () => {
  const shield = new ShieldController();

  shield.activate(1000, 8000);

  assert.equal(shield.isActive(1000), true);
  assert.equal(shield.remainingSeconds(1500), 8);
  assert.equal(shield.remainingSeconds(8999), 1);
  assert.equal(shield.isActive(9000), false);
  assert.equal(shield.remainingSeconds(9000), 0);
});

test('consumes exactly one active shield', () => {
  const shield = new ShieldController();

  shield.activate(0, 8000);

  assert.equal(shield.consume(100), true);
  assert.equal(shield.consume(101), false);
  assert.equal(shield.isActive(101), false);
});
