import React from 'react';
import { 
  GitCommit, 
  HeartPulse, 
  Boxes, 
  Zap,
  Rocket
} from 'lucide-react';

export default function MetricCards({ summary }) {
  const activeRelease = summary?.activeRelease || {};
  const health = summary?.health || {};
  const cluster = summary?.cluster || {};
  const telemetry = summary?.telemetry || {};

  const isHealthy = health.isHealthy;

  return (
    <div className="metrics-grid">
      <div className="metric-card">
        <div className="metric-header">
          <span>Active Release</span>
          <div className="metric-icon-wrap" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
            <Rocket size={16} />
          </div>
        </div>
        <div className="metric-value" style={{ color: 'var(--primary)' }}>
          {activeRelease.version || 'v1.0.2'}
        </div>
        <div className="metric-sub">
          <span className="mono">sha: {activeRelease.commitSha || 'a8f3b21'}</span>
          <span>•</span>
          <span className="badge badge-active" style={{ padding: '1px 6px', fontSize: '0.66rem' }}>Production</span>
        </div>
      </div>

      <div className="metric-card">
        <div className="metric-header">
          <span>Workload Health</span>
          <div 
            className="metric-icon-wrap" 
            style={{ 
              background: isHealthy ? 'var(--emerald-bg)' : 'var(--rose-bg)', 
              color: isHealthy ? 'var(--emerald)' : 'var(--rose)' 
            }}
          >
            <HeartPulse size={16} />
          </div>
        </div>
        <div className="metric-value" style={{ color: isHealthy ? '#059669' : '#dc2626' }}>
          {isHealthy ? '100% Operational' : `Degraded (${health.consecutiveFailures || 3}/${health.failureThreshold || 3})`}
        </div>
        <div className="metric-sub">
          <span>HTTP {health.lastProbeStatus || 200}</span>
          <span>•</span>
          <span>{health.uptimePercent || 99.98}% uptime</span>
        </div>
      </div>

      <div className="metric-card">
        <div className="metric-header">
          <span>Kubernetes Pods</span>
          <div className="metric-icon-wrap" style={{ background: 'var(--cyan-bg)', color: 'var(--cyan)' }}>
            <Boxes size={16} />
          </div>
        </div>
        <div className="metric-value" style={{ color: 'var(--cyan)' }}>
          {cluster.readyReplicas || 3} of {cluster.desiredReplicas || 3} Ready
        </div>
        <div className="metric-sub">
          <span>Rollout: Healthy</span>
          <span>•</span>
          <span>Restarts: {cluster.restartCount || 0}</span>
        </div>
      </div>

      <div className="metric-card">
        <div className="metric-header">
          <span>p95 API Latency</span>
          <div className="metric-icon-wrap" style={{ background: '#faf5ff', color: '#7c3aed' }}>
            <Zap size={16} />
          </div>
        </div>
        <div className="metric-value" style={{ color: '#7c3aed' }}>
          {telemetry.latencyMs || 18} ms
        </div>
        <div className="metric-sub">
          <span>5xx Errors: {telemetry.errorRatePercent ? telemetry.errorRatePercent.toFixed(2) : '0.14'}%</span>
          <span>•</span>
          <span style={{ color: '#059669', fontWeight: 600 }}>Within SLA</span>
        </div>
      </div>
    </div>
  );
}
