const crypto = require('node:crypto');

/**
 * Feature Flag Percentage Rollout Evaluator
 */
class FeatureFlagEvaluator {
  static isEnabled(flagKey, entityId, rolloutPercentage = 0, allowList = []) {
    if (allowList.includes(entityId)) return true;
    if (rolloutPercentage <= 0) return false;
    if (rolloutPercentage >= 100) return true;

    const hash = crypto
      .createHash('sha256')
      .update(`${flagKey}:${entityId}`)
      .digest('hex');

    const bucket = parseInt(hash.slice(0, 4), 16) % 100;
    return bucket < rolloutPercentage;
  }
}

module.exports = FeatureFlagEvaluator;
