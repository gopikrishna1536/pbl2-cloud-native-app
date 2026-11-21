const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { IdempotencyStore } = require('../src/utils/idempotencyKeyStore');

describe('Idempotency Store Tests', () => {
  test('prevents duplicate processing by storing and retrieving cached responses', () => {
    const store = new IdempotencyStore();
    store.set('key-abc', { status: 201, orderId: 999 });
    assert.equal(store.has('key-abc'), true);
    assert.equal(store.get('key-abc').orderId, 999);
  });
});
