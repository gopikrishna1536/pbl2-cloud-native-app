/**
 * Envoy / Istio Style Retry Budget Limiter
 * Caps retries at maximum percentage of overall base traffic (e.g. 20%)
 */
class RetryBudgetManager {
  constructor({ maxRetryRatio = 0.20, minRetriesPerSecond = 10 } = {}) {
    this.maxRetryRatio = maxRetryRatio;
    this.minRetries = minRetriesPerSecond;
    this.baseRequests = 0;
    this.retries = 0;
  }

  recordBaseRequest() {
    this.baseRequests += 1;
  }

  canRetry() {
    const allowedRetries = Math.max(this.minRetries, this.baseRequests * this.maxRetryRatio);
    if (this.retries < allowedRetries) {
      this.retries += 1;
      return true;
    }
    return false;
  }
}

module.exports = { RetryBudgetManager };
