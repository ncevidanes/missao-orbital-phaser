import assert from 'node:assert/strict';
import test from 'node:test';
import {
  fitGameViewport,
  installGameViewport,
  resolveVisibleViewport,
} from '../src/game/systems/GameViewport.js';

test('uses the visual viewport instead of the larger layout viewport', () => {
  assert.deepEqual(resolveVisibleViewport({
    visualViewport: { width: 640, height: 300 },
    innerWidth: 800,
    innerHeight: 450,
  }), {
    width: 640,
    height: 300,
  });
});

test('fits the 16:9 game entirely inside a short landscape viewport', () => {
  assert.deepEqual(fitGameViewport({ width: 640, height: 300 }), {
    width: 533.3333333333333,
    height: 300,
  });

  assert.deepEqual(fitGameViewport({ width: 600, height: 500 }), {
    width: 600,
    height: 337.5,
  });
});

test('synchronizes CSS dimensions when the mobile browser viewport changes', () => {
  const properties = new Map();
  const listeners = new Map();
  const visualListeners = new Map();
  const visualViewport = {
    width: 640,
    height: 300,
    addEventListener: (event, listener) => visualListeners.set(event, listener),
    removeEventListener: (event) => visualListeners.delete(event),
  };
  const windowObject = {
    visualViewport,
    innerWidth: 800,
    innerHeight: 450,
    document: {
      documentElement: {
        style: {
          setProperty: (name, value) => properties.set(name, value),
        },
      },
    },
    addEventListener: (event, listener) => listeners.set(event, listener),
    removeEventListener: (event) => listeners.delete(event),
  };

  const removeViewportSync = installGameViewport(windowObject);

  assert.equal(properties.get('--visible-viewport-height'), '300px');
  assert.equal(properties.get('--game-viewport-width'), '533.3333333333333px');

  visualViewport.width = 720;
  visualViewport.height = 360;
  visualListeners.get('resize')();

  assert.equal(properties.get('--game-viewport-width'), '640px');
  assert.equal(properties.get('--game-viewport-height'), '360px');

  removeViewportSync();
  assert.equal(listeners.size, 0);
  assert.equal(visualListeners.size, 0);
});
