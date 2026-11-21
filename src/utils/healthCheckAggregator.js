/**
 * Composite Multi-Dependency Health Check Aggregator
 */
class HealthCheckAggregator {
  static async checkDependencies(dependencies = {}) {
    const results = {};
    let isOverallHealthy = true;

    for (const [name, checkFn] of Object.entries(dependencies)) {
      try {
        const start = Date.now();
        await checkFn();
        results[name] = { status: 'UP', latencyMs: Date.now() - start };
      } catch (err) {
        results[name] = { status: 'DOWN', error: err.message };
        isOverallHealthy = false;
      }
    }

    return {
      status: isOverallHealthy ? 'HEALTHY' : 'UNHEALTHY',
      timestamp: new Date().toISOString(),
      dependencies: results
    };
  }
}

module.exports = HealthCheckAggregator;
