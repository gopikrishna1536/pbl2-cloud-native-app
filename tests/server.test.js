const { test, describe, before, after } = require('node:test');
const assert = require('node:assert');
const http = require('http');
const app = require('../src/server');

describe('Cloud-Native Probes & Observability Tests', () => {
  let server;
  let baseUrl;

  before(async () => {
    await new Promise((resolve) => {
      server = app.listen(0, () => {
        const port = server.address().port;
        baseUrl = `http://localhost:${port}`;
        resolve();
      });
    });
  });

  after(async () => {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
  });

  test('GET /healthz should return 200 OK for Kubernetes liveness', async () => {
    const res = await fetch(`${baseUrl}/healthz`);
    const data = await res.json();

    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.status, 'healthy');
    assert.ok(data.timestamp);
  });

  test('GET /readyz should return 200 OK for Kubernetes readiness', async () => {
    const res = await fetch(`${baseUrl}/readyz`);
    const data = await res.json();

    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.status, 'ready');
    assert.ok(data.uptimeSeconds >= 0);
  });

  test('GET /metrics should export valid Prometheus text format', async () => {
    const res = await fetch(`${baseUrl}/metrics`);
    const text = await res.text();

    assert.strictEqual(res.status, 200);
    assert.ok(text.includes('http_requests_total'));
    assert.ok(text.includes('process_uptime_seconds'));
  });

  test('GET /api/v1/info should provide container metadata', async () => {
    const res = await fetch(`${baseUrl}/api/v1/info`);
    const data = await res.json();

    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.version, '1.0.0');
    assert.ok(data.hostname);
  });
});
