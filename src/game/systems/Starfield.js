import { RETRO_PALETTE } from '../config/RetroPalette.js';

const MAX_LEVEL = 5;
const SPEED_PER_LEVEL = 0.15;

export const STARFIELD_LAYERS = Object.freeze([
  Object.freeze({
    name: 'distant',
    count: 64,
    width: 2,
    height: 2,
    speed: 18,
    alpha: 0.34,
    colors: Object.freeze([RETRO_PALETTE.shadow, RETRO_PALETTE.dim]),
    depth: -18,
  }),
  Object.freeze({
    name: 'middle',
    count: 40,
    width: 3,
    height: 4,
    speed: 46,
    alpha: 0.68,
    colors: Object.freeze([RETRO_PALETTE.dim, RETRO_PALETTE.green]),
    depth: -17,
  }),
  Object.freeze({
    name: 'near',
    count: 20,
    width: 3,
    height: 10,
    speed: 96,
    alpha: 0.92,
    colors: Object.freeze([RETRO_PALETTE.green, RETRO_PALETTE.bright]),
    depth: -16,
  }),
]);

function clamp(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, value));
}

function randomInteger(maximum, random) {
  return Math.floor(clamp(random(), 0, 0.999999) * maximum);
}

export function getStarfieldSpeedMultiplier(level = 1) {
  const numericLevel = Number.isFinite(Number(level)) ? Number(level) : 1;
  const safeLevel = clamp(numericLevel, 1, MAX_LEVEL);
  return 1 + (safeLevel - 1) * SPEED_PER_LEVEL;
}

export function advanceStarPosition(
  star,
  deltaMs,
  { width, height, level = 1, random = Math.random },
) {
  const safeDelta = Number.isFinite(deltaMs) && deltaMs > 0 ? deltaMs : 0;
  const nextY = star.y
    + star.speed * getStarfieldSpeedMultiplier(level) * safeDelta / 1000;

  if (nextY <= height + star.height) {
    return { x: star.x, y: nextY };
  }

  return {
    x: randomInteger(width, random),
    y: -star.height,
  };
}

function drawRetroSpace(scene, width, height) {
  const background = scene.add.graphics().setDepth(-30);
  background.fillStyle(RETRO_PALETTE.void, 1);
  background.fillRect(0, 0, width, height);
  background.fillStyle(RETRO_PALETTE.deepSpace, 0.88);
  background.fillRect(0, Math.round(height * 0.15), width, Math.round(height * 0.14));
  background.fillStyle(RETRO_PALETTE.panel, 0.54);
  background.fillRect(0, Math.round(height * 0.7), width, Math.round(height * 0.12));
}

function createLayerStars(scene, layer, width, height, random) {
  return Array.from({ length: layer.count }, () => {
    const x = randomInteger(width, random);
    const y = randomInteger(height, random);
    const color = layer.colors[randomInteger(layer.colors.length, random)];
    const gameObject = scene.add.rectangle(
      x,
      y,
      layer.width,
      layer.height,
      color,
      layer.alpha,
    ).setDepth(layer.depth);

    return {
      gameObject,
      x,
      y,
      height: layer.height,
      speed: layer.speed,
    };
  });
}

export function createStarfield(scene, {
  animated = false,
  getLevel = () => 1,
  random = Math.random,
} = {}) {
  const { width, height } = scene.scale;
  drawRetroSpace(scene, width, height);

  const stars = STARFIELD_LAYERS.flatMap((layer) => (
    createLayerStars(scene, layer, width, height, random)
  ));

  const update = (_time, delta) => {
    const level = getLevel();
    stars.forEach((star) => {
      const position = advanceStarPosition(star, delta, {
        width,
        height,
        level,
        random,
      });
      star.x = position.x;
      star.y = position.y;
      star.gameObject.setPosition(Math.round(star.x), Math.round(star.y));
    });
  };

  const destroy = () => {
    scene.events.off('update', update);
  };

  if (animated) {
    scene.events.on('update', update);
  }

  scene.events.once('shutdown', destroy);

  return {
    destroy,
    getStarCount: () => stars.length,
  };
}
