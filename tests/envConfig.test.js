const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { validateEnv } = require('../src/utils/envConfigValidator');

describe('Environment Config Validator Tests', () => {
  test('validates required variables and types according to 12-factor spec', () => {
    const schema = {
      PORT: { type: 'number', required: true },
      NODE_ENV: { type: 'string', default: 'development' }
    };
    const res = validateEnv({ PORT: '8080' }, schema);
    assert.equal(res.valid, true);
    assert.equal(res.parsed.PORT, 8080);
    assert.equal(res.parsed.NODE_ENV, 'development');
  });
});
