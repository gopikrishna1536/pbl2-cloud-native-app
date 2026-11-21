const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { GracefulShutdownCoordinator } = require('../src/utils/gracefulShutdownManager');

describe('Graceful Shutdown Coordinator Tests', () => {
  test('drains active requests on shutdown signal', async () => {
    const coordinator = new GracefulShutdownCoordinator({ timeoutMs: 1000 });
    coordinator.startRequest();
    setTimeout(() => coordinator.endRequest(), 100);
    const res = await coordinator.triggerShutdown();
    assert.equal(res.drained, true);
    assert.equal(coordinator.startRequest(), false);
  });
});
