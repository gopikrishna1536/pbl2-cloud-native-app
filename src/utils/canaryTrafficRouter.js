/**
 * Deterministic Canary Release Router
 */
const crypto = require('crypto');

function routeCanaryTraffic(userId, canaryPercent = 10, overrideHeader = null) {
  if (overrideHeader === 'canary') return 'canary';
  if (overrideHeader === 'stable') return 'stable';
  if (!userId) return 'stable';

  const hash = crypto.createHash('md5').update(String(userId)).digest('hex');
  const bucket = parseInt(hash.slice(0, 4), 16) % 100;
  return bucket < canaryPercent ? 'canary' : 'stable';
}

module.exports = { routeCanaryTraffic };
