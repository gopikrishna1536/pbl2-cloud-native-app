const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { monitorPoolSaturation } = require('../src/utils/connectionPoolMonitor');

describe('Connection Pool Saturation Tests', () => {
  test('flags critical warning when connection pool utilization exceeds 85%', () => {
    const res = monitorPoolSaturation({ activeConnections: 90, maxConnections: 100, waitingQueueLength: 6 });
    assert.equal(res.saturationPercent, 90.0);
    assert.equal(res.isSaturated, true);
    assert.equal(res.severity, 'CRITICAL');
  });
});
