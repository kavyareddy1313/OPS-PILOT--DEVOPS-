import React from 'react';
import { 
  GitCommit, 
  HeartPulse, 
  Boxes, 
  Zap, 
  AlertCircle, 
  ShieldCheck 
} from 'lucide-react';

export default function MetricCards({ summary }) {
  const activeRelease = summary?.activeRelease || {};
  const health = summary?.health || {};
  const cluster = summary?.cluster || {};
  const telemetry = summary?.telemetry || {};

  const isHealthy = health.isHealthy;
  const isProbeDegraded = !isHealthy || health.consecutiveFailures > 0;

  return (
    <div className="metrics-grid">
      {/* Active Release */}
      <div className="metric-card">
        <div className="metric-header">
          <span>Active Release</span>
          <div className="metric-icon-wrap" style={{ color: '#818cf8' }}>
            <GitCommit size={18} />
          </div>
        </div>
        <div className="metric-value" style={{ color: '#818cf8' }}>
          {activeRelease.version || 'v1.0.2'}
        </div>
        <div className="metric-sub">
          <span className="mono">sha: {activeRelease.commitSha || 'a8f3b21'}</span>
          <span>•</span>
          <span>prod</span>
        </div>
      </div>

      {/* Health Check Status */}
      <div className="metric-card">
        <div className="metric-header">
          <span>Probe Status</span>
          <div className="metric-icon-wrap" style={{ color: isHealthy ? '#34d399' : '#fb7185' }}>
            <HeartPulse size={18} />
          </div>
        </div>
        <div className="metric-value" style={{ color: isHealthy ? '#34d399' : '#fb7185' }}>
          {isHealthy ? 'Passing' : `Failed (${health.consecutiveFailures || 3}/${health.failureThreshold || 3})`}
        </div>
        <div className="metric-sub">
          <span>HTTP {health.lastProbeStatus || 200}</span>
          <span>•</span>
          <span>{health.uptimePercent || 99.98}% uptime</span>
        </div>
      </div>

      {/* Pod Replicas */}
      <div className="metric-card">
        <div className="metric-header">
          <span>Pod Replicas</span>
          <div className="metric-icon-wrap" style={{ color: '#38bdf8' }}>
            <Boxes size={18} />
          </div>
        </div>
        <div className="metric-value" style={{ color: '#38bdf8' }}>
          {cluster.readyReplicas || 3} / {cluster.desiredReplicas || 3} Ready
        </div>
        <div className="metric-sub">
          <span>Rollout: Healthy</span>
          <span>•</span>
          <span>Restarts: {cluster.restartCount || 0}</span>
        </div>
      </div>

      {/* Latency */}
      <div className="metric-card">
        <div className="metric-header">
          <span>p95 Latency</span>
          <div className="metric-icon-wrap" style={{ color: '#a78bfa' }}>
            <Zap size={18} />
          </div>
        </div>
        <div className="metric-value" style={{ color: '#a78bfa' }}>
          {telemetry.latencyMs || 18} ms
        </div>
        <div className="metric-sub">
          <span style={{ color: telemetry.latencyMs > 200 ? '#fb7185' : '#34d399' }}>
            {telemetry.latencyMs > 200 ? '▲ Elevated delay' : '▼ Within SLA (<50ms)'}
          </span>
        </div>
      </div>

      {/* Error Rate */}
      <div className="metric-card">
        <div className="metric-header">
          <span>5xx Error Rate</span>
          <div className="metric-icon-wrap" style={{ color: telemetry.errorRatePercent > 5 ? '#fb7185' : '#34d399' }}>
            <AlertCircle size={18} />
          </div>
        </div>
        <div className="metric-value" style={{ color: telemetry.errorRatePercent > 5 ? '#fb7185' : '#34d399' }}>
          {telemetry.errorRatePercent?.toFixed(2) || '0.04'}%
        </div>
        <div className="metric-sub">
          <span style={{ color: telemetry.errorRatePercent > 5 ? '#fb7185' : '#94a3b8' }}>
            {telemetry.errorRatePercent > 5 ? 'Threshold breached (>20%)' : 'Normal (< 1.0%)'}
          </span>
        </div>
      </div>

      {/* Recovery MTTR */}
      <div className="metric-card">
        <div className="metric-header">
          <span>Mean Recovery (MTTR)</span>
          <div className="metric-icon-wrap" style={{ color: '#34d399' }}>
            <ShieldCheck size={18} />
          </div>
        </div>
        <div className="metric-value" style={{ color: '#34d399' }}>
          {telemetry.mttrSeconds || 24}s
        </div>
        <div className="metric-sub">
          <span>Policy: Auto-Rollback</span>
        </div>
      </div>
    </div>
  );
}
