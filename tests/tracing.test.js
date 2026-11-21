const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { parseOrCreateTraceParent, tracingMiddleware } = require('../src/middleware/tracing');

describe('W3C Distributed Tracing Middleware Tests', () => {
  test('should generate valid W3C traceparent when no header is supplied', () => {
    const ctx = parseOrCreateTraceParent(null);
    assert.equal(ctx.parentId, null);
    assert.equal(ctx.traceId.length, 32);
    assert.equal(ctx.spanId.length, 16);
    assert.equal(ctx.traceFlags, '01');
    assert.equal(ctx.isSampled, true);
    assert.match(ctx.header, /^00-[0-9a-f]{32}-[0-9a-f]{16}-01$/);
  });

  test('should propagate incoming traceId and spawn new spanId for child span', () => {
    const incomingHeader = '00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01';
    const ctx = parseOrCreateTraceParent(incomingHeader);

    // traceId is preserved
    assert.equal(ctx.traceId, '4bf92f3577b34da6a3ce929d0e0e4736');
    // incoming span becomes parentId
    assert.equal(ctx.parentId, '00f067aa0ba902b7');
    // new unique spanId generated
    assert.notEqual(ctx.spanId, '00f067aa0ba902b7');
    assert.equal(ctx.spanId.length, 16);
    assert.equal(ctx.header.startsWith('00-4bf92f3577b34da6a3ce929d0e0e4736-'), true);
  });

  test('middleware should attach context and set response tracing headers', () => {
    const req = {
      headers: {
        'x-correlation-id': 'custom-req-777',
        'traceparent': '00-11112222333344445555666677778888-aaaabbbbccccdddd-01'
      }
    };

    const headersSent = {};
    const res = {
      setHeader: (k, v) => {
        headersSent[k.toLowerCase()] = v;
      }
    };

    let nextCalled = false;
    tracingMiddleware(req, res, () => {
      nextCalled = true;
    });

    assert.equal(nextCalled, true);
    assert.equal(req.correlationId, 'custom-req-777');
    assert.equal(headersSent['x-correlation-id'], 'custom-req-777');
    assert.equal(headersSent['x-trace-id'], '11112222333344445555666677778888');
    assert.ok(headersSent['traceparent'].startsWith('00-11112222333344445555666677778888-'));
  });
});
