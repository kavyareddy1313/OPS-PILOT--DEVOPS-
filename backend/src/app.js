const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/apiRoutes');
const { getPrometheusMetrics } = require('./controllers/metricsController');

const app = express();

app.use(cors());
app.use(express.json());

// Prometheus Metrics Scrape Endpoint
app.get('/metrics', getPrometheusMetrics);

// Mount API routes
app.use('/api', apiRoutes);

// Root information endpoint
app.get('/', (req, res) => {
  res.json({
    platform: 'OpsPilot - Automated Deployment, Health Monitoring & Recovery Platform',
    version: '1.0.0',
    documentation: '/api/health',
    endpoints: {
      deployments: '/api/deployments',
      incidents: '/api/incidents',
      metrics_summary: '/api/metrics/summary',
      timeseries: '/api/metrics/timeseries',
      demo_simulation: '/api/demo/simulate',
      logs: '/api/logs',
      prometheus_metrics: '/metrics',
    },
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint Not Found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[API Error]', err);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

module.exports = app;
