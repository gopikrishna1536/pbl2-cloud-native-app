const test = require('node:test');
const assert = require('node:assert/strict');
const requestCorrelationMiddleware = require('../src/middleware/requestCorrelation');

test('Correlation Middleware Tests', async (t) => {
  await t.test('should reuse existing incoming X-Correlation-ID header', () => {
    const req = { headers: { 'x-correlation-id': 'test-uuid-1234' } };
    const res = {
      headers: {},
      setHeader(k, v) { this.headers[k] = v; }
    };
    requestCorrelationMiddleware(req, res, () => {});
    assert.equal(req.correlationId, 'test-uuid-1234');
    assert.equal(res.headers['x-correlation-id'], 'test-uuid-1234');
  });
});
