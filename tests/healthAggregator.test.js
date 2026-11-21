const test = require('node:test');
const assert = require('node:assert/strict');
const HealthCheckAggregator = require('../src/utils/healthCheckAggregator');

test('Health Check Aggregator Tests', async (t) => {
  await t.test('should report HEALTHY when all sub-systems respond', async () => {
    const deps = {
      db: async () => true,
      cache: async () => true
    };
    const res = await HealthCheckAggregator.checkDependencies(deps);
    assert.equal(res.status, 'HEALTHY');
    assert.equal(res.dependencies.db.status, 'UP');
  });
});
