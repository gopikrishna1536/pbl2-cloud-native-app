const test = require('node:test');
const assert = require('node:assert/strict');
const CircuitBreaker = require('../src/middleware/circuitBreaker');

test('Circuit Breaker Tests', async (t) => {
  await t.test('should trip to OPEN after failure threshold exceeded', async () => {
    const cb = new CircuitBreaker(2, 500);
    const failFn = async () => { throw new Error('Downstream 500 error'); };

    await assert.rejects(cb.execute(failFn));
    await assert.rejects(cb.execute(failFn));
    assert.equal(cb.state, 'OPEN');

    // Next immediate call should fast-fail
    await assert.rejects(cb.execute(failFn), /CircuitBreaker is OPEN/);
  });
});
