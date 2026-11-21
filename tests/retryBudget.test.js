const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { RetryBudgetManager } = require('../src/utils/serviceMeshRetryBudget');

describe('Service Mesh Retry Budget Tests', () => {
  test('prevents downstream retry storms by throttling retries against budget', () => {
    const budget = new RetryBudgetManager({ maxRetryRatio: 0.2, minRetriesPerSecond: 2 });
    assert.equal(budget.canRetry(), true);
    assert.equal(budget.canRetry(), true);
    assert.equal(budget.canRetry(), false);
  });
});
