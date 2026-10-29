const express = require('express');
const router = express.Router();

const deploymentsController = require('../controllers/deploymentsController');
const incidentsController = require('../controllers/incidentsController');
const metricsController = require('../controllers/metricsController');
const demoController = require('../controllers/demoController');
const logsController = require('../controllers/logsController');

// Health Check
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'opspilot-backend-api',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Deployments
router.get('/deployments', deploymentsController.getDeployments);
router.post('/deployments', deploymentsController.createDeployment);
router.post('/deployments/rollback', deploymentsController.rollbackDeployment);

// Incidents & Policies
router.get('/incidents', incidentsController.getIncidents);
router.put('/incidents/:id/resolve', incidentsController.resolveIncident);
router.get('/policies', incidentsController.getPolicies);
router.get('/audit', incidentsController.getAuditLogs);

// Metrics & Telemetry
router.get('/metrics/summary', metricsController.getDashboardSummary);
router.get('/metrics/timeseries', metricsController.getTimeSeriesMetrics);

// Controlled Failure Simulation Lab
router.post('/demo/simulate', demoController.simulateFault);
router.post('/demo/reset', demoController.resetFault);
router.get('/demo/status', demoController.getDemoStatus);

// Streaming Logs
router.get('/logs', logsController.getLogs);

module.exports = router;
