const {
  register,
  activeIncidentsGauge,
  appHealthStatusGauge,
  podReplicasReady,
  simulatedCpuPercent,
  simulatedMemoryMb,
} = require('../metrics/promMetrics');
const db = require('../config/db');
const recoveryEngine = require('../services/recoveryEngine');

// In-memory time series history for charts
let timeSeriesHistory = [];

function generateInitialHistory() {
  const points = [];
  const now = Date.now();
  for (let i = 20; i >= 0; i--) {
    const timestamp = new Date(now - i * 15000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    points.push({
      timestamp,
      cpuPercent: parseFloat((18 + Math.random() * 8).toFixed(1)),
      memoryMb: parseFloat((145 + Math.random() * 20).toFixed(1)),
      latencyMs: Math.round(15 + Math.random() * 10),
      errorRate: parseFloat((Math.random() * 0.3).toFixed(2)),
    });
  }
  return points;
}

timeSeriesHistory = generateInitialHistory();

// Periodically append metric point
setInterval(() => {
  const isDegraded = recoveryEngine.consecutiveFailures > 0 || recoveryEngine.activeSimulatedFault;
  const lastHealth = recoveryEngine.lastHealthCheck;

  let cpu = isDegraded ? 68 + Math.random() * 25 : 18 + Math.random() * 12;
  let mem = isDegraded ? 320 + Math.random() * 60 : 145 + Math.random() * 25;
  let latency = isDegraded ? 650 + Math.random() * 400 : 14 + Math.random() * 8;
  let errorRate = isDegraded ? 35 + Math.random() * 50 : Math.random() * 0.2;

  if (lastHealth && lastHealth.healthy) {
    latency = Math.max(10, Math.min(60, lastHealth.latencyMs || 15));
  }

  const point = {
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    cpuPercent: parseFloat(cpu.toFixed(1)),
    memoryMb: parseFloat(mem.toFixed(1)),
    latencyMs: Math.round(latency),
    errorRate: parseFloat(errorRate.toFixed(2)),
  };

  timeSeriesHistory.push(point);
  if (timeSeriesHistory.length > 30) timeSeriesHistory.shift();

  // Update Prometheus gauges
  simulatedCpuPercent.set(point.cpuPercent);
  simulatedMemoryMb.set(point.memoryMb);
  const openIncidents = db.fallbackStore.incidents.filter((i) => i.status !== 'RESOLVED').length;
  activeIncidentsGauge.set(openIncidents);
  appHealthStatusGauge.set(isDegraded ? 0 : 1);
  podReplicasReady.set(isDegraded ? 1 : 3);
}, 5000);

exports.getPrometheusMetrics = async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (err) {
    res.status(500).end(err.message);
  }
};

exports.getDashboardSummary = async (req, res) => {
  try {
    const deployments = db.fallbackStore.deployments;
    const activeDeployment = deployments.find((d) => d.is_active) || deployments[0];
    const openIncidents = db.fallbackStore.incidents.filter((i) => i.status !== 'RESOLVED');
    const isDegraded = recoveryEngine.consecutiveFailures > 0 || recoveryEngine.activeSimulatedFault;
    const latestMetric = timeSeriesHistory[timeSeriesHistory.length - 1] || {};

    res.json({
      success: true,
      data: {
        activeRelease: {
          version: activeDeployment?.release_version || 'v1.0.2',
          commitSha: activeDeployment?.commit_sha || 'a8f3b21',
          author: activeDeployment?.author || 'kavyasr',
          deployedAt: activeDeployment?.deployed_at,
          environment: activeDeployment?.environment || 'production',
          status: isDegraded ? 'UNHEALTHY' : (activeDeployment?.status || 'HEALTHY'),
        },
        health: {
          isHealthy: !isDegraded,
          consecutiveFailures: recoveryEngine.consecutiveFailures,
          failureThreshold: recoveryEngine.failureThreshold,
          lastProbeLatency: latestMetric.latencyMs || 18,
          lastProbeStatus: recoveryEngine.lastHealthCheck?.status || 200,
          uptimePercent: 99.98,
        },
        cluster: {
          namespace: 'opspilot-prod',
          context: 'k8s-cluster-east',
          desiredReplicas: 3,
          readyReplicas: isDegraded ? 1 : 3,
          restartCount: isDegraded ? 3 : 0,
        },
        telemetry: {
          cpuPercent: latestMetric.cpuPercent || 22.4,
          memoryMb: latestMetric.memoryMb || 154.2,
          latencyMs: latestMetric.latencyMs || 18,
          errorRatePercent: latestMetric.errorRate || 0.04,
          mttrSeconds: 24,
        },
        counts: {
          totalDeployments: deployments.length,
          openIncidents: openIncidents.length,
          totalIncidents: db.fallbackStore.incidents.length,
          activePolicies: db.fallbackStore.policies.filter((p) => p.is_enabled).length,
        },
        simulatedFault: recoveryEngine.activeSimulatedFault,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getTimeSeriesMetrics = (req, res) => {
  res.json({
    success: true,
    data: timeSeriesHistory,
  });
};
