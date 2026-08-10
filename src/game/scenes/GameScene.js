import Phaser from 'phaser';
import { selectAsteroidVariant } from '../config/AsteroidCatalog.js';
import {
  CRYSTAL_SCORE,
  FULL_LIFE_POWER_UP_SCORE,
  GAME_DURATION_SECONDS,
  getDifficulty,
  INITIAL_LIVES,
  MAX_LIVES,
  POWER_UP_MAX_DELAY_MS,
  POWER_UP_MIN_DELAY_MS,
  SHIELD_DURATION_MS,
} from '../config/GameBalance.js';
import { POWER_UP_TYPES, selectPowerUpType } from '../config/PowerUpCatalog.js';
import { Asteroid } from '../entities/Asteroid.js';
import { Crystal } from '../entities/Crystal.js';
import { Player } from '../entities/Player.js';
import { PowerUp } from '../entities/PowerUp.js';
import { WanderingMeteor } from '../entities/WanderingMeteor.js';
import { addFallingAsteroid } from '../systems/AsteroidRegistration.js';
import {
  getBrownianMeteorProfile,
  getBrownianSpawnDelay,
} from '../systems/BrownianMotion.js';
import { createExplosion, createPickupBurst } from '../systems/ExplosionEffect.js';
import { HighScoreRepository } from '../systems/HighScoreRepository.js';
import { ShieldAura } from '../systems/ShieldAura.js';
import { ShieldController } from '../systems/ShieldController.js';
import { ShipAnimator } from '../systems/ShipAnimator.js';
import { createStarfield } from '../systems/Starfield.js';
import { getSoundManager } from '../systems/SynthSoundManager.js';
import { createGameTextures } from '../systems/TextureFactory.js';
import { Hud } from '../ui/Hud.js';
import { TouchControls } from '../ui/TouchControls.js';

