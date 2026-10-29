import React from 'react';
import { 
  AlertOctagon, 
  ShieldAlert, 
  Sliders, 
  CheckCircle2, 
  Clock, 
  FileText,
  RotateCcw
} from 'lucide-react';

export default function IncidentRecoveryTab({ 
  incidents, 
  policies, 
  onResolveIncident, 
  onRollbackClick 
}) {
  return (
    <div className="content-section">
      {/* Recovery Policies Matrix */}
      <div className="glass-panel">
        <div className="panel-header">
          <div>
            <div className="panel-title">
              <Sliders size={20} color="#4f46e5" />
              <span>Policy-Driven Recovery Configuration</span>
            </div>
            <div className="panel-description">
              Autonomous triggers that detect unhealthy releases and initiate configured remediation
            </div>
          </div>
          <span className="badge badge-active">3 POLICIES ACTIVE</span>
        </div>

        <div className="table-wrapper">
          <table className="opspilot-table">
            <thead>
              <tr>
                <th>Policy Name</th>
                <th>Trigger Condition</th>
                <th>Threshold</th>
                <th>Remediation Action</th>
                <th>Cooldown</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {policies.map((pol) => (
                <tr key={pol.id || pol.name}>
                  <td><strong>{pol.name}</strong></td>
                  <td><code className="mono" style={{ color: '#4f46e5' }}>{pol.trigger_rule}</code></td>
                  <td>{pol.threshold_value}</td>
                  <td>
                    <span className="badge" style={{ background: '#eef2ff', color: '#4338ca', border: '1px solid #c7d2fe' }}>
                      {pol.action_type}
                    </span>
                  </td>
                  <td>{pol.cooldown_seconds}s</td>
                  <td>
                    <span className="badge badge-active">ENABLED</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Incidents Feed */}
      <div className="glass-panel">
        <div className="panel-header">
          <div>
            <div className="panel-title">
              <AlertOctagon size={20} color="#ef4444" />
              <span>Incident Records & Recovery Audit</span>
            </div>
            <div className="panel-description">
              Chronological log of detected violations, automated responses, and recovery outcomes
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {incidents.map((inc) => (
            <div
              key={inc.id || inc.incident_code}
              style={{
                background: 'var(--bg-card-subtle)',
                border: '1px solid var(--border-subtle)',
                borderLeft: inc.status === 'RESOLVED' ? '4px solid #10b981' : '4px solid #ef4444',
                borderRadius: '8px',
                padding: '18px 20px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className="mono" style={{ fontWeight: 700, color: '#4f46e5', fontSize: '0.9rem' }}>
                    {inc.incident_code}
                  </span>
                  <span className={`badge ${inc.status === 'RESOLVED' ? 'badge-resolved' : 'badge-critical'}`}>
                    {inc.status}
                  </span>
                  <span className="badge" style={{ background: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca' }}>
                    {inc.severity}
                  </span>
                </div>

                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={13} />
                  <span>Detected: {new Date(inc.detected_at).toLocaleString()}</span>
                </div>
              </div>

              <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)', marginBottom: '4px' }}>
                {inc.title}
              </div>

              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                {inc.description}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', background: 'var(--bg-surface)', padding: '12px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Root Cause</div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#dc2626' }}>{inc.root_cause}</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Affected Release</div>
                  <div className="mono" style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)' }}>{inc.affected_version}</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Recovery Target</div>
                  <div className="mono" style={{ fontSize: '0.82rem', fontWeight: 600, color: '#059669' }}>{inc.target_recovery_version}</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Remediation Outcome</div>
                  <div style={{ fontSize: '0.82rem', color: '#059669', fontWeight: 600 }}>{inc.recovery_action_taken}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
