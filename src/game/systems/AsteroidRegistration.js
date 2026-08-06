export function addFallingAsteroid(group, asteroid, speed) {
  group.add(asteroid);
  asteroid.startFalling(speed);
  return asteroid;
}
