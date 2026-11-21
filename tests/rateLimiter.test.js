const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { SlidingWindowRateLimiter } = require('../src/middleware/rateLimiter');

describe('Sliding Window Rate Limiter Middleware Tests', () => {
  test('should allow requests within limit and decrement remaining tokens', () => {
    const limiter = new SlidingWindowRateLimiter({ windowMs: 1000, maxRequests: 3 });
    const client = '192.168.1.10';
    const t0 = 1000000;

    const r1 = limiter.check(client, t0);
    assert.equal(r1.allowed, true);
    assert.equal(r1.remaining, 2);

    const r2 = limiter.check(client, t0 + 100);
    assert.equal(r2.allowed, true);
    assert.equal(r2.remaining, 1);

    const r3 = limiter.check(client, t0 + 200);
    assert.equal(r3.allowed, true);
    assert.equal(r3.remaining, 0);

    // 4th request exceeds maxRequests = 3
    const r4 = limiter.check(client, t0 + 300);
    assert.equal(r4.allowed, false);
    assert.equal(r4.remaining, 0);
    assert.ok(r4.retryAfterSeconds > 0);
  });

  test('should reset capacity after sliding window expires', () => {
    const limiter = new SlidingWindowRateLimiter({ windowMs: 1000, maxRequests: 2 });
    const client = '10.0.0.1';
    const t0 = 1000000;

    limiter.check(client, t0);
    limiter.check(client, t0 + 500);

    // Blocked at t0 + 600
    assert.equal(limiter.check(client, t0 + 600).allowed, false);

    // Allowed again after window slides past t0 (at t0 + 1050)
    const allowedAfterSlide = limiter.check(client, t0 + 1050);
    assert.equal(allowedAfterSlide.allowed, true);
  });

  test('should enforce rate limits independently across different client IPs', () => {
    const limiter = new SlidingWindowRateLimiter({ windowMs: 1000, maxRequests: 1 });

    const clientA = limiter.check('1.1.1.1');
    const clientB = limiter.check('2.2.2.2');

    assert.equal(clientA.allowed, true);
    assert.equal(clientB.allowed, true);

    // Client A is blocked, Client B has independent counter
    assert.equal(limiter.check('1.1.1.1').allowed, false);
  });
});
