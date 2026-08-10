const PHOSPHOR = Object.freeze({
  black: '#010401',
  dark: '#061d0b',
  shadow: '#0b3217',
  dim: '#17843b',
  green: '#39ff70',
  bright: '#b8ffca',
});

function withCanvasTexture(scene, key, width, height, draw) {
  if (scene.textures.exists(key)) {
    return;
  }

  const texture = scene.textures.createCanvas(key, width, height);
  const context = texture.getContext();
  context.imageSmoothingEnabled = false;
  draw(context, width, height);

  // Canvas textures only need an explicit upload when a renderer exists.
  // Keeping the guard also allows the scene to run in Phaser's HEADLESS mode.
  if (scene.game.renderer) {
    texture.refresh();
  }
}

function drawShip(context) {
  context.shadowColor = PHOSPHOR.green;
  context.shadowBlur = 9;

  context.fillStyle = PHOSPHOR.bright;
  context.fillRect(28, 4, 8, 8);
  context.fillRect(24, 12, 16, 8);
  context.fillRect(20, 20, 24, 20);
  context.fillRect(12, 32, 40, 12);
  context.fillRect(8, 40, 16, 12);
  context.fillRect(40, 40, 16, 12);
  context.fillRect(24, 40, 16, 16);

  context.shadowBlur = 0;
  context.fillStyle = PHOSPHOR.green;
  context.fillRect(28, 12, 8, 12);
  context.fillRect(24, 24, 16, 20);
  context.fillRect(16, 36, 8, 8);
  context.fillRect(40, 36, 8, 8);

  context.fillStyle = PHOSPHOR.black;
  context.fillRect(28, 24, 8, 12);
  context.fillStyle = PHOSPHOR.dim;
  context.fillRect(28, 24, 4, 8);
}

function drawEngineFlame(context) {
  context.shadowColor = PHOSPHOR.green;
  context.shadowBlur = 8;
  context.fillStyle = PHOSPHOR.bright;
  context.fillRect(8, 0, 8, 8);
  context.fillStyle = PHOSPHOR.green;
  context.fillRect(6, 8, 12, 8);
  context.fillRect(8, 16, 8, 8);
  context.fillStyle = PHOSPHOR.dim;
  context.fillRect(10, 24, 4, 8);
}

const ASTEROID_ROWS = Object.freeze([
  Object.freeze([3, 5]),
  Object.freeze([2, 7]),
  Object.freeze([1, 9]),
  Object.freeze([1, 9]),
  Object.freeze([0, 11]),
  Object.freeze([0, 11]),
  Object.freeze([1, 9]),
  Object.freeze([1, 9]),
  Object.freeze([2, 7]),
  Object.freeze([3, 5]),
]);

function drawPixelAsteroid(context, width, height, craters) {
  const cell = Math.max(4, Math.floor(width / 11));
  const shapeWidth = cell * 11;
  const shapeHeight = cell * ASTEROID_ROWS.length;
  const originX = Math.floor((width - shapeWidth) / 2);
  const originY = Math.floor((height - shapeHeight) / 2);

  context.shadowColor = PHOSPHOR.green;
  context.shadowBlur = Math.max(4, Math.round(cell * 0.7));

  ASTEROID_ROWS.forEach(([start, length], rowIndex) => {
    const x = originX + start * cell;
    const y = originY + rowIndex * cell;
    context.fillStyle = PHOSPHOR.green;
    context.fillRect(x, y, length * cell, cell);

    if (rowIndex > 0 && rowIndex < ASTEROID_ROWS.length - 1 && length > 2) {
      context.fillStyle = rowIndex < 4 ? PHOSPHOR.dim : PHOSPHOR.shadow;
      context.fillRect(x + cell, y, (length - 2) * cell, cell);
    }
  });

  context.shadowBlur = 0;
  craters.forEach(([x, y, craterWidth = 1, craterHeight = 1]) => {
    context.fillStyle = PHOSPHOR.black;
    context.fillRect(
      originX + x * cell,
      originY + y * cell,
      craterWidth * cell,
      craterHeight * cell,
    );
    context.fillStyle = PHOSPHOR.dim;
    context.fillRect(originX + x * cell, originY + y * cell, cell, cell);
  });
}

