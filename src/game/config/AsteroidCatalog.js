const VARIANTS = Object.freeze([
  Object.freeze({
    id: 'small',
    texture: 'asteroid-small',
    weight: 0.3,
    speedMultiplier: 1.28,
    angularSpeed: 150,
    bodyRadius: 17,
    bodyOffset: 5,
  }),
  Object.freeze({
    id: 'medium',
    texture: 'asteroid-medium',
    weight: 0.5,
    speedMultiplier: 1,
    angularSpeed: 105,
    bodyRadius: 27,
    bodyOffset: 5,
  }),
  Object.freeze({
    id: 'large',
    texture: 'asteroid-large',
    weight: 0.2,
    speedMultiplier: 0.76,
    angularSpeed: 65,
    bodyRadius: 38,
    bodyOffset: 6,
  }),
]);

export function getAsteroidVariants() {
  return VARIANTS;
}

export function selectAsteroidVariant(randomValue = Math.random()) {
  const safeValue = Number.isFinite(randomValue)
    ? Math.min(Math.max(randomValue, 0), 0.999999)
    : 0;
  let accumulatedWeight = 0;

  for (const variant of VARIANTS) {
    accumulatedWeight += variant.weight;
    if (safeValue < accumulatedWeight) {
      return variant;
    }
  }

  return VARIANTS.at(-1);
}
