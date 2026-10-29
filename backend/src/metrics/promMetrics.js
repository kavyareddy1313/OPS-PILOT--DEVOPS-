const client = require('prom-client');

const register = new client.Registry();
client.collectDefaultMetrics({ register, prefix: 'opspilot_' });

const deploymentCounter = new client.Counter({
  name: 'opspilot_deployments_total',
  help: 'Total number of deployments triggered in OpsPilot',
  labelNames: ['version', 'status'],
  registers: [register],
});

const activeIncidentsGauge = new client.Gauge({
  name: 'opspilot_active_incidents_count',
  help: 'Current count of open and mitigating incidents',
  registers: [register],
});

const appHealthStatusGauge = new client.Gauge({
  name: 'opspilot_target_app_health_status',
  help: '1 if target application passes liveness/readiness, 0 if degraded',
  registers: [register],
});

const podReplicasReady = new client.Gauge({
  name: 'opspilot_k8s_pod_replicas_ready',
  help: 'Number of ready pods in target workload',
  registers: [register],
});

const simulatedCpuPercent = new client.Gauge({
  name: 'opspilot_simulated_cpu_usage_percent',
  help: 'Simulated workload CPU utilization percent',
  registers: [register],
});

const simulatedMemoryMb = new client.Gauge({
  name: 'opspilot_simulated_memory_mb',
  help: 'Simulated workload memory consumption in MB',
  registers: [register],
});

module.exports = {
  register,
  deploymentCounter,
  activeIncidentsGauge,
  appHealthStatusGauge,
  podReplicasReady,
  simulatedCpuPercent,
  simulatedMemoryMb,
};
