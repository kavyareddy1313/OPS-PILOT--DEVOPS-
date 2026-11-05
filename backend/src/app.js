const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/apiRoutes');
const { getPrometheusMetrics } = require('./controllers/metricsController');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/metrics', getPrometheusMetrics);
app.use('/api', apiRoutes);

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

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint Not Found' });
});

app.use((err, req, res, next) => {
  console.error('[API Error]', err);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

module.exports = app;
