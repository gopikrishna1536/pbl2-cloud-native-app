const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { parseTraceparent } = require('../src/utils/distributedTracingBaggage');

describe('W3C Trace Context Parser Tests', () => {
  test('parses compliant traceparent header', () => {
    const parsed = parseTraceparent('00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01');
    assert.equal(parsed.version, '00');
    assert.equal(parsed.traceId, '4bf92f3577b34da6a3ce929d0e0e4736');
    assert.equal(parsed.parentId, '00f067aa0ba902b7');
  });
});
