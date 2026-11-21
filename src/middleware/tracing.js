/**
 * Distributed Tracing & W3C TraceContext Middleware for Cloud-Native Microservices.
 * Supports W3C traceparent (version-traceid-parentid-traceflags), correlation IDs, and structured logging.
 */
const crypto = require('crypto');

/**
 * Generates a random hexadecimal string of given length.
 */
function randomHex(bytes) {
  return crypto.randomBytes(bytes).toString('hex');
}

/**
 * Parses or creates a W3C traceparent header.
 * Spec: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01
 */
function parseOrCreateTraceParent(headerValue) {
  const TRACEPARENT_REGEX = /^00-([0-9a-f]{32})-([0-9a-f]{16})-([0-9a-f]{2})$/;

  if (headerValue && TRACEPARENT_REGEX.test(headerValue)) {
    const match = headerValue.match(TRACEPARENT_REGEX);
    const traceId = match[1];
    const parentId = match[2];
    const flags = match[3];
    const newSpanId = randomHex(8);

    return {
      traceId,
      parentId,
      spanId: newSpanId,
      traceFlags: flags,
      header: `00-${traceId}-${newSpanId}-${flags}`,
      isSampled: flags === '01'
    };
  }

  // Generate fresh trace context
  const traceId = randomHex(16);
  const spanId = randomHex(8);
  const flags = '01'; // sampled by default

  return {
    traceId,
    parentId: null,
    spanId,
    traceFlags: flags,
    header: `00-${traceId}-${spanId}-${flags}`,
    isSampled: true
  };
}

/**
 * Express middleware for tracing and correlation ID propagation.
 */
function tracingMiddleware(req, res, next) {
  const rawTraceParent = req.headers['traceparent'];
  const traceContext = parseOrCreateTraceParent(rawTraceParent);

  const correlationId = req.headers['x-correlation-id'] || req.headers['x-request-id'] || traceContext.traceId;

  // Attach to request
  req.traceContext = traceContext;
  req.correlationId = correlationId;

  // Propagate to response headers
  res.setHeader('traceparent', traceContext.header);
  res.setHeader('x-correlation-id', correlationId);
  res.setHeader('x-trace-id', traceContext.traceId);

  next();
}

module.exports = {
  parseOrCreateTraceParent,
  tracingMiddleware
};
