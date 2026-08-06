export class ShieldController {
  constructor() {
    this.expiresAt = 0;
  }

  activate(now, durationMs) {
    const safeNow = Number.isFinite(now) ? Math.max(0, now) : 0;
    const safeDuration = Number.isFinite(durationMs) ? Math.max(0, durationMs) : 0;
    this.expiresAt = safeNow + safeDuration;
  }

  isActive(now) {
    return Number.isFinite(now) && now < this.expiresAt;
  }

  consume(now) {
    if (!this.isActive(now)) {
      return false;
    }

    this.expiresAt = 0;
    return true;
  }

  remainingSeconds(now) {
    if (!this.isActive(now)) {
      return 0;
    }

    return Math.ceil((this.expiresAt - now) / 1000);
  }
}
