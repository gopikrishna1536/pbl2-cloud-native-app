const express = require('express');
const cors = require('cors');
const { tracingMiddleware } = require('./middleware/tracing');
const { SlidingWindowRateLimiter } = require('./middleware/rateLimiter');

const app = express();
const PORT = process.env.PORT || 8080;
const START_TIME = Date.now();

const apiRateLimiter = new SlidingWindowRateLimiter({ windowMs: 60000, maxRequests: 120 });

let isReady = true;
let totalRequests = 0;

app.use(cors());
app.use(express.json());
app.use(tracingMiddleware);
app.use('/api', apiRateLimiter.middleware());

// Track metrics
app.use((req, res, next) => {
  totalRequests++;
  next();
});

// Kubernetes Liveness Probe
app.get('/healthz', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Kubernetes Readiness Probe
app.get('/readyz', (req, res) => {
  if (isReady) {
    res.status(200).json({ status: 'ready', uptimeSeconds: Math.floor((Date.now() - START_TIME) / 1000) });
  } else {
    res.status(503).json({ status: 'shutting_down' });
  }
});

// Prometheus-compatible Metrics Endpoint
app.get('/metrics', (req, res) => {
  const mem = process.memoryUsage();
  const uptime = Math.floor((Date.now() - START_TIME) / 1000);

  const metrics = [
    `# HELP http_requests_total Total HTTP requests handled`,
    `# TYPE http_requests_total counter`,
    `http_requests_total ${totalRequests}`,
    `# HELP process_uptime_seconds Application uptime in seconds`,
    `# TYPE process_uptime_seconds gauge`,
    `process_uptime_seconds ${uptime}`,
    `# HELP process_heap_bytes Node.js heap memory used`,
    `# TYPE process_heap_bytes gauge`,
    `process_heap_bytes ${mem.heapUsed}`
  ].join('\n');

  res.set('Content-Type', 'text/plain; version=0.0.4').send(metrics);
});

// Service Application Endpoints
app.get('/api/v1/info', (req, res) => {
  res.json({
    service: 'Cloud-Native Service Engine',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    hostname: require('os').hostname(),
    platform: process.platform,
    uptimeSeconds: Math.floor((Date.now() - START_TIME) / 1000)
  });
});

let server;
if (require.main === module) {
  server = app.listen(PORT, () => {
    console.log(`Cloud-native service listening on port ${PORT}`);
  });

  // Graceful shutdown on SIGTERM / SIGINT for zero-downtime K8s rolling updates
  const handleShutdown = (signal) => {
    console.log(`Received ${signal}. Starting graceful shutdown...`);
    isReady = false; // Immediately fail readiness probe so traffic stops routing to this pod
    if (server) {
      server.close(() => {
        console.log('HTTP server closed successfully. Exiting.');
        process.exit(0);
      });
    }
  };

  process.on('SIGTERM', () => handleShutdown('SIGTERM'));
  process.on('SIGINT', () => handleShutdown('SIGINT'));
}

module.exports = app;
