/**
 * 3-State Circuit Breaker (Closed, Open, Half-Open)
 */
class AdvancedCircuitBreaker {
  constructor({ failureThreshold = 3, resetTimeoutMs = 1000 } = {}) {
    this.failureThreshold = failureThreshold;
    this.resetTimeout = resetTimeoutMs;
    this.state = 'CLOSED';
    this.failures = 0;
    this.lastFailureTime = 0;
  }

  recordSuccess() {
    this.failures = 0;
    this.state = 'CLOSED';
  }

  recordFailure() {
    this.failures += 1;
    this.lastFailureTime = Date.now();
    if (this.failures >= this.failureThreshold) {
      this.state = 'OPEN';
    }
  }

  canExecute() {
    if (this.state === 'CLOSED') return true;
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.resetTimeout) {
        this.state = 'HALF_OPEN';
        return true;
      }
      return false;
    }
    return true; // HALF_OPEN allows trial
  }
}

module.exports = { AdvancedCircuitBreaker };
