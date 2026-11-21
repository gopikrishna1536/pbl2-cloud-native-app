/**
 * Semaphore Bulkhead Isolation Pattern
 * Limits concurrent async executions to prevent thread/socket exhaustion.
 */
class BulkheadIsolation {
  constructor(maxConcurrent = 5) {
    this.maxConcurrent = maxConcurrent;
    this.activeExecutions = 0;
  }

  async run(fn) {
    if (this.activeExecutions >= this.maxConcurrent) {
      throw new Error('Bulkhead capacity saturated - Request rejected');
    }

    this.activeExecutions++;
    try {
      return await fn();
    } finally {
      this.activeExecutions--;
    }
  }
}

module.exports = BulkheadIsolation;
