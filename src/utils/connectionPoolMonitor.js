/**
 * Database Connection Pool Saturation Monitor
 */
function monitorPoolSaturation({ activeConnections, maxConnections, waitingQueueLength }) {
  const saturationPercent = maxConnections > 0 ? (activeConnections / maxConnections) * 100 : 0;
  const isSaturated = saturationPercent >= 85 || waitingQueueLength > 5;

  return {
    saturationPercent: Number(saturationPercent.toFixed(1)),
    isSaturated,
    severity: isSaturated ? 'CRITICAL' : 'OK'
  };
}

module.exports = { monitorPoolSaturation };