function drawWanderingMeteor(context) {
  context.shadowColor = PHOSPHOR.green;
  context.shadowBlur = 10;

  context.fillStyle = PHOSPHOR.dim;
  context.fillRect(22, 0, 4, 12);
  context.fillRect(18, 12, 8, 8);
  context.fillRect(22, 20, 8, 8);
  context.fillStyle = PHOSPHOR.green;
  context.fillRect(18, 24, 12, 12);

  context.fillStyle = PHOSPHOR.bright;
  context.fillRect(14, 36, 20, 20);
  context.fillRect(18, 32, 12, 28);
  context.fillRect(10, 40, 28, 12);

  context.shadowBlur = 0;
  context.fillStyle = PHOSPHOR.green;
  context.fillRect(18, 40, 12, 12);
  context.fillStyle = PHOSPHOR.black;
  context.fillRect(22, 44, 8, 8);
  context.fillStyle = PHOSPHOR.dim;
  context.fillRect(22, 44, 4, 4);
}

function drawCrystal(context) {
  context.shadowColor = PHOSPHOR.green;
  context.shadowBlur = 10;
  context.fillStyle = PHOSPHOR.bright;
  context.fillRect(20, 4, 8, 4);
  context.fillRect(16, 8, 16, 4);
  context.fillRect(12, 12, 24, 8);
  context.fillRect(8, 20, 32, 8);
  context.fillRect(12, 28, 24, 8);
  context.fillRect(16, 36, 16, 4);
  context.fillRect(20, 40, 8, 4);

  context.shadowBlur = 0;
  context.fillStyle = PHOSPHOR.dim;
  context.fillRect(16, 16, 8, 16);
  context.fillRect(24, 12, 4, 24);
  context.fillStyle = PHOSPHOR.black;
  context.fillRect(28, 20, 8, 8);
}

function drawPowerUpFrame(context) {
  context.shadowColor = PHOSPHOR.green;
  context.shadowBlur = 9;
  context.fillStyle = PHOSPHOR.dark;
  context.fillRect(4, 4, 44, 44);
  context.fillStyle = PHOSPHOR.green;
  context.fillRect(4, 4, 16, 4);
  context.fillRect(32, 4, 16, 4);
  context.fillRect(4, 44, 16, 4);
  context.fillRect(32, 44, 16, 4);
  context.fillRect(4, 8, 4, 12);
  context.fillRect(44, 8, 4, 12);
  context.fillRect(4, 32, 4, 12);
  context.fillRect(44, 32, 4, 12);
  context.shadowBlur = 0;
}

function drawShieldPowerUp(context) {
  drawPowerUpFrame(context);
  context.fillStyle = PHOSPHOR.bright;
  context.fillRect(18, 14, 16, 4);
  context.fillRect(14, 18, 24, 12);
  context.fillRect(18, 30, 16, 8);
  context.fillRect(22, 38, 8, 4);
  context.fillStyle = PHOSPHOR.dim;
  context.fillRect(22, 18, 12, 12);
}

function drawRepairPowerUp(context) {
  drawPowerUpFrame(context);
  context.fillStyle = PHOSPHOR.bright;
  context.fillRect(22, 12, 8, 28);
  context.fillRect(12, 22, 28, 8);
  context.fillStyle = PHOSPHOR.green;
  context.fillRect(22, 22, 8, 8);
}

export function createGameTextures(scene) {
  withCanvasTexture(scene, 'player-ship', 64, 64, drawShip);
  withCanvasTexture(scene, 'engine-flame', 24, 34, drawEngineFlame);
  withCanvasTexture(scene, 'asteroid-small', 44, 44, (context, width, height) => {
    drawPixelAsteroid(context, width, height, [
      [3, 3],
      [7, 6, 2],
    ]);
  });
  withCanvasTexture(scene, 'asteroid-medium', 64, 64, (context, width, height) => {
    drawPixelAsteroid(context, width, height, [
      [3, 3, 2],
      [7, 6, 2, 2],
      [6, 2],
    ]);
  });
  withCanvasTexture(scene, 'asteroid-large', 88, 88, (context, width, height) => {
    drawPixelAsteroid(context, width, height, [
      [3, 3, 2, 2],
      [7, 6, 2, 2],
      [7, 2],
      [2, 7],
    ]);
  });
  withCanvasTexture(scene, 'wandering-meteor', 48, 64, drawWanderingMeteor);
  withCanvasTexture(scene, 'crystal', 48, 48, drawCrystal);
  withCanvasTexture(scene, 'powerup-shield', 52, 52, drawShieldPowerUp);
  withCanvasTexture(scene, 'powerup-repair', 52, 52, drawRepairPowerUp);
}
