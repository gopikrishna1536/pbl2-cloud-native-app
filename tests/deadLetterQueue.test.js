const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { DeadLetterQueueHandler } = require('../src/utils/deadLetterQueueRetry');

describe('Dead Letter Queue Tests', () => {
  test('routes poison pill messages to DLQ after exceeding max retry attempts', () => {
    const dlq = new DeadLetterQueueHandler({ maxRetries: 2 });
    const faultyHandler = () => { throw new Error('Unrecoverable parsing failure'); };

    const first = dlq.processMessage({ id: 1, attempts: 0 }, faultyHandler);
    assert.equal(first.routedToDlq, false);

    const second = dlq.processMessage({ id: 1, attempts: 1 }, faultyHandler);
    assert.equal(second.routedToDlq, true);
    assert.equal(dlq.deadLetterStore.length, 1);
  });
});
