const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { CacheMutex } = require('../src/utils/cacheStampedeMutex');

describe('Cache Stampede Mutex Tests', () => {
  test('coalesces concurrent requests to compute function into single execution', async () => {
    const mutex = new CacheMutex();
    let computeCount = 0;
    const slowTask = async () => {
      computeCount += 1;
      await new Promise(r => setTimeout(r, 20));
      return 'computed_result';
    };

    const [r1, r2, r3] = await Promise.all([
      mutex.getOrCompute('k1', slowTask),
      mutex.getOrCompute('k1', slowTask),
      mutex.getOrCompute('k1', slowTask)
    ]);

    assert.equal(computeCount, 1);
    assert.equal(r1, 'computed_result');
    assert.equal(r2, 'computed_result');
  });
});
