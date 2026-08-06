export const GAME_DURATION_SECONDS = 60;
export const INITIAL_LIVES = 3;
export const MAX_LIVES = 3;
export const CRYSTAL_SCORE = 10;
export const FULL_LIFE_POWER_UP_SCORE = 20;
export const SHIELD_DURATION_MS = 8000;
export const POWER_UP_MIN_DELAY_MS = 9000;
export const POWER_UP_MAX_DELAY_MS = 13000;

const DIFFICULTY_LEVELS = Object.freeze([
  Object.freeze({
    level: 1,
    startsAt: 0,
    spawnDelay: 1080,
    minSpeed: 145,
    maxSpeed: 205,
    maxActive: 8,
  }),
  Object.freeze({
    level: 2,
    startsAt: 12,
    spawnDelay: 920,
    minSpeed: 175,
    maxSpeed: 245,
    maxActive: 10,
  }),
  Object.freeze({
    level: 3,
    startsAt: 25,
    spawnDelay: 780,
    minSpeed: 210,
    maxSpeed: 295,
    maxActive: 12,
  }),
  Object.freeze({
    level: 4,
    startsAt: 38,
    spawnDelay: 660,
    minSpeed: 250,
    maxSpeed: 350,
    maxActive: 14,
  }),
  Object.freeze({
    level: 5,
    startsAt: 50,
    spawnDelay: 550,
    minSpeed: 295,
    maxSpeed: 405,
    maxActive: 16,
  }),
]);

export function getDifficulty(elapsedSeconds) {
  const safeElapsed = Number.isFinite(elapsedSeconds)
    ? Math.max(0, elapsedSeconds)
    : 0;

  return DIFFICULTY_LEVELS.reduce(
    (selected, candidate) => (
      safeElapsed >= candidate.startsAt ? candidate : selected
    ),
    DIFFICULTY_LEVELS[0],
  );
}
