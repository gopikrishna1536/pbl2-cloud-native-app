const test = require('node:test');
const assert = require('node:assert/strict');
const BulkheadIsolation = require('../src/utils/bulkheadIsolation');

test('Bulkhead Isolation Tests', async (t) => {
  await t.test('should enforce strict concurrent execution ceiling', async () => {
    const bulkhead = new BulkheadIsolation(2);
    const slowTask = () => new Promise(r => setTimeout(r, 50));

    const p1 = bulkhead.run(slowTask);
    const p2 = bulkhead.run(slowTask);

    // Third concurrent call should be rejected
    await assert.rejects(bulkhead.run(slowTask), /Bulkhead capacity saturated/);

    await Promise.all([p1, p2]);
  });
});
