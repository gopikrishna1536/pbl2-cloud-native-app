/**
 * Kubernetes Pod CPU and Memory Quota Ratio Evaluator
 */
function evaluatePodQuotas({ cpuRequestMilli, cpuLimitMilli, memRequestMb, memLimitMb }) {
  const cpuOvercommitRatio = cpuRequestMilli > 0 ? Number((cpuLimitMilli / cpuRequestMilli).toFixed(2)) : 1.0;
  const memOvercommitRatio = memRequestMb > 0 ? Number((memLimitMb / memRequestMb).toFixed(2)) : 1.0;

  return {
    cpuOvercommitRatio,
    memOvercommitRatio,
    isWithinProductionLimits: cpuOvercommitRatio <= 3.0 && memOvercommitRatio <= 1.5
  };
}

module.exports = { evaluatePodQuotas };
