const test = require('node:test');
const assert = require('node:assert/strict');
const FeatureFlagEvaluator = require('../src/utils/featureFlagEvaluator');

test('Feature Flag Evaluator Tests', async (t) => {
  await t.test('should grant access to explicit allow-list entities regardless of percentage', () => {
    const enabled = FeatureFlagEvaluator.isEnabled('NEW_UI', 'BETA_USER', 0, ['BETA_USER']);
    assert.equal(enabled, true);
  });
});
