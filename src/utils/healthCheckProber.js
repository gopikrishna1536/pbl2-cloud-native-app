/**
 * Kubernetes Liveness and Readiness Health Prober
 */
function aggregateHealthChecks(subsystems = {}) {
  let isReady = true;
  const statusReport = {};

  Object.entries(subsystems).forEach(([name, checkFn]) => {
    try {
      const result = typeof checkFn === 'function' ? checkFn() : checkFn;
      statusReport[name] = result ? 'UP' : 'DOWN';
      if (!result) isReady = false;
    } catch (e) {
      statusReport[name] = 'DOWN';
      isReady = false;
    }
  });

  return {
    status: isReady ? 'HEALTHY' : 'UNHEALTHY',
    statusCode: isReady ? 200 : 503,
    subsystems: statusReport
  };
}

module.exports = { aggregateHealthChecks };
