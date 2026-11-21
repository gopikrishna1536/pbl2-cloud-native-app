const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { formatPrometheusMetrics } = require('../src/utils/prometheusMetricsFormatter');

describe('Prometheus Metrics Formatter Tests', () => {
  test('formats metrics according to Prometheus text exposition spec', () => {
    const formatted = formatPrometheusMetrics([
      { name: 'http_requests_total', help: 'Total HTTP requests', type: 'counter', value: 1024, labels: { method: 'GET', code: '200' } }
    ]);
    assert.ok(formatted.includes('# TYPE http_requests_total counter'));
    assert.ok(formatted.includes('method="GET"'));
  });
});
