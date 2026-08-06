function withCanvasTexture(scene, key, width, height, draw) {
  if (scene.textures.exists(key)) {
    return;
  }

  const texture = scene.textures.createCanvas(key, width, height);
  const context = texture.getContext();
  draw(context, width, height);

  // Canvas textures only need an explicit upload when a renderer exists.
  // Keeping the guard also allows the scene to run in Phaser's HEADLESS mode.
  if (scene.game.renderer) {
    texture.refresh();
  }
}

function drawShip(context) {
  context.shadowColor = '#47d9ff';
  context.shadowBlur = 16;

  context.fillStyle = '#d9f7ff';
  context.beginPath();
  context.moveTo(32, 4);
  context.lineTo(58, 52);
  context.lineTo(42, 47);
  context.lineTo(32, 57);
  context.lineTo(22, 47);
  context.lineTo(6, 52);
  context.closePath();
  context.fill();

  context.fillStyle = '#2bb7ef';
  context.beginPath();
  context.moveTo(32, 10);
  context.lineTo(42, 43);
  context.lineTo(32, 38);
  context.lineTo(22, 43);
  context.closePath();
  context.fill();

  context.shadowBlur = 0;
  context.fillStyle = '#071a35';
  context.beginPath();
  context.ellipse(32, 27, 6, 11, 0, 0, Math.PI * 2);
  context.fill();

  context.strokeStyle = '#68e8ff';
  context.lineWidth = 2;
  context.stroke();
}

function drawEngineFlame(context, width) {
  const gradient = context.createLinearGradient(0, 0, 0, 32);
  gradient.addColorStop(0, '#ffffff');
  gradient.addColorStop(0.25, '#68e8ff');
  gradient.addColorStop(0.65, '#2f83ff');
  gradient.addColorStop(1, 'rgba(51, 74, 255, 0)');

  context.shadowColor = '#47d9ff';
  context.shadowBlur = 12;
  context.fillStyle = gradient;
  context.beginPath();
  context.moveTo(width / 2 - 6, 1);
  context.lineTo(width / 2 + 6, 1);
  context.lineTo(width / 2, 31);
  context.closePath();
  context.fill();
}

function drawAsteroid(context, width, height, palette, craters) {
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2 - 3;
  const gradient = context.createRadialGradient(
    centerX * 0.72,
    centerY * 0.64,
    radius * 0.12,
    centerX,
    centerY,
    radius,
  );
  gradient.addColorStop(0, palette.highlight);
  gradient.addColorStop(0.58, palette.middle);
  gradient.addColorStop(1, palette.shadow);

  context.fillStyle = gradient;
  context.strokeStyle = palette.stroke;
  context.lineWidth = 3;
  context.beginPath();
  context.moveTo(centerX - radius * 0.62, centerY - radius * 0.72);
  context.lineTo(centerX + radius * 0.08, centerY - radius);
  context.lineTo(centerX + radius * 0.72, centerY - radius * 0.64);
  context.lineTo(centerX + radius, centerY - radius * 0.04);
  context.lineTo(centerX + radius * 0.7, centerY + radius * 0.68);
  context.lineTo(centerX + radius * 0.1, centerY + radius);
  context.lineTo(centerX - radius * 0.72, centerY + radius * 0.7);
  context.lineTo(centerX - radius, centerY + radius * 0.08);
  context.closePath();
  context.fill();
  context.stroke();

  context.fillStyle = palette.crater;
  for (const crater of craters) {
    context.beginPath();
    context.ellipse(
      centerX + crater.x * radius,
      centerY + crater.y * radius,
      crater.rx * radius,
      crater.ry * radius,
      crater.angle,
      0,
      Math.PI * 2,
    );
    context.fill();
  }
}

