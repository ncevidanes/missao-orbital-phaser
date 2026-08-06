const REGISTRY_KEY = 'mission-orbital-synth-sound';

function defaultContextFactory() {
  const AudioContextClass = globalThis.AudioContext || globalThis.webkitAudioContext;
  return AudioContextClass ? new AudioContextClass() : null;
}

export class SynthSoundManager {
  constructor(contextFactory = defaultContextFactory) {
    this.contextFactory = contextFactory;
    this.context = null;
    this.muted = false;
  }

  unlock() {
    if (!this.context) {
      this.context = this.contextFactory();
    }

    if (this.context?.state === 'suspended') {
      this.context.resume().catch(() => {});
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  playStart() {
    this.playTone({ frequency: 330, endFrequency: 520, duration: 0.16, volume: 0.07 });
    this.playTone({ frequency: 520, endFrequency: 760, duration: 0.18, delay: 0.13, volume: 0.06 });
  }

  playCollect() {
    this.playTone({ frequency: 720, endFrequency: 1080, duration: 0.12, volume: 0.055 });
    this.playTone({ frequency: 980, endFrequency: 1320, duration: 0.1, delay: 0.07, volume: 0.045 });
  }

  playHit() {
    this.playTone({
      frequency: 145,
      endFrequency: 58,
      duration: 0.34,
      type: 'sawtooth',
      volume: 0.075,
    });
  }

  playLevelUp() {
    [440, 590, 780].forEach((frequency, index) => {
      this.playTone({ frequency, duration: 0.11, delay: index * 0.085, volume: 0.045 });
    });
  }

  playPowerUp() {
    [520, 780, 1040].forEach((frequency, index) => {
      this.playTone({
        frequency,
        endFrequency: frequency * 1.16,
        duration: 0.16,
        delay: index * 0.07,
        volume: 0.048,
      });
    });
  }

  playShieldBreak() {
    this.playTone({
      frequency: 880,
      endFrequency: 190,
      duration: 0.3,
      type: 'triangle',
      volume: 0.06,
    });
  }

  playGameOver() {
    [360, 285, 210].forEach((frequency, index) => {
      this.playTone({
        frequency,
        endFrequency: frequency * 0.78,
        duration: 0.25,
        delay: index * 0.18,
        type: 'triangle',
        volume: 0.055,
      });
    });
  }

  playTone({
    frequency,
    endFrequency = frequency,
    duration,
    delay = 0,
    type = 'sine',
    volume = 0.05,
  }) {
    if (this.muted) {
      return;
    }

    this.unlock();
    if (!this.context) {
      return;
    }

    const startAt = this.context.currentTime + delay;
    const finishAt = startAt + duration;
    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, startAt);
    oscillator.frequency.exponentialRampToValueAtTime(
      Math.max(1, endFrequency),
      finishAt,
    );

    gain.gain.setValueAtTime(0.0001, startAt);
    gain.gain.exponentialRampToValueAtTime(volume, startAt + 0.018);
    gain.gain.exponentialRampToValueAtTime(0.0001, finishAt);

    oscillator.connect(gain);
    gain.connect(this.context.destination);
    oscillator.start(startAt);
    oscillator.stop(finishAt + 0.02);
  }
}

export function getSoundManager(scene) {
  let manager = scene.registry.get(REGISTRY_KEY);
  if (!manager) {
    manager = new SynthSoundManager();
    scene.registry.set(REGISTRY_KEY, manager);
  }
  return manager;
}
