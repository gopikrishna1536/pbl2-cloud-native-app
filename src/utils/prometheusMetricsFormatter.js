/**
 * Prometheus 0.0.4 Metric Exposition Formatter
 */
function formatPrometheusMetrics(metrics) {
  const lines = [];
  metrics.forEach(m => {
    lines.push(`# HELP ${m.name} ${m.help}`);
    lines.push(`# TYPE ${m.name} ${m.type}`);
    if (m.labels) {
      const labelStr = Object.entries(m.labels).map(([k, v]) => `${k}="${v}"`).join(',');
      lines.push(`${m.name}{${labelStr}} ${m.value}`);
    } else {
      lines.push(`${m.name} ${m.value}`);
    }
  });
  return lines.join('\n') + '\n';
}

module.exports = { formatPrometheusMetrics };
