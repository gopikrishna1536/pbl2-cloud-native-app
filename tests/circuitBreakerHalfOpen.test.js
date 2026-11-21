const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { AdvancedCircuitBreaker } = require('../src/utils/circuitBreakerHalfOpen');

describe('3-State Circuit Breaker Tests', () => {
  test('trips open on consecutive failures and resets to half-open after timeout', () => {
    const cb = new AdvancedCircuitBreaker({ failureThreshold: 2, resetTimeoutMs: 50 });
    assert.equal(cb.canExecute(), true);
    cb.recordFailure();
    cb.recordFailure();
    assert.equal(cb.state, 'OPEN');
    assert.equal(cb.canExecute(), false);
  });
});
