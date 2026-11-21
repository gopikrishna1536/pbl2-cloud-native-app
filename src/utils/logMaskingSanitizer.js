/**
 * High-Performance PII and Card Number Log Masking Filter
 */
function maskSensitiveLogs(logMessage) {
  if (!logMessage || typeof logMessage !== 'string') return '';
  return logMessage
    // Mask credit card numbers (13-16 digits)
    .replace(/\b(?:\d[ -]*?){13,16}\b/g, '****-****-****-****')
    // Mask email addresses
    .replace(/([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g, '***@$2')
    // Mask Bearer tokens
    .replace(/Bearer\s+[a-zA-Z0-9._-]+/gi, 'Bearer [REDACTED]');
}

module.exports = { maskSensitiveLogs };
