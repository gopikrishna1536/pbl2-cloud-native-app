const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { DistributedLockManager } = require('../src/utils/distributedLockRedis');

describe('Distributed Lock Manager Tests', () => {
  test('acquires resource lock and releases with matching fencing token', () => {
    const lockMgr = new DistributedLockManager();
    const lock = lockMgr.acquire('order-123', 5000);
    assert.equal(lock.acquired, true);

    const rival = lockMgr.acquire('order-123', 5000);
    assert.equal(rival.acquired, false);

    const released = lockMgr.release('order-123', lock.fencingToken);
    assert.equal(released, true);
  });
});
