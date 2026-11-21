/**
 * Dead Letter Queue (DLQ) Retry Handler with Poison Message Isolation
 */
class DeadLetterQueueHandler {
  constructor({ maxRetries = 3 } = {}) {
    this.maxRetries = maxRetries;
    this.deadLetterStore = [];
  }

  processMessage(msg, handlerFn) {
    const attempts = (msg.attempts || 0) + 1;
    try {
      handlerFn(msg);
      return { success: true };
    } catch (err) {
      if (attempts >= this.maxRetries) {
        this.deadLetterStore.push({ ...msg, attempts, error: err.message, failedAt: new Date().toISOString() });
        return { success: false, routedToDlq: true };
      }
      return { success: false, routedToDlq: false, retryAttempt: attempts };
    }
  }
}

module.exports = { DeadLetterQueueHandler };
