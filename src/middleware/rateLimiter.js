/**
 * Sliding Window In-Memory Rate Limiter Middleware for Cloud Microservices.
 * Protects endpoints from burst traffic and DDoS attacks with standard RFC HTTP headers.
 */

class SlidingWindowRateLimiter {
  constructor(options = {}) {
    this.windowMs = options.windowMs || 60 * 1000; // 1 minute default
    this.maxRequests = options.maxRequests || 60; // 60 req/min default
    this.clientHistory = new Map(); // key -> Array of timestamps
  }

  /**
   * Evaluates request against client quota.
   * @param {string} clientId - Client IP or API key
   * @param {number} [now] - Optional timestamp for testing
   * @returns {Object} { allowed: boolean, remaining: number, resetTimeSeconds: number, retryAfterSeconds?: number }
   */
  check(clientId, now = Date.now()) {
    const windowStart = now - this.windowMs;

    let timestamps = this.clientHistory.get(clientId) || [];
    // Prune expired entries
    timestamps = timestamps.filter(t => t > windowStart);

    const isAllowed = timestamps.length < this.maxRequests;
    const resetTimeSeconds = Math.ceil((now + this.windowMs) / 1000);

    if (isAllowed) {
      timestamps.push(now);
      this.clientHistory.set(clientId, timestamps);

      return {
        allowed: true,
        remaining: this.maxRequests - timestamps.length,
        limit: this.maxRequests,
        resetTimeSeconds
      };
    }

    // Earliest timestamp determines retry-after
    const oldestTimestamp = timestamps[0] || now;
    const retryAfterMs = Math.max(1000, oldestTimestamp + this.windowMs - now);
    const retryAfterSeconds = Math.ceil(retryAfterMs / 1000);

    return {
      allowed: false,
      remaining: 0,
      limit: this.maxRequests,
      resetTimeSeconds,
      retryAfterSeconds
    };
  }

  /**
   * Express middleware factory.
   */
  middleware() {
    return (req, res, next) => {
      const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
      const result = this.check(clientIp);

      res.setHeader('X-RateLimit-Limit', result.limit);
      res.setHeader('X-RateLimit-Remaining', result.remaining);
      res.setHeader('X-RateLimit-Reset', result.resetTimeSeconds);

      if (!result.allowed) {
        res.setHeader('Retry-After', result.retryAfterSeconds);
        return res.status(429).json({
          error: 'Too Many Requests',
          message: `Rate limit exceeded. Try again in ${result.retryAfterSeconds} seconds.`,
          retryAfterSeconds: result.retryAfterSeconds
        });
      }

      next();
    };
  }

  reset() {
    this.clientHistory.clear();
  }
}

module.exports = { SlidingWindowRateLimiter };
