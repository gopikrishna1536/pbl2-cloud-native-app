/**
 * Secret & Sensitive Token Masking Sanitizer
 */
class SecretMaskingFilter {
  static PATTERNS = [
    { regex: /bearer\s+[a-zA-Z0-9_\-\.]+/gi, replace: 'Bearer [REDACTED_TOKEN]' },
    { regex: /password\s*[:=]\s*["']?[^"'\s,]+/gi, replace: 'password="[REDACTED]"' },
    { regex: /apiKey\s*[:=]\s*["']?[^"'\s,]+/gi, replace: 'apiKey="[REDACTED]"' }
  ];

  static sanitize(logString) {
    if (!logString) return '';
    let result = logString;
    for (const p of SecretMaskingFilter.PATTERNS) {
      result = result.replace(p.regex, p.replace);
    }
    return result;
  }
}

module.exports = SecretMaskingFilter;
