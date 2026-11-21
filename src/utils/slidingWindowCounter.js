/**
 * Sliding Window Counter Rate Limiter
 */
class SlidingWindowLimiter {
  constructor({ windowMs = 60000, maxRequests = 100 }) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
    this.requests = [];
  }

  isAllowed(timestamp = Date.now()) {
    const cutoff = timestamp - this.windowMs;
    this.requests = this.requests.filter(t => t > cutoff);
    if (this.requests.length < this.maxRequests) {
      this.requests.push(timestamp);
      return { allowed: true, currentCount: this.requests.length };
    }
    return { allowed: false, currentCount: this.requests.length };
  }
}

module.exports = { SlidingWindowLimiter };
