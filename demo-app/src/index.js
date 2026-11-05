const express = require('express');
const cors = require('cors');
const client = require('prom-client');

const app = express();
const PORT = process.env.PORT || 5002;
const APP_VERSION = process.env.APP_VERSION || 'v1.0.0';
const COMMIT_SHA = process.env.COMMIT_SHA || 'a8f3b21';
const START_TIME = Date.now();

app.use(cors());
app.use(express.json());

const register = new client.Registry();
client.collectDefaultMetrics({ register, prefix: 'opspilot_demo_' });

const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'opspilot_demo_http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5],
  registers: [register],
});

const httpRequestsTotal = new client.Counter({
  name: 'opspilot_demo_http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register],
});

const probeCheckFailuresTotal = new client.Counter({
  name: 'opspilot_demo_probe_failures_total',
  help: 'Total number of failed liveness/readiness probe checks',
  labelNames: ['probe_type'],
  registers: [register],
});

let faultState = {
  isHealthy: true,
  isReady: true,
  errorSpike: false,
  errorSpikeRate: 0.85,
  artificialLatencyMs: 0,
  crashLoop: false,
  faultReason: null,
  faultInjectedAt: null,
};

app.use(async (req, res, next) => {
  const start = Date.now();

  if (faultState.artificialLatencyMs > 0 && !req.path.startsWith('/fault')) {
    await new Promise((resolve) => setTimeout(resolve, faultState.artificialLatencyMs));
  }

  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const route = req.route ? req.route.path : req.path;
    httpRequestDurationMicroseconds
      .labels(req.method, route, res.statusCode)
      .observe(duration);
    httpRequestsTotal
      .labels(req.method, route, res.statusCode)
      .inc();
  });

  next();
});

app.get('/', (req, res) => {
  res.json({
    name: 'OpsPilot Demo Service (Order Management)',
    status: faultState.isHealthy ? 'operational' : 'degraded',
    version: APP_VERSION,
    commit_sha: COMMIT_SHA,
    environment: process.env.NODE_ENV || 'production',
    uptime_seconds: Math.floor((Date.now() - START_TIME) / 1000),
    fault_state: {
      active: !faultState.isHealthy || faultState.errorSpike || faultState.artificialLatencyMs > 0,
      reason: faultState.faultReason,
    },
  });
});

app.get('/api/orders', (req, res) => {
  if (faultState.errorSpike && Math.random() < faultState.errorSpikeRate) {
    return res.status(500).json({
      error: 'InternalServerError',
      message: 'Database connection pool exhausted due to simulated memory pressure',
      fault_injected: true,
    });
  }

  res.json({
    service: 'order-service',
    version: APP_VERSION,
    data: [
      { id: 'ORD-9021', customer: 'Acme Corp', amount: 1250.0, status: 'Shipped', timestamp: '2026-10-29T10:14:00Z' },
      { id: 'ORD-9022', customer: 'Global Logistics', amount: 480.5, status: 'Processing', timestamp: '2026-10-29T10:45:00Z' },
      { id: 'ORD-9023', customer: 'NextGen AI', amount: 3920.0, status: 'Confirmed', timestamp: '2026-10-29T11:20:00Z' },
    ],
  });
});

app.get('/healthz', (req, res) => {
  if (!faultState.isHealthy) {
    probeCheckFailuresTotal.labels('liveness').inc();
    return res.status(500).json({
      status: 'unhealthy',
      probe: 'liveness',
      error: faultState.faultReason || 'Liveness probe check failed',
      timestamp: new Date().toISOString(),
    });
  }
  res.status(200).json({
    status: 'healthy',
    probe: 'liveness',
    version: APP_VERSION,
    commit_sha: COMMIT_SHA,
    timestamp: new Date().toISOString(),
  });
});

app.get('/readyz', (req, res) => {
  if (!faultState.isReady || !faultState.isHealthy) {
    probeCheckFailuresTotal.labels('readiness').inc();
    return res.status(503).json({
      status: 'not_ready',
      probe: 'readiness',
      error: faultState.faultReason || 'Service dependencies not ready',
      timestamp: new Date().toISOString(),
    });
  }
  res.status(200).json({
    status: 'ready',
    probe: 'readiness',
    version: APP_VERSION,
    timestamp: new Date().toISOString(),
  });
});

app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (ex) {
    res.status(500).end(ex.message);
  }
});

app.get('/fault/status', (req, res) => {
  res.json({
    version: APP_VERSION,
    fault_state: faultState,
  });
});

app.post('/fault/inject', (req, res) => {
  const { type, latencyMs, reason } = req.body;

  if (type === 'unhealthy') {
    faultState.isHealthy = false;
    faultState.faultReason = reason || 'Simulated fatal probe failure (500 status on /healthz)';
    faultState.faultInjectedAt = new Date().toISOString();
  } else if (type === 'error_spike') {
    faultState.errorSpike = true;
    faultState.faultReason = reason || 'Simulated 5xx internal server error spike (85% failure)';
    faultState.faultInjectedAt = new Date().toISOString();
  } else if (type === 'latency') {
    faultState.artificialLatencyMs = latencyMs || 1200;
    faultState.faultReason = reason || `Simulated high request latency (${faultState.artificialLatencyMs}ms)`;
    faultState.faultInjectedAt = new Date().toISOString();
  } else if (type === 'crash') {
    faultState.isHealthy = false;
    faultState.isReady = false;
    faultState.faultReason = 'Simulated container crash (CrashLoopBackOff)';
    faultState.faultInjectedAt = new Date().toISOString();
  }

  res.json({
    success: true,
    message: `Injected fault: ${type}`,
    state: faultState,
  });
});

app.post('/fault/reset', (req, res) => {
  faultState = {
    isHealthy: true,
    isReady: true,
    errorSpike: false,
    errorSpikeRate: 0.85,
    artificialLatencyMs: 0,
    crashLoop: false,
    faultReason: null,
    faultInjectedAt: null,
  };

  res.json({
    success: true,
    message: 'Fault state reset to normal healthy operation',
    state: faultState,
  });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[Demo Service] running on port ${PORT} (version: ${APP_VERSION})`);
  });
}

module.exports = app;
