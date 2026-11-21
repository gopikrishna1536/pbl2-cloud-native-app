const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { aggregateHealthChecks } = require('../src/utils/healthCheckProber');

describe('Kubernetes Health Prober Tests', () => {
  test('returns 200 when all subsystems report healthy', () => {
    const res = aggregateHealthChecks({ db: () => true, redis: () => true });
    assert.equal(res.status, 'HEALTHY');
    assert.equal(res.statusCode, 200);
  });

  test('returns 503 when a critical dependency fails', () => {
    const res = aggregateHealthChecks({ db: () => true, redis: () => false });
    assert.equal(res.status, 'UNHEALTHY');
    assert.equal(res.statusCode, 503);
  });
});
