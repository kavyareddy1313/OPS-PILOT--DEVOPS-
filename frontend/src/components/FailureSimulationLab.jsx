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
  const [activeStep, setActiveStep] = useState(1);
  const health = summary?.health || {};
  const isHealthy = health.isHealthy;
  const consecutive = health.consecutiveFailures || 0;
  const threshold = health.failureThreshold || 3;
  const simulatedFault = summary?.simulatedFault;

  const handleSimulate = async (type, reason) => {
    setActiveStep(2);
    await onSimulateFault(type, reason);
  };

  const handleReset = async () => {
    setActiveStep(1);
    await onResetFault();
  };

  return (
    <div className="content-section">
      {/* Banner */}
      <div className="glass-panel" style={{ borderLeft: '4px solid #6366f1' }}>
        <div className="panel-header" style={{ marginBottom: '12px' }}>
          <div>
            <div className="panel-title">
              <FlaskConical size={22} color="#818cf8" />
              <span>Controlled Failure Simulation & Recovery Lab</span>
            </div>
            <div className="panel-description">
              Safely inject controlled application faults into the test environment to observe real-time detection, policy evaluation, and automated rollback self-healing.
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'rgba(0, 0, 0, 0.3)', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
            Target: <code>http://localhost:5002/healthz</code>
          </div>
          <div style={{ height: '14px', width: '1px', background: 'rgba(255, 255, 255, 0.15)' }} />
          <div style={{ fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>Consecutive Probe Failures:</span>
            <span 
              className="mono" 
              style={{ 
                fontWeight: 700, 
                padding: '2px 8px', 
                borderRadius: '4px',
                background: consecutive >= threshold ? 'rgba(244, 63, 94, 0.2)' : 'rgba(16, 185, 129, 0.15)',
                color: consecutive >= threshold ? '#fb7185' : '#34d399',
              }}
            >
              {consecutive} / {threshold}
            </span>
          </div>
          <div style={{ height: '14px', width: '1px', background: 'rgba(255, 255, 255, 0.15)' }} />
          <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
            Active Policy: <strong style={{ color: '#818cf8' }}>AUTOMATED_ROLLBACK</strong> (Trigger at &gt;= 3 failures)
          </div>
        </div>
      </div>

      {/* Simulation Trigger Cards */}
      <div className="lab-grid">
        {/* Card 1: Probe Failure */}
        <div className="lab-action-card" style={{ borderTop: '3px solid #f43f5e' }}>
          <div>
            <div className="lab-card-title">
              <Flame size={18} color="#f43f5e" />
              <span>1. Liveness Probe Failure</span>
            </div>
            <div className="lab-card-desc">
              Forces <code>/healthz</code> to return HTTP 500. Simulates deadlocks or thread pool saturation. OpsPilot monitors probe failures and triggers rollback when threshold (3/3) is breached.
            </div>
          </div>
          <button
            className="btn btn-danger"
            onClick={() => handleSimulate('probe_failure', 'Simulated 500 internal probe failure')}
            disabled={isLoading}
          >
            <span>Simulate Probe 500 Failure</span>
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
              Injects simulated database connection pool exhaustion. 85% of order requests fail with HTTP 500. Violates error rate threshold policy (&gt; 20%).
            </div>
          </div>
          <button
            className="btn btn-secondary"
            style={{ color: '#fbbf24', borderColor: 'rgba(245, 158, 11, 0.3)' }}
            onClick={() => handleSimulate('error_spike', 'Simulated DB connection pool exhaustion (85% errors)')}
            disabled={isLoading}
          >
            <span>Simulate Error Spike</span>
          </button>
        </div>

        {/* Card 3: High Latency */}
        <div className="lab-action-card" style={{ borderTop: '3px solid #a78bfa' }}>
          <div>
            <div className="lab-card-title">
              <Timer size={18} color="#a78bfa" />
              <span>3. Latency Contention (1200ms)</span>
            </div>
            <div className="lab-card-desc">
              Adds artificial 1200ms delay to all request processing. Simulates slow microservice calls, locking, or network degradation.
            </div>
          </div>
          <button
            className="btn btn-secondary"
            style={{ color: '#a78bfa', borderColor: 'rgba(167, 139, 250, 0.3)' }}
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
        <div className="panel-title" style={{ marginBottom: '16px' }}>
          <Zap size={18} color="#6366f1" />
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
                background: item.status === 'active' ? 'rgba(244, 63, 94, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                border: item.status === 'active' ? '1px solid rgba(244, 63, 94, 0.4)' : '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '12px',
                fontSize: '0.8rem',
              }}
            >
              <div style={{ fontWeight: 700, color: item.status === 'active' ? '#fb7185' : '#818cf8', marginBottom: '4px' }}>
                {item.step}
              </div>
              <div style={{ color: '#94a3b8', fontSize: '0.74rem' }}>
                {item.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
