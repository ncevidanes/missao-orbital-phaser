const STORAGE_KEY = 'missao-orbital.high-score.v1';

function sanitizeScore(score) {
  const numericScore = Number(score);
  return Number.isFinite(numericScore) ? Math.max(0, Math.floor(numericScore)) : 0;
}

export class HighScoreRepository {
  constructor(storage = globalThis.localStorage) {
    this.storage = storage;
  }

  read() {
    try {
      return sanitizeScore(this.storage?.getItem(STORAGE_KEY));
    } catch {
      return 0;
    }
  }

  save(score) {
    const safeScore = sanitizeScore(score);
    const previousHighScore = this.read();
    const isNewRecord = safeScore > previousHighScore;
    const highScore = Math.max(previousHighScore, safeScore);

    if (isNewRecord) {
      try {
        this.storage?.setItem(STORAGE_KEY, String(highScore));
      } catch {
        // O jogo continua funcionando mesmo se o navegador bloquear o armazenamento.
      }
    }

    return { highScore, isNewRecord };
  }
}
