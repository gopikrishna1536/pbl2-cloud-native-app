const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { evaluatePodQuotas } = require('../src/utils/kubernetesResourceQuota');

describe('Kubernetes Resource Quota Tests', () => {
  test('verifies pod resource request/limit oversubscription ratios', () => {
    const res = evaluatePodQuotas({
      cpuRequestMilli: 500,
      cpuLimitMilli: 1000,
      memRequestMb: 1024,
      memLimitMb: 1024
    });
    assert.equal(res.cpuOvercommitRatio, 2.0);
    assert.equal(res.memOvercommitRatio, 1.0);
    assert.equal(res.isWithinProductionLimits, true);
  });
});
