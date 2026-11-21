/**
 * Full Jitter Exponential Backoff Retry Executor
 */
class ExponentialBackoffRetry {
  static calculateDelay(attempt, baseDelayMs = 100, maxDelayMs = 5000) {
    const temp = Math.min(maxDelayMs, baseDelayMs * Math.pow(2, attempt));
    // Full jitter: random between 0 and temp
    return Math.floor(Math.random() * temp);
  }

  static async retry(fn, maxRetries = 3, baseDelayMs = 50) {
    let lastError;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (err) {
        lastError = err;
        if (attempt === maxRetries) break;
        const delay = ExponentialBackoffRetry.calculateDelay(attempt, baseDelayMs);
        await new Promise(r => setTimeout(r, delay));
      }
    }
    throw lastError;
  }
}

module.exports = ExponentialBackoffRetry;
