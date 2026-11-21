/**
 * JWT Token Claims Sanitizer
 */
function sanitizeJwtClaims(payload) {
  if (!payload || typeof payload !== 'object') return {};
  const sanitized = { ...payload };
  delete sanitized.password;
  delete sanitized.secret;
  delete sanitized.ssn;
  delete sanitized.creditCard;
  return sanitized;
}

module.exports = { sanitizeJwtClaims };
