const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { sanitizeJwtClaims } = require('../src/utils/jwtPayloadSanitizer');

describe('JWT Payload Sanitizer Tests', () => {
  test('strips sensitive PII credentials from token claims', () => {
    const payload = { sub: 'usr_1', role: 'admin', password: 'hash', creditCard: '4111' };
    const cleaned = sanitizeJwtClaims(payload);
    assert.equal(cleaned.sub, 'usr_1');
    assert.equal(cleaned.password, undefined);
    assert.equal(cleaned.creditCard, undefined);
  });
});
