import assert from 'node:assert/strict';
import test from 'node:test';
import { HighScoreRepository } from '../src/game/systems/HighScoreRepository.js';

function createStorage(initialValue = null) {
  let value = initialValue;
  return {
    getItem: () => value,
    setItem: (_key, nextValue) => {
      value = nextValue;
    },
  };
}

test('persists only a score that beats the previous record', () => {
  const repository = new HighScoreRepository(createStorage('30'));

  assert.deepEqual(repository.save(20), { highScore: 30, isNewRecord: false });
  assert.deepEqual(repository.save(40), { highScore: 40, isNewRecord: true });
  assert.equal(repository.read(), 40);
});

test('sanitizes invalid scores and survives unavailable storage', () => {
  const blockedStorage = {
    getItem: () => { throw new Error('blocked'); },
    setItem: () => { throw new Error('blocked'); },
  };
  const repository = new HighScoreRepository(blockedStorage);

  assert.equal(repository.read(), 0);
  assert.deepEqual(repository.save(Number.NaN), { highScore: 0, isNewRecord: false });
});
