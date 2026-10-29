import React from 'react';
import { 
  Activity, 
  Cpu, 
  HardDrive, 
  Gauge, 
  Server, 
  CheckCircle, 
  AlertTriangle,
  Zap
} from 'lucide-react';

export default function HealthMetricsTab({ summary, timeSeries }) {
  const telemetry = summary?.telemetry || {};
  const cluster = summary?.cluster || {};
  const isHealthy = summary?.health?.isHealthy;

  // Generate SVG path for time series data
  const points = timeSeries && timeSeries.length > 0 ? timeSeries : [
    { timestamp: '12:00', latencyMs: 18, errorRate: 0.02, cpuPercent: 20 },
    { timestamp: '12:01', latencyMs: 22, errorRate: 0.04, cpuPercent: 24 },
    { timestamp: '12:02', latencyMs: 19, errorRate: 0.01, cpuPercent: 21 },
  ];

  const maxLatency = Math.max(50, ...points.map((p) => p.latencyMs || 0));
  const maxError = Math.max(5, ...points.map((p) => p.errorRate || 0));

  const svgWidth = 500;
  const svgHeight = 140;

  // Build polyline points for Latency
  const latencyPoints = points
    .map((p, index) => {
      const x = (index / (points.length - 1 || 1)) * svgWidth;
      const y = svgHeight - ((p.latencyMs || 0) / maxLatency) * (svgHeight - 20) - 10;
      return `${x},${y}`;
    })
    .join(' ');

  // Build polyline points for Error Rate
  const errorPoints = points
    .map((p, index) => {
      const x = (index / (points.length - 1 || 1)) * svgWidth;
      const y = svgHeight - ((p.errorRate || 0) / maxError) * (svgHeight - 20) - 10;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="content-section">
      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
        {/* Latency Chart */}
        <div className="glass-panel">
          <div className="panel-header" style={{ marginBottom: '10px' }}>
            <div>
              <div className="panel-title">
                <Zap size={18} color="#a78bfa" />
                <span>p95 Request Latency (ms)</span>
              </div>
              <div className="panel-description">Target microservice response time via Prometheus scraping</div>
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: '#a78bfa' }}>
              {telemetry.latencyMs || 18} ms
            </div>
          </div>

          <div className="chart-container">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="chart-svg" preserveAspectRatio="none">
              <defs>
                <linearGradient id="latencyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <polyline
                fill="none"
                stroke="#a78bfa"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={latencyPoints}
              />
            </svg>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748b', marginTop: '6px' }}>
            <span>{points[0]?.timestamp || ''}</span>
            <span>Real-time metric telemetry</span>
            <span>{points[points.length - 1]?.timestamp || ''}</span>
          </div>
        </div>

        {/* 5xx Error Rate Chart */}
        <div className="glass-panel">
          <div className="panel-header" style={{ marginBottom: '10px' }}>
            <div>
              <div className="panel-title">
                <AlertTriangle size={18} color={telemetry.errorRatePercent > 5 ? '#fb7185' : '#34d399'} />
                <span>HTTP 5xx Error Rate (%)</span>
              </div>
              <div className="panel-description">Threshold trigger configured at &gt; 20% over 30s window</div>
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: telemetry.errorRatePercent > 5 ? '#fb7185' : '#34d399' }}>
              {telemetry.errorRatePercent?.toFixed(2) || '0.04'}%
            </div>
          </div>

          <div className="chart-container">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="chart-svg" preserveAspectRatio="none">
              <polyline
                fill="none"
                stroke={telemetry.errorRatePercent > 5 ? '#fb7185' : '#34d399'}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={errorPoints}
              />
            </svg>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748b', marginTop: '6px' }}>
            <span>{points[0]?.timestamp || ''}</span>
            <span>SLA: 99.9% success rate</span>
            <span>{points[points.length - 1]?.timestamp || ''}</span>
          </div>
        </div>
      </div>

      {/* Resource Utilization & Pod Matrix */}
      <div className="glass-panel">
        <div className="panel-header">
          <div>
            <div className="panel-title">
              <Server size={20} color="#38bdf8" />
              <span>Kubernetes Pod Replicas & Probes Matrix</span>
            </div>
            <div className="panel-description">
              Namespace: <code>opspilot-prod</code> • Deployment: <code>order-service</code>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem' }}>
              <Cpu size={15} color="#818cf8" />
              <span>CPU: <strong>{telemetry.cpuPercent || 22.4}%</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem' }}>
              <HardDrive size={15} color="#06b6d4" />
              <span>Memory: <strong>{telemetry.memoryMb || 154.2} MB</strong></span>
            </div>
          </div>
        </div>

        <div className="pod-matrix">
          {[
            { id: 'order-service-79db8-w2x4', ip: '10.244.1.42', node: 'node-pool-east-1', age: '1h 42m', ready: isHealthy },
            { id: 'order-service-79db8-m9k1', ip: '10.244.2.18', node: 'node-pool-east-2', age: '1h 42m', ready: isHealthy },
            { id: 'order-service-79db8-p8y7', ip: '10.244.1.95', node: 'node-pool-east-1', age: '1h 42m', ready: true },
          ].map((pod, idx) => (
            <div className="pod-card" key={pod.id} style={{ borderLeft: pod.ready ? '3px solid #10b981' : '3px solid #f43f5e' }}>
              <div className="pod-card-header">
                <span className="pod-name">{pod.id}</span>
                <span className={`badge ${pod.ready ? 'badge-active' : 'badge-critical'}`}>
                  {pod.ready ? 'Ready (1/1)' : 'Unhealthy'}
                </span>
              </div>
              <div className="pod-meta-row">
                <span>Node: <strong>{pod.node}</strong></span>
                <span>IP: <code className="mono">{pod.ip}</code></span>
              </div>
              <div className="pod-meta-row" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '6px' }}>
                <span>Liveness: <strong>{pod.ready ? 'HTTP 200' : 'HTTP 500'}</strong></span>
                <span>Readiness: <strong>{pod.ready ? 'Passing' : 'Failed'}</strong></span>
                <span>Restarts: <strong>{pod.ready ? '0' : '2'}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
