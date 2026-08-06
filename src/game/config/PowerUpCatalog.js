export const POWER_UP_TYPES = Object.freeze({
  SHIELD: 'shield',
  REPAIR: 'repair',
});

export function selectPowerUpType({ lives, maxLives, randomValue = Math.random() }) {
  if (lives < maxLives && randomValue < 0.58) {
    return POWER_UP_TYPES.REPAIR;
  }

  return POWER_UP_TYPES.SHIELD;
}
