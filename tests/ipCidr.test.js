const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { matchesCidr } = require('../src/utils/ipCidrMatcher');

describe('IP CIDR Matcher Tests', () => {
  test('validates IP membership in CIDR subnet range', () => {
    assert.equal(matchesCidr('192.168.1.50', '192.168.1.0/24'), true);
    assert.equal(matchesCidr('10.0.0.1', '192.168.1.0/24'), false);
  });
});
