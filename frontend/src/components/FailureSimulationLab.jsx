import React from 'react';
import { 
  FlaskConical, 
  Flame, 
  AlertTriangle, 
  Timer, 
  RefreshCw, 
  ShieldCheck, 
  Zap 
} from 'lucide-react';

export default function FailureSimulationLab({ 
  summary, 
  onSimulateFault, 
  onResetFault, 
  isLoading 
}) {
  const health = summary?.health || {};
  const isHealthy = health.isHealthy;
  const consecutive = health.consecutiveFailures || 0;
  const threshold = health.failureThreshold || 3;
  const simulatedFault = summary?.simulatedFault;

  return (
    <div className="content-section">
      {/* Friendly Guide Banner */}
      <div className="glass-panel" style={{ borderLeft: '3px solid var(--primary)' }}>
        <div className="panel-header" style={{ marginBottom: '12px' }}>
          <div>
            <div className="panel-title">
              <FlaskConical size={18} color="var(--primary)" />
              <span>Self-Healing Failure Simulation Lab</span>
            </div>
            <div className="panel-description">
              Test automated policy recovery: click a fault button below to watch OpsPilot detect consecutive probe failures and autonomously execute a zero-downtime rollback.
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className={`status-badge ${isHealthy ? 'healthy' : 'degraded'}`}>
              <div className={`pulse-dot ${isHealthy ? 'green' : 'red'}`} />
              <span>{isHealthy ? 'Workload Normal' : `Fault Active: ${simulatedFault?.type || 'Degraded'}`}</span>
            </div>

            <button className="btn btn-secondary" onClick={onResetFault} disabled={isLoading}>
              <RefreshCw size={13} className={isLoading ? 'spin' : ''} />
              <span>Reset to Healthy</span>
            </button>
          </div>
        </div>

        {/* Live Threshold Tracker */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', background: 'var(--bg-card-subtle)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-subtle)', flexWrap: 'wrap', fontSize: '0.8rem' }}>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Target Endpoint:</span> <code>http://demo-service:5002/healthz</code>
          </div>
          <div style={{ height: '14px', width: '1px', background: 'var(--border-subtle)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Consecutive Failures:</span>
            <span 
              className="mono" 
              style={{ 
                fontWeight: 700, 
                padding: '1px 7px', 
                borderRadius: '4px',
                background: consecutive >= threshold ? 'var(--rose-bg)' : 'var(--emerald-bg)',
                color: consecutive >= threshold ? 'var(--rose-text)' : 'var(--emerald-text)',
              }}
            >
              {consecutive} / {threshold}
            </span>
          </div>
          <div style={{ height: '14px', width: '1px', background: 'var(--border-subtle)' }} />
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Policy:</span> <strong style={{ color: 'var(--primary)' }}>AUTOMATED_ROLLBACK</strong> (Trigger at &gt;= 3 fails)
          </div>
        </div>
      </div>

      {/* 4 Action Cards */}
      <div className="lab-grid">
        {/* Card 1: Probe 500 Failure */}
        <div className="lab-action-card" style={{ borderTop: '3px solid #ef4444' }}>
          <div>
            <div className="lab-card-title">
              <Flame size={16} color="#ef4444" />
              <span>1. Liveness Probe Failure</span>
            </div>
            <div className="lab-card-desc">
              Forces <code>/healthz</code> to return HTTP 500. Simulates severe thread lock. OpsPilot detects 3 failures and executes automated rollback within 15 seconds.
            </div>
          </div>
          <button
            className="btn btn-danger"
            onClick={() => onSimulateFault('probe_failure', 'Simulated 500 internal probe failure')}
            disabled={isLoading}
          >
            <span>Simulate Probe Failure</span>
          </button>
        </div>

        {/* Card 2: 5xx Error Rate Spike */}
        <div className="lab-action-card" style={{ borderTop: '3px solid #f59e0b' }}>
          <div>
            <div className="lab-card-title">
              <AlertTriangle size={16} color="#f59e0b" />
              <span>2. 5xx Error Rate Spike (85%)</span>
            </div>
            <div className="lab-card-desc">
              Simulates database connection pool exhaustion. 85% of order requests fail with HTTP 500, triggering anomaly thresholds.
            </div>
          </div>
          <button
            className="btn btn-secondary"
            style={{ color: '#d97706', borderColor: '#fde68a' }}
            onClick={() => onSimulateFault('error_spike', 'Simulated DB connection pool exhaustion (85% errors)')}
            disabled={isLoading}
          >
            <span>Simulate Error Spike</span>
          </button>
        </div>

        {/* Card 3: High Latency */}
        <div className="lab-action-card" style={{ borderTop: '3px solid #7c3aed' }}>
          <div>
            <div className="lab-card-title">
              <Timer size={16} color="#7c3aed" />
              <span>3. Latency Spike (1200ms)</span>
            </div>
            <div className="lab-card-desc">
              Injects artificial 1200ms delay into order transactions. Tests slow response detection and SLA monitoring.
            </div>
          </div>
          <button
            className="btn btn-secondary"
            style={{ color: '#7c3aed', borderColor: '#ddd6fe' }}
            onClick={() => onSimulateFault('latency', 'Simulated 1200ms artificial delay')}
            disabled={isLoading}
          >
            <span>Simulate High Latency</span>
          </button>
        </div>

        {/* Card 4: Reset to Healthy */}
        <div className="lab-action-card" style={{ borderTop: '3px solid #10b981' }}>
          <div>
            <div className="lab-card-title">
              <ShieldCheck size={16} color="#10b981" />
              <span>4. Reset & Restore</span>
            </div>
            <div className="lab-card-desc">
              Clears all injected faults, resets probe failure counters to 0, and restores normal operational status.
            </div>
          </div>
          <button
            className="btn btn-success"
            onClick={onResetFault}
            disabled={isLoading}
          >
            <span>Restore Healthy State</span>
          </button>
        </div>
      </div>

      {/* Autonomous Recovery Life-Cycle Flow */}
      <div className="glass-panel">
        <div className="panel-title" style={{ marginBottom: '12px', fontSize: '0.98rem' }}>
          <Zap size={16} color="var(--primary)" />
          <span>Autonomous Recovery Life-Cycle Flow</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px' }}>
          {[
            { step: '1. Injected', desc: 'Simulated failure triggered', active: !isHealthy },
            { step: '2. Detection', desc: 'Probe check fails consecutive times', active: consecutive > 0 },
            { step: '3. Threshold', desc: 'Threshold >= 3 breached', active: consecutive >= threshold },
            { step: '4. Incident', desc: 'Incident ticket logged with root cause', active: consecutive >= threshold },
            { step: '5. Auto-Rollback', desc: 'Switches traffic to last verified version', active: true },
            { step: '6. Verified', desc: 'Probes return HTTP 200 (healthy)', active: isHealthy },
          ].map((item) => (
            <div
              key={item.step}
              style={{
                background: item.active && !isHealthy ? 'var(--rose-bg)' : 'var(--bg-card-subtle)',
                border: item.active && !isHealthy ? '1px solid var(--rose-border)' : '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '10px',
                fontSize: '0.78rem',
              }}
            >
              <div style={{ fontWeight: 700, color: item.active && !isHealthy ? 'var(--rose-text)' : 'var(--primary)', marginBottom: '3px' }}>
                {item.step}
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.72rem' }}>
                {item.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
