import assert from 'node:assert/strict';
import test from 'node:test';
import { SynthSoundManager } from '../src/game/systems/SynthSoundManager.js';

function createFakeAudioContext() {
  const starts = [];
  const frequency = {
    setValueAtTime() {},
    exponentialRampToValueAtTime() {},
  };
  const gainValue = {
    setValueAtTime() {},
    exponentialRampToValueAtTime() {},
  };

  return {
    state: 'running',
    currentTime: 2,
    destination: {},
    starts,
    createOscillator() {
      return {
        frequency,
        connect() {},
        start(at) { starts.push(at); },
        stop() {},
      };
    },
    createGain() {
      return { gain: gainValue, connect() {} };
    },
  };
}

test('synthesizes collection tones and respects mute state', () => {
  const context = createFakeAudioContext();
  const manager = new SynthSoundManager(() => context);

  manager.playCollect();
  assert.equal(context.starts.length, 2);

  assert.equal(manager.toggleMute(), true);
  manager.playHit();
  assert.equal(context.starts.length, 2);

  assert.equal(manager.toggleMute(), false);
  manager.playHit();
  assert.equal(context.starts.length, 3);
});
