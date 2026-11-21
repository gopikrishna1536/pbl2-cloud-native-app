const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { routeCanaryTraffic } = require('../src/utils/canaryTrafficRouter');

describe('Canary Release Router Tests', () => {
  test('routes deterministically by user hash and honors manual override headers', () => {
    assert.equal(routeCanaryTraffic('user123', 0), 'stable');
    assert.equal(routeCanaryTraffic('user123', 100), 'canary');
    assert.equal(routeCanaryTraffic('user123', 0, 'canary'), 'canary');
  });
});
