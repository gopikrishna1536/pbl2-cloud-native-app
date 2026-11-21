const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { TokenBucket } = require('../src/utils/tokenBucketRateLimiter');

describe('Token Bucket Rate Limiter Tests', () => {
  test('allows requests within capacity and limits when exhausted', () => {
    const limiter = new TokenBucket({ capacity: 3, refillRatePerSecond: 1 });
    assert.equal(limiter.tryConsume(1).allowed, true);
    assert.equal(limiter.tryConsume(1).allowed, true);
    assert.equal(limiter.tryConsume(1).allowed, true);
    const rejected = limiter.tryConsume(1);
    assert.equal(rejected.allowed, false);
    assert.ok(rejected.retryAfterSeconds >= 1);
  });
});
