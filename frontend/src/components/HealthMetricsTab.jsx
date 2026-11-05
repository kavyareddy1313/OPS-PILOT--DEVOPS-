import React from 'react';
import { 
  Cpu, 
  HardDrive, 
  Server, 
  AlertTriangle,
  Zap
} from 'lucide-react';

export default function HealthMetricsTab({ summary, timeSeries }) {
  const telemetry = summary?.telemetry || {};
  const isHealthy = summary?.health?.isHealthy;

  // Time series points for latency & error graphs
  const points = timeSeries && timeSeries.length > 0 ? timeSeries : [
    { timestamp: '12:00', latencyMs: 18, errorRate: 0.02, cpuPercent: 20 },
    { timestamp: '12:01', latencyMs: 22, errorRate: 0.04, cpuPercent: 24 },
    { timestamp: '12:02', latencyMs: 19, errorRate: 0.01, cpuPercent: 21 },
  ];

  const maxLatency = Math.max(50, ...points.map((p) => p.latencyMs || 0));
  const maxError = Math.max(5, ...points.map((p) => p.errorRate || 0));

  const svgWidth = 500;
  const svgHeight = 120;

  const latencyPoints = points
    .map((p, index) => {
      const x = (index / (points.length - 1 || 1)) * svgWidth;
      const y = svgHeight - ((p.latencyMs || 0) / maxLatency) * (svgHeight - 20) - 10;
      return `${x},${y}`;
    })
    .join(' ');

  const errorPoints = points
    .map((p, index) => {
      const x = (index / (points.length - 1 || 1)) * svgWidth;
      const y = svgHeight - ((p.errorRate || 0) / maxError) * (svgHeight - 20) - 10;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="content-section">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '16px' }}>
        <div className="glass-panel">
          <div className="panel-header" style={{ marginBottom: '8px' }}>
            <div>
              <div className="panel-title">
                <Zap size={16} color="var(--primary)" />
                <span>p95 Request Latency (ms)</span>
              </div>
              <div className="panel-description">Target response time scraped by Prometheus</div>
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>
              {telemetry.latencyMs || 18} ms
            </div>
          </div>

          <div className="chart-container">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="chart-svg" preserveAspectRatio="none">
              <polyline
                fill="none"
                stroke="var(--primary)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={latencyPoints}
              />
            </svg>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            <span>{points[0]?.timestamp || ''}</span>
            <span>Live Latency Telemetry</span>
            <span>{points[points.length - 1]?.timestamp || ''}</span>
          </div>
        </div>

        <div className="glass-panel">
          <div className="panel-header" style={{ marginBottom: '8px' }}>
            <div>
              <div className="panel-title">
                <AlertTriangle size={16} color={telemetry.errorRatePercent > 5 ? '#ef4444' : '#10b981'} />
                <span>5xx Error Rate (%)</span>
              </div>
              <div className="panel-description">Anomaly threshold trigger set at &gt; 20%</div>
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: telemetry.errorRatePercent > 5 ? '#ef4444' : '#10b981' }}>
              {telemetry.errorRatePercent ? telemetry.errorRatePercent.toFixed(2) : '0.04'}%
            </div>
          </div>

          <div className="chart-container">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="chart-svg" preserveAspectRatio="none">
              <polyline
                fill="none"
                stroke={telemetry.errorRatePercent > 5 ? '#ef4444' : '#10b981'}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={errorPoints}
              />
            </svg>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            <span>{points[0]?.timestamp || ''}</span>
            <span>SLA: 99.9% Target</span>
            <span>{points[points.length - 1]?.timestamp || ''}</span>
          </div>
        </div>
      </div>

      <div className="glass-panel">
        <div className="panel-header">
          <div>
            <div className="panel-title">
              <Server size={18} color="var(--cyan)" />
              <span>Kubernetes Pod Replicas & Probes</span>
            </div>
            <div className="panel-description">
              Namespace: <code>opspilot-prod</code> • Deployment: <code>order-service</code>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}>
              <Cpu size={14} color="var(--primary)" />
              <span>CPU: <strong>{telemetry.cpuPercent || 22.4}%</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}>
              <HardDrive size={14} color="var(--cyan)" />
              <span>Mem: <strong>{telemetry.memoryMb || 154.2} MB</strong></span>
            </div>
          </div>
        </div>

        <div className="pod-matrix">
          {[
            { id: 'order-service-79db8-w2x4', ip: '10.244.1.42', node: 'node-pool-east-1', ready: isHealthy },
            { id: 'order-service-79db8-m9k1', ip: '10.244.2.18', node: 'node-pool-east-2', ready: isHealthy },
            { id: 'order-service-79db8-p8y7', ip: '10.244.1.95', node: 'node-pool-east-1', ready: true },
          ].map((pod) => (
            <div 
              className="pod-card" 
              key={pod.id} 
              style={{ borderLeft: pod.ready ? '3px solid var(--emerald)' : '3px solid var(--rose)' }}
            >
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
              <div className="pod-meta-row" style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '6px' }}>
                <span>Liveness: <strong>{pod.ready ? 'HTTP 200' : 'HTTP 500'}</strong></span>
                <span>Restarts: <strong>0</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
