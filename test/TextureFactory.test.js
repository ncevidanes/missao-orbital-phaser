import assert from 'node:assert/strict';
import test from 'node:test';
import { createGameTextures } from '../src/game/systems/TextureFactory.js';

function createContext() {
  const gradient = { addColorStop() {} };
  return {
    createLinearGradient: () => gradient,
    createRadialGradient: () => gradient,
    beginPath() {},
    closePath() {},
    moveTo() {},
    lineTo() {},
    arc() {},
    ellipse() {},
    fill() {},
    stroke() {},
    fillRect() {},
    strokeRect() {},
  };
}

test('generates every code-drawn texture used by version 0.4.0', () => {
  const created = [];
  const scene = {
    game: { renderer: {} },
    textures: {
      exists: (key) => created.includes(key),
      createCanvas(key) {
        created.push(key);
        return {
          getContext: createContext,
          refresh() {},
        };
      },
    },
  };

  createGameTextures(scene);

  assert.deepEqual(created, [
    'player-ship',
    'engine-flame',
    'asteroid-small',
    'asteroid-medium',
    'asteroid-large',
    'wandering-meteor',
    'crystal',
    'powerup-shield',
    'powerup-repair',
  ]);
});