function drawCrystal(context) {
  context.shadowColor = '#68e8ff';
  context.shadowBlur = 18;
  context.fillStyle = '#85f2ff';
  context.strokeStyle = '#e4fcff';
  context.lineWidth = 2;

  context.beginPath();
  context.moveTo(24, 2);
  context.lineTo(43, 16);
  context.lineTo(36, 40);
  context.lineTo(24, 47);
  context.lineTo(12, 40);
  context.lineTo(5, 16);
  context.closePath();
  context.fill();
  context.stroke();

  context.shadowBlur = 0;
  context.fillStyle = '#278ec8';
  context.beginPath();
  context.moveTo(24, 7);
  context.lineTo(24, 40);
  context.lineTo(10, 17);
  context.closePath();
  context.fill();
}

function drawPowerUpFrame(context, color) {
  context.shadowColor = color;
  context.shadowBlur = 16;
  context.fillStyle = '#07182e';
  context.strokeStyle = color;
  context.lineWidth = 4;
  context.beginPath();
  context.arc(26, 26, 22, 0, Math.PI * 2);
  context.fill();
  context.stroke();

  context.shadowBlur = 0;
  context.strokeStyle = '#e9fdff';
  context.lineWidth = 2;
}

function drawShieldPowerUp(context) {
  drawPowerUpFrame(context, '#68e8ff');
  context.fillStyle = '#238cc7';
  context.beginPath();
  context.moveTo(26, 10);
  context.lineTo(39, 16);
  context.lineTo(36, 34);
  context.lineTo(26, 42);
  context.lineTo(16, 34);
  context.lineTo(13, 16);
  context.closePath();
  context.fill();
  context.stroke();
}

function drawRepairPowerUp(context) {
  drawPowerUpFrame(context, '#7dff9d');
  context.fillStyle = '#55d879';
  context.fillRect(21, 11, 10, 30);
  context.fillRect(11, 21, 30, 10);
  context.strokeRect(21, 11, 10, 30);
  context.strokeRect(11, 21, 30, 10);
}

export function createGameTextures(scene) {
  withCanvasTexture(scene, 'player-ship', 64, 64, drawShip);
  withCanvasTexture(scene, 'engine-flame', 24, 34, drawEngineFlame);
  withCanvasTexture(scene, 'asteroid-small', 44, 44, (context, width, height) => {
    drawAsteroid(context, width, height, {
      highlight: '#d6a87e',
      middle: '#976340',
      shadow: '#4b2d24',
      stroke: '#e0bd9f',
      crater: '#61392a',
    }, [
      { x: -0.25, y: -0.18, rx: 0.17, ry: 0.13, angle: 0.3 },
      { x: 0.28, y: 0.25, rx: 0.22, ry: 0.17, angle: -0.4 },
    ]);
  });
  withCanvasTexture(scene, 'asteroid-medium', 64, 64, (context, width, height) => {
    drawAsteroid(context, width, height, {
      highlight: '#c68c62',
      middle: '#8b573c',
      shadow: '#4a2a23',
      stroke: '#d4a17e',
      crater: '#5c3529',
    }, [
      { x: -0.3, y: -0.22, rx: 0.2, ry: 0.16, angle: 0.2 },
      { x: 0.34, y: 0.22, rx: 0.25, ry: 0.2, angle: -0.2 },
      { x: 0.18, y: -0.48, rx: 0.12, ry: 0.1, angle: 0 },
    ]);
  });
  withCanvasTexture(scene, 'asteroid-large', 88, 88, (context, width, height) => {
    drawAsteroid(context, width, height, {
      highlight: '#9fa6b5',
      middle: '#646d7c',
      shadow: '#303744',
      stroke: '#c4ccda',
      crater: '#404855',
    }, [
      { x: -0.34, y: -0.25, rx: 0.22, ry: 0.17, angle: 0.3 },
      { x: 0.3, y: 0.3, rx: 0.27, ry: 0.2, angle: -0.3 },
      { x: 0.3, y: -0.4, rx: 0.13, ry: 0.1, angle: 0 },
      { x: -0.42, y: 0.35, rx: 0.12, ry: 0.1, angle: 0.4 },
    ]);
  });
  withCanvasTexture(scene, 'crystal', 48, 48, drawCrystal);
  withCanvasTexture(scene, 'powerup-shield', 52, 52, drawShieldPowerUp);
  withCanvasTexture(scene, 'powerup-repair', 52, 52, drawRepairPowerUp);
}