export class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  init() {
    this.score = 0;
    this.lives = INITIAL_LIVES;
    this.remainingTime = GAME_DURATION_SECONDS;
    this.invulnerable = false;
    this.gameEnded = false;
    this.difficulty = getDifficulty(0);
    this.shieldController = new ShieldController();
    this.shieldWasActive = false;
    this.meteorWarningShown = false;
  }

  create() {
    createGameTextures(this);
    createStarfield(this, {
      animated: true,
      getLevel: () => this.difficulty.level,
    });

    const { width, height } = this.scale;
    this.highScoreRepository = new HighScoreRepository();
    this.highScore = this.highScoreRepository.read();
    this.soundManager = getSoundManager(this);
    this.player = new Player(this, width / 2, height - 92);
    this.shipAnimator = new ShipAnimator(this, this.player);
    this.shieldAura = new ShieldAura(this, this.player);
    this.asteroids = this.physics.add.group();
    this.meteors = this.physics.add.group();
    this.crystals = this.physics.add.group();
    this.powerUps = this.physics.add.group();
    this.hud = new Hud(this, {
      onToggleSound: () => this.toggleSound(),
      soundMuted: this.soundManager.muted,
    });

    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });
    this.restartKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    this.menuKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
    this.touchControls = new TouchControls(this, {
      onMenu: () => this.returnToMenu(),
    });

    this.physics.add.overlap(
      this.player,
      this.asteroids,
      this.handleAsteroidHit,
      undefined,
      this,
    );
    this.physics.add.overlap(
      this.player,
      this.meteors,
      this.handleAsteroidHit,
      undefined,
      this,
    );
    this.physics.add.overlap(
      this.player,
      this.crystals,
      this.collectCrystal,
      undefined,
      this,
    );
    this.physics.add.overlap(
      this.player,
      this.powerUps,
      this.collectPowerUp,
      undefined,
      this,
    );

    this.clockTimer = this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: this.tickClock,
      callbackScope: this,
    });

    this.spawnAsteroid();
    this.scheduleNextAsteroid();
    this.scheduleNextMeteor(3600);
    this.spawnCrystal();
    this.scheduleNextPowerUp();
    this.updateHud();
    this.cameras.main.fadeIn(250, 1, 4, 1);
  }

  update(_time, delta) {
    if (Phaser.Input.Keyboard.JustDown(this.menuKey)) {
      this.returnToMenu();
      return;
    }

    if (this.gameEnded) {
      if (Phaser.Input.Keyboard.JustDown(this.restartKey)) {
        this.restartGame();
      }
      return;
    }

    this.player.move(this.cursors, this.wasd, this.touchControls.getMovement());
    this.shipAnimator.update(this.player, delta);
    const shieldActive = this.shieldController.isActive(this.time.now);
    this.shieldAura.update(this.player, shieldActive);
    if (this.shieldWasActive && !shieldActive) {
      this.updateHud();
    }
    this.shieldWasActive = shieldActive;
    this.updateWanderingMeteors(delta);
    this.destroyOffscreenHazards();
  }

  scheduleNextAsteroid() {
    if (this.gameEnded) {
      return;
    }

    this.asteroidTimer = this.time.delayedCall(
      this.difficulty.spawnDelay,
      () => {
        this.spawnAsteroid();
        this.scheduleNextAsteroid();
      },
    );
  }

  spawnAsteroid() {
    if (
      this.gameEnded
      || this.asteroids.countActive(true) >= this.difficulty.maxActive
    ) {
      return;
    }

    const speed = Phaser.Math.Between(
      this.difficulty.minSpeed,
      this.difficulty.maxSpeed,
    );
    const x = Phaser.Math.Between(54, this.scale.width - 54);
    const variant = selectAsteroidVariant(Phaser.Math.FloatBetween(0, 1));
    const asteroid = new Asteroid(this, x, -70, variant);
    addFallingAsteroid(this.asteroids, asteroid, speed);
  }

  scheduleNextMeteor(delay = getBrownianSpawnDelay(this.difficulty.level)) {
    if (this.gameEnded) {
      return;
    }

    this.meteorTimer = this.time.delayedCall(delay, () => {
      this.spawnMeteor();
      this.scheduleNextMeteor();
    });
  }

  spawnMeteor() {
    const profile = getBrownianMeteorProfile(this.difficulty.level);
    if (
      this.gameEnded
      || this.meteors.countActive(true) >= profile.maxActive
    ) {
      return;
    }

    const meteor = new WanderingMeteor(
      this,
      Phaser.Math.Between(70, this.scale.width - 70),
      -74,
      profile,
    );
    this.meteors.add(meteor);
    meteor.startDrifting();

    if (!this.meteorWarningShown) {
      this.meteorWarningShown = true;
      this.hud.showPowerUp('> ALERTA: METEORO ERRANTE', '#39ff70');
    }
  }

  scheduleNextPowerUp() {
    if (this.gameEnded) {
      return;
    }

    this.powerUpTimer = this.time.delayedCall(
      Phaser.Math.Between(POWER_UP_MIN_DELAY_MS, POWER_UP_MAX_DELAY_MS),
      () => {
        this.spawnPowerUp();
        this.scheduleNextPowerUp();
      },
    );
  }

  spawnPowerUp() {
    if (this.gameEnded || this.powerUps.countActive(true) > 0) {
      return;
    }

    const powerUpType = selectPowerUpType({
      lives: this.lives,
      maxLives: MAX_LIVES,
      randomValue: Phaser.Math.FloatBetween(0, 1),
    });
    const powerUp = new PowerUp(
      this,
      Phaser.Math.Between(90, this.scale.width - 90),
      Phaser.Math.Between(155, this.scale.height - 145),
      powerUpType,
    );
    this.powerUps.add(powerUp);
  }

  spawnCrystal() {
    if (this.gameEnded || this.crystals.countActive(true) > 0) {
      return;
    }

    const crystal = new Crystal(
      this,
      Phaser.Math.Between(80, this.scale.width - 80),
      Phaser.Math.Between(115, this.scale.height - 110),
    );
    this.crystals.add(crystal);
  }

  handleAsteroidHit(_player, asteroid) {
    if (this.invulnerable || this.gameEnded) {
      return;
    }

    const impactX = asteroid.x;
    const impactY = asteroid.y;
    asteroid.destroy();

    if (this.shieldController.consume(this.time.now)) {
      this.invulnerable = true;
      this.shieldAura.hide();
      createExplosion(this, impactX, impactY, 0x39ff70);
      this.soundManager.playShieldBreak();
      this.cameras.main.shake(120, 0.004);
      this.hud.showPowerUp('ESCUDO ABSORVEU O IMPACTO');
      this.updateHud();
      this.time.delayedCall(320, () => {
        this.invulnerable = false;
      });
      return;
    }

    this.invulnerable = true;
    createExplosion(this, impactX, impactY);
    this.soundManager.playHit();
    this.cameras.main.shake(210, 0.008);
    this.lives -= 1;
    this.updateHud();

    if (this.lives <= 0) {
      this.player.setAlpha(0);
      this.shipAnimator.stop();
      this.shieldAura.hide();
      createExplosion(this, this.player.x, this.player.y, 0x39ff70);
      this.endGame('Você ficou sem vidas.');
      return;
    }

    this.player.resetPosition(this.scale.width / 2, this.scale.height - 92);
    this.tweens.add({
      targets: this.player,
      alpha: 0.2,
      duration: 110,
      yoyo: true,
      repeat: 5,
      onComplete: () => {
        this.player.setAlpha(1);
        this.invulnerable = false;
      },
    });
  }

  collectCrystal(_player, crystal) {
    if (this.gameEnded) {
      return;
    }

    const { x, y } = crystal;
    crystal.destroy();
    createPickupBurst(this, x, y);
    this.soundManager.playCollect();
    this.score += CRYSTAL_SCORE;
    this.highScore = Math.max(this.highScore, this.score);
    this.updateHud();
    this.time.delayedCall(450, this.spawnCrystal, undefined, this);
  }

  collectPowerUp(_player, powerUp) {
    if (this.gameEnded) {
      return;
    }

    const { x, y, powerUpType } = powerUp;
    powerUp.destroy();
    this.soundManager.playPowerUp();

    if (powerUpType === POWER_UP_TYPES.REPAIR) {
      if (this.lives < MAX_LIVES) {
        this.lives += 1;
        this.hud.showPowerUp('VIDA RECUPERADA', '#b8ffca');
      } else {
        this.score += FULL_LIFE_POWER_UP_SCORE;
        this.highScore = Math.max(this.highScore, this.score);
        this.hud.showPowerUp(`VIDAS CHEIAS: +${FULL_LIFE_POWER_UP_SCORE}`, '#b8ffca');
      }
      createPickupBurst(this, x, y, 0xb8ffca);
    } else {
      this.shieldController.activate(this.time.now, SHIELD_DURATION_MS);
      this.shieldWasActive = true;
      this.hud.showPowerUp('ESCUDO ATIVADO');
      createPickupBurst(this, x, y, 0x39ff70);
    }

    this.updateHud();
  }

  tickClock() {
    if (this.gameEnded) {
      return;
    }

    this.remainingTime = Math.max(0, this.remainingTime - 1);
    const elapsedSeconds = GAME_DURATION_SECONDS - this.remainingTime;
    const nextDifficulty = getDifficulty(elapsedSeconds);

    if (nextDifficulty.level !== this.difficulty.level) {
      this.difficulty = nextDifficulty;
      this.hud.showLevelUp(this.difficulty.level);
      this.soundManager.playLevelUp();
    }

    this.updateHud();

    if (this.remainingTime <= 0) {
      this.endGame('Tempo esgotado.');
    }
  }

  updateWanderingMeteors(delta) {
    this.meteors.getChildren().forEach((meteor) => {
      if (meteor.active) {
        meteor.updateBrownian(delta);
      }
    });
  }

  destroyOffscreenHazards() {
    this.asteroids.getChildren().forEach((asteroid) => {
      if (asteroid.active && asteroid.y > this.scale.height + 80) {
        asteroid.destroy();
      }
    });
    this.meteors.getChildren().forEach((meteor) => {
      if (meteor.active && meteor.y > this.scale.height + 90) {
        meteor.destroy();
      }
    });
  }

  toggleSound() {
    const muted = this.soundManager.toggleMute();
    this.hud.setSoundMuted(muted);
    if (!muted) {
      this.soundManager.unlock();
      this.soundManager.playCollect();
    }
  }

  updateHud() {
    this.hud.update({
      score: this.score,
      lives: this.lives,
      remainingTime: this.remainingTime,
      level: this.difficulty.level,
      highScore: this.highScore,
      shieldSeconds: this.shieldController.remainingSeconds(this.time.now),
    });
  }

  endGame(reason) {
    if (this.gameEnded) {
      return;
    }

    this.gameEnded = true;
    this.invulnerable = true;
    this.asteroidTimer?.remove(false);
    this.meteorTimer?.remove(false);
    this.powerUpTimer?.remove(false);
    this.clockTimer?.remove(false);
    this.player.stop();
    this.touchControls.setVisible(false);
    this.shipAnimator.stop();
    this.shieldAura.hide();
    this.player.body.enable = false;

    this.asteroids.getChildren().forEach((asteroid) => {
      if (asteroid.active) {
        asteroid.setVelocity(0, 0);
        asteroid.setAngularVelocity(0);
      }
    });

    this.meteors.getChildren().forEach((meteor) => {
      if (meteor.active) {
        meteor.setVelocity(0, 0);
      }
    });

    this.powerUps.getChildren().forEach((powerUp) => {
      if (powerUp.active) {
        powerUp.body.enable = false;
      }
    });

    const record = this.highScoreRepository.save(this.score);
    this.highScore = record.highScore;
    this.soundManager.playGameOver();
    this.hud.showGameOver({
      score: this.score,
      highScore: record.highScore,
      isNewRecord: record.isNewRecord,
      reason,
      onRestart: () => this.restartGame(),
      onMenu: () => this.returnToMenu(),
    });
  }

  restartGame() {
    this.soundManager.playStart();
    this.scene.restart();
  }

  returnToMenu() {
    this.scene.start('MenuScene');
  }
}
