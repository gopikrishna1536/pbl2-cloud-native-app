const crypto = require('node:crypto');

/**
 * X-Correlation-ID Context Propagation Middleware
 */
function requestCorrelationMiddleware(req, res, next) {
  const correlationId = req.headers['x-correlation-id'] || crypto.randomUUID();
  req.correlationId = correlationId;
  res.setHeader('x-correlation-id', correlationId);
  if (next) next();
}

module.exports = requestCorrelationMiddleware;
