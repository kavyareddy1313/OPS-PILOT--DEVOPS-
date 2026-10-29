import React from 'react';
import { 
  GitCommit, 
  HeartPulse, 
  Boxes, 
  Zap, 
  AlertCircle 
} from 'lucide-react';

export default function MetricCards({ summary }) {
  const activeRelease = summary?.activeRelease || {};
  const health = summary?.health || {};
  const cluster = summary?.cluster || {};
  const telemetry = summary?.telemetry || {};

  const isHealthy = health.isHealthy;

  return (
    <div className="metrics-grid">
      {/* 1. Active Release */}
      <div className="metric-card">
        <div className="metric-header">
          <span>Active Production Release</span>
          <div className="metric-icon-wrap" style={{ background: '#eef2ff', color: '#4f46e5' }}>
            <GitCommit size={18} />
          </div>
        </div>
        <div className="metric-value" style={{ color: '#4f46e5' }}>
          {activeRelease.version || 'v1.0.2'}
        </div>
        <div className="metric-sub">
          <span className="mono">sha: {activeRelease.commitSha || 'a8f3b21'}</span>
          <span>•</span>
          <span className="badge badge-active" style={{ padding: '1px 8px', fontSize: '0.68rem' }}>Live</span>
        </div>
      </div>

      {/* 2. Health & Probe Status */}
      <div className="metric-card">
        <div className="metric-header">
          <span>Liveness / Readiness Probe</span>
          <div 
            className="metric-icon-wrap" 
            style={{ 
              background: isHealthy ? '#ecfdf5' : '#fef2f2', 
              color: isHealthy ? '#059669' : '#dc2626' 
            }}
          >
            <HeartPulse size={18} />
          </div>
        </div>
        <div className="metric-value" style={{ color: isHealthy ? '#059669' : '#dc2626' }}>
          {isHealthy ? 'Passing (100%)' : `Failed (${health.consecutiveFailures || 3}/${health.failureThreshold || 3})`}
        </div>
        <div className="metric-sub">
          <span>HTTP {health.lastProbeStatus || 200}</span>
          <span>•</span>
          <span>{health.uptimePercent || 99.98}% uptime</span>
        </div>
      </div>

      {/* 3. Pod Replicas */}
      <div className="metric-card">
        <div className="metric-header">
          <span>Kubernetes Pod Replicas</span>
          <div className="metric-icon-wrap" style={{ background: '#f0f9ff', color: '#0284c7' }}>
            <Boxes size={18} />
          </div>
        </div>
        <div className="metric-value" style={{ color: '#0284c7' }}>
          {cluster.readyReplicas || 3} of {cluster.desiredReplicas || 3} Ready
        </div>
        <div className="metric-sub">
          <span>Rollout: Healthy</span>
          <span>•</span>
          <span>Restarts: {cluster.restartCount || 0}</span>
        </div>
      </div>

      {/* 4. Request Latency */}
      <div className="metric-card">
        <div className="metric-header">
          <span>p95 API Latency</span>
          <div className="metric-icon-wrap" style={{ background: '#faf5ff', color: '#7c3aed' }}>
            <Zap size={18} />
          </div>
        </div>
        <div className="metric-value" style={{ color: '#7c3aed' }}>
          {telemetry.latencyMs || 18} ms
        </div>
        <div className="metric-sub">
          <span style={{ color: telemetry.latencyMs > 200 ? '#dc2626' : '#059669', fontWeight: 600 }}>
            {telemetry.latencyMs > 200 ? '▲ Elevated delay' : '✓ Normal (<50ms)'}
          </span>
        </div>
      </div>

      {/* 5. 5xx Error Rate */}
      <div className="metric-card">
        <div className="metric-header">
          <span>5xx Error Rate</span>
          <div 
            className="metric-icon-wrap" 
            style={{ 
              background: telemetry.errorRatePercent > 5 ? '#fef2f2' : '#ecfdf5', 
              color: telemetry.errorRatePercent > 5 ? '#dc2626' : '#059669' 
            }}
          >
            <AlertCircle size={18} />
          </div>
        </div>
        <div className="metric-value" style={{ color: telemetry.errorRatePercent > 5 ? '#dc2626' : '#059669' }}>
          {telemetry.errorRatePercent ? telemetry.errorRatePercent.toFixed(2) : '0.14'}%
        </div>
        <div className="metric-sub">
          <span>SLA target: &lt; 1.0%</span>
        </div>
      </div>
    </div>
  );
}
