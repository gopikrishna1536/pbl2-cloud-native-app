/**
 * Token Bucket Rate Limiter
 */
class TokenBucket {
  constructor({ capacity = 10, refillRatePerSecond = 2 }) {
    this.capacity = capacity;
    this.refillRate = refillRatePerSecond;
    this.tokens = capacity;
    this.lastRefill = Date.now();
  }

  refill() {
    const now = Date.now();
    const elapsedSeconds = (now - this.lastRefill) / 1000;
    this.tokens = Math.min(this.capacity, this.tokens + (elapsedSeconds * this.refillRate));
    this.lastRefill = now;
  }

  tryConsume(tokens = 1) {
    this.refill();
    if (this.tokens >= tokens) {
      this.tokens -= tokens;
      return { allowed: true, remainingTokens: Math.floor(this.tokens) };
    }
    const needed = tokens - this.tokens;
    const retryAfterSeconds = Math.ceil(needed / this.refillRate);
    return { allowed: false, retryAfterSeconds, remainingTokens: 0 };
  }
}

module.exports = { TokenBucket };
