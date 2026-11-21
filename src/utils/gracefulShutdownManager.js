/**
 * Graceful Shutdown Coordinator
 */
class GracefulShutdownCoordinator {
  constructor({ timeoutMs = 5000 } = {}) {
    this.timeoutMs = timeoutMs;
    this.isShuttingDown = false;
    this.activeRequests = 0;
  }

  startRequest() {
    if (this.isShuttingDown) return false;
    this.activeRequests += 1;
    return true;
  }

  endRequest() {
    this.activeRequests = Math.max(0, this.activeRequests - 1);
  }

  async triggerShutdown() {
    this.isShuttingDown = true;
    const start = Date.now();
    while (this.activeRequests > 0) {
      if (Date.now() - start > this.timeoutMs) {
        return { drained: false, remaining: this.activeRequests };
      }
      await new Promise(r => setTimeout(r, 50));
    }
    return { drained: true, remaining: 0 };
  }
}

module.exports = { GracefulShutdownCoordinator };
