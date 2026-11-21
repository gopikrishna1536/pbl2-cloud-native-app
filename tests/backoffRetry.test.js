const test = require('node:test');
const assert = require('node:assert/strict');
const ExponentialBackoffRetry = require('../src/utils/exponentialBackoffRetry');

test('Exponential Backoff Retry Tests', async (t) => {
  await t.test('should succeed when transient failure resolves within retries', async () => {
    let calls = 0;
    const flakeyFn = async () => {
      calls++;
      if (calls < 2) throw new Error('Transient 503');
      return 'SUCCESS';
    };

    const res = await ExponentialBackoffRetry.retry(flakeyFn, 3, 10);
    assert.equal(res, 'SUCCESS');
    assert.equal(calls, 2);
  });
});
