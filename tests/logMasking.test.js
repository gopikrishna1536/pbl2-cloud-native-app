const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { maskSensitiveLogs } = require('../src/utils/logMaskingSanitizer');

describe('Log Masking Sanitizer Tests', () => {
  test('redacts credit cards and bearer authentication tokens from log streams', () => {
    const raw = 'Payment processed for 4111222233334444 with Authorization: Bearer secret_token_xyz';
    const masked = maskSensitiveLogs(raw);
    assert.ok(masked.includes('****-****-****-****'));
    assert.ok(masked.includes('Bearer [REDACTED]'));
  });
});
