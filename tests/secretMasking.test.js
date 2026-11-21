const test = require('node:test');
const assert = require('node:assert/strict');
const SecretMaskingFilter = require('../src/utils/secretMaskingFilter');

test('Secret Masking Tests', async (t) => {
  await t.test('should redact bearer token from authorization logs', () => {
    const raw = 'Incoming header Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';
    const clean = SecretMaskingFilter.sanitize(raw);
    assert.ok(clean.includes('Bearer [REDACTED_TOKEN]'));
    assert.ok(!clean.includes('eyJhbGciOi'));
  });
});
