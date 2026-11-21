const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { SlidingWindowLimiter } = require('../src/utils/slidingWindowCounter');

describe('Sliding Window Rate Limiter Tests', () => {
  test('accurately tracks rolling window request volume', () => {
    const limiter = new SlidingWindowLimiter({ windowMs: 1000, maxRequests: 2 });
    assert.equal(limiter.isAllowed(100).allowed, true);
    assert.equal(limiter.isAllowed(200).allowed, true);
    assert.equal(limiter.isAllowed(300).allowed, false);
  });
});
