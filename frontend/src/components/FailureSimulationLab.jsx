import React, { useState } from 'react';
import { 
  FlaskConical, 
  Flame, 
  AlertTriangle, 
  Timer, 
  RefreshCw, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck, 
  Zap,
  Activity
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

  const handleSimulate = async (type, reason) => {
    await onSimulateFault(type, reason);
  };

  const handleReset = async () => {
    await onResetFault();
  };

  return (
    <div className="content-section">
      {/* Friendly Banner with Target and Status */}
      <div className="glass-panel" style={{ borderLeft: '4px solid #4f46e5' }}>
        <div className="panel-header" style={{ marginBottom: '14px' }}>
          <div>
            <div className="panel-title">
              <FlaskConical size={22} color="#4f46e5" />
              <span>Controlled Chaos & Self-Healing Simulation Lab</span>
            </div>
            <div className="panel-description">
              Safely inject controlled microservice faults into the target workload to watch OpsPilot detect anomalies and trigger an autonomous rollback in real time.
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className={`status-badge ${isHealthy ? 'healthy' : 'degraded'}`}>
              <div className={`pulse-dot ${isHealthy ? 'green' : 'red'}`} />
              <span>{isHealthy ? 'Workload Normal' : `Fault Active: ${simulatedFault?.type || 'Degraded'}`}</span>
            </div>

            <button className="btn btn-secondary" onClick={handleReset} disabled={isLoading}>
              <RefreshCw size={14} className={isLoading ? 'spin' : ''} />
              <span>Reset to Healthy</span>
            </button>
          </div>
        </div>

        {/* Live Threshold Tracker Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'var(--bg-card-subtle)', padding: '12px 18px', borderRadius: '8px', border: '1px solid var(--border-subtle)', flexWrap: 'wrap' }}>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            Target: <code>http://demo-service:5002/healthz</code>
          </div>
          <div style={{ height: '14px', width: '1px', background: 'var(--border-subtle)' }} />
          <div style={{ fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Consecutive Probe Failures:</span>
            <span 
              className="mono" 
              style={{ 
                fontWeight: 700, 
                padding: '2px 8px', 
                borderRadius: '4px',
                background: consecutive >= threshold ? '#fee2e2' : '#dcfce7',
                color: consecutive >= threshold ? '#dc2626' : '#15803d',
              }}
            >
              {consecutive} / {threshold}
            </span>
          </div>
          <div style={{ height: '14px', width: '1px', background: 'var(--border-subtle)' }} />
          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            Recovery Policy: <strong style={{ color: '#4f46e5' }}>AUTOMATED_ROLLBACK</strong> (Triggers at &gt;= 3 failures)
          </div>
        </div>
      </div>

      {/* Simulation Trigger Cards */}
      <div className="lab-grid">
        {/* Card 1: Probe Failure */}
        <div className="lab-action-card" style={{ borderTop: '3px solid #ef4444' }}>
          <div>
            <div className="lab-card-title">
              <Flame size={18} color="#ef4444" />
              <span>1. Liveness Probe Failure</span>
            </div>
            <div className="lab-card-desc">
              Forces <code>/healthz</code> to return HTTP 500. Simulates severe thread pool exhaustion. OpsPilot detects 3 consecutive failures and triggers auto-rollback.
            </div>
          </div>
          <button
            className="btn btn-danger"
            onClick={() => handleSimulate('probe_failure', 'Simulated 500 internal probe failure')}
            disabled={isLoading}
          >
            <span>Simulate Probe Failure (HTTP 500)</span>
          </button>
        </div>

        {/* Card 2: 5xx Error Rate Spike */}
        <div className="lab-action-card" style={{ borderTop: '3px solid #f59e0b' }}>
          <div>
            <div className="lab-card-title">
              <AlertTriangle size={18} color="#f59e0b" />
              <span>2. 5xx Error Rate Spike (85%)</span>
            </div>
            <div className="lab-card-desc">
              Simulates database connection pool exhaustion. 85% of order requests fail with HTTP 500, triggering error rate anomaly alerts.
            </div>
          </div>
          <button
            className="btn btn-secondary"
            style={{ color: '#d97706', borderColor: '#fde68a' }}
            onClick={() => handleSimulate('error_spike', 'Simulated DB connection pool exhaustion (85% errors)')}
            disabled={isLoading}
          >
            <span>Simulate Error Spike</span>
          </button>
        </div>

        {/* Card 3: High Latency */}
        <div className="lab-action-card" style={{ borderTop: '3px solid #7c3aed' }}>
          <div>
            <div className="lab-card-title">
              <Timer size={18} color="#7c3aed" />
              <span>3. Latency Spike (1200ms)</span>
            </div>
            <div className="lab-card-desc">
              Adds artificial 1200ms delay to all request processing. Simulates slow microservice calls, locking, or network congestion.
            </div>
          </div>
          <button
            className="btn btn-secondary"
            style={{ color: '#7c3aed', borderColor: '#ddd6fe' }}
            onClick={() => handleSimulate('latency', 'Simulated 1200ms artificial delay')}
            disabled={isLoading}
          >
            <span>Simulate High Latency</span>
          </button>
        </div>

        {/* Card 4: Reset & Self-Heal */}
        <div className="lab-action-card" style={{ borderTop: '3px solid #10b981' }}>
          <div>
            <div className="lab-card-title">
              <ShieldCheck size={18} color="#10b981" />
              <span>4. Reset & Self-Heal</span>
            </div>
            <div className="lab-card-desc">
              Deactivates all fault injection switches, resets probe failure counters, and verifies that the workload returns to 100% operational health.
            </div>
          </div>
          <button
            className="btn btn-success"
            onClick={handleReset}
            disabled={isLoading}
          >
            <span>Restore Healthy State</span>
          </button>
        </div>
      </div>

      {/* End-to-End Recovery Flow Visualization */}
      <div className="glass-panel">
        <div className="panel-title" style={{ marginBottom: '14px' }}>
          <Zap size={18} color="#4f46e5" />
          <span>OpsPilot Autonomous Recovery Life-Cycle</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
          {[
            { step: '1. Fault Injected', desc: 'Simulated 500 error or probe failure active', status: !isHealthy ? 'active' : 'done' },
            { step: '2. Detection', desc: 'Liveness probe checks fail consecutively', status: consecutive > 0 ? 'active' : 'done' },
            { step: '3. Policy Evaluation', desc: 'Threshold >= 3 breached', status: consecutive >= threshold ? 'active' : 'done' },
            { step: '4. Incident Registered', desc: 'Incident code INC-XXXX logged with root cause', status: consecutive >= threshold ? 'active' : 'done' },
            { step: '5. Automated Rollback', desc: 'Deploys last verified release (v1.0.1)', status: 'done' },
            { step: '6. Verification', desc: 'Probes return HTTP 200, incident resolved', status: isHealthy ? 'done' : 'pending' },
          ].map((item, idx) => (
            <div
              key={item.step}
              style={{
                background: item.status === 'active' ? 'var(--rose-bg)' : 'var(--bg-card-subtle)',
                border: item.status === 'active' ? '1px solid var(--rose-border)' : '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '12px',
                fontSize: '0.8rem',
              }}
            >
              <div style={{ fontWeight: 700, color: item.status === 'active' ? '#dc2626' : '#4f46e5', marginBottom: '4px' }}>
                {item.step}
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.74rem' }}>
                {item.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
