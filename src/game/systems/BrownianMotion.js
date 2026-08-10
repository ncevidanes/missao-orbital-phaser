const MAX_LEVEL = 5;

const METEOR_PROFILES = Object.freeze([
  Object.freeze({
    level: 1,
    verticalSpeed: 178,
    noiseStrength: 72,
    drag: 1.35,
    maxLateralSpeed: 72,
    minSpawnDelay: 6500,
    maxSpawnDelay: 8400,
    maxActive: 1,
  }),
  Object.freeze({
    level: 2,
    verticalSpeed: 205,
    noiseStrength: 88,
    drag: 1.28,
    maxLateralSpeed: 88,
    minSpawnDelay: 5600,
    maxSpawnDelay: 7500,
    maxActive: 1,
  }),
  Object.freeze({
    level: 3,
    verticalSpeed: 232,
    noiseStrength: 108,
    drag: 1.2,
    maxLateralSpeed: 108,
    minSpawnDelay: 4700,
    maxSpawnDelay: 6500,
    maxActive: 2,
  }),
  Object.freeze({
    level: 4,
    verticalSpeed: 264,
    noiseStrength: 128,
    drag: 1.12,
    maxLateralSpeed: 128,
    minSpawnDelay: 3900,
    maxSpawnDelay: 5500,
    maxActive: 2,
  }),
  Object.freeze({
    level: 5,
    verticalSpeed: 300,
    noiseStrength: 148,
    drag: 1.04,
    maxLateralSpeed: 148,
    minSpawnDelay: 3200,
    maxSpawnDelay: 4600,
    maxActive: 3,
  }),
]);

function clamp(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, value));
}

function normalizeRandom(randomValue) {
  const value = Number(randomValue);
  return Number.isFinite(value) ? clamp(value, 0, 0.999999) : 0.5;
}

export function getBrownianMeteorProfile(level = 1) {
  const numericLevel = Number.isFinite(Number(level)) ? Number(level) : 1;
  const safeLevel = Math.round(clamp(numericLevel, 1, MAX_LEVEL));
  return METEOR_PROFILES[safeLevel - 1];
}

export function getBrownianSpawnDelay(level = 1, random = Math.random) {
  const profile = getBrownianMeteorProfile(level);
  const randomValue = normalizeRandom(random());
  return Math.round(
    profile.minSpawnDelay
    + (profile.maxSpawnDelay - profile.minSpawnDelay) * randomValue,
  );
}

export function advanceBrownianVelocity(
  velocityX,
  deltaMs,
  profile,
  random = Math.random,
) {
  const safeVelocity = Number.isFinite(velocityX) ? velocityX : 0;
  const safeDelta = Number.isFinite(deltaMs)
    ? clamp(deltaMs, 0, 50) / 1000
    : 0;
  const randomForce = normalizeRandom(random()) * 2 - 1;
  const damping = Math.exp(-profile.drag * safeDelta);
  const impulse = randomForce * profile.noiseStrength * Math.sqrt(safeDelta);

  return clamp(
    safeVelocity * damping + impulse,
    -profile.maxLateralSpeed,
    profile.maxLateralSpeed,
  );
}
