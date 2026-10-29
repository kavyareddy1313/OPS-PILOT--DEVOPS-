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
              <Sliders size={20} color="#6366f1" />
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
                  <td><code className="mono">{pol.trigger_rule}</code></td>
                  <td>{pol.threshold_value}</td>
                  <td>
                    <span className="badge" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
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
              <AlertOctagon size={20} color="#f43f5e" />
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
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                borderLeft: inc.status === 'RESOLVED' ? '4px solid #10b981' : '4px solid #f43f5e',
                borderRadius: '8px',
                padding: '18px 20px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className="mono" style={{ fontWeight: 700, color: '#818cf8', fontSize: '0.9rem' }}>
                    {inc.incident_code}
                  </span>
                  <span className={`badge ${inc.status === 'RESOLVED' ? 'badge-resolved' : 'badge-critical'}`}>
                    {inc.status}
                  </span>
                  <span className="badge badge-warning">{inc.severity}</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={13} />
                  <span>Detected: {new Date(inc.detected_at).toLocaleString()}</span>
                </div>
              </div>

              <div style={{ fontSize: '1rem', fontWeight: 600, color: '#f8fafc', marginBottom: '4px' }}>
                {inc.title}
              </div>

              <div style={{ fontSize: '0.84rem', color: '#cbd5e1', marginBottom: '12px' }}>
                {inc.description}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', background: 'rgba(0, 0, 0, 0.25)', padding: '12px', borderRadius: '6px', fontSize: '0.8rem' }}>
                <div>
                  <span style={{ color: '#94a3b8' }}>Affected Version: </span>
                  <strong className="mono" style={{ color: '#fb7185' }}>{inc.affected_version}</strong>
                </div>
                <div>
                  <span style={{ color: '#94a3b8' }}>Recovery Target: </span>
                  <strong className="mono" style={{ color: '#34d399' }}>{inc.target_recovery_version || 'v1.0.1'}</strong>
                </div>
                <div>
                  <span style={{ color: '#94a3b8' }}>Remediation: </span>
                  <span style={{ color: '#38bdf8' }}>{inc.recovery_action_taken || 'Automated rollback initiated'}</span>
                </div>
              </div>

              {inc.status !== 'RESOLVED' && (
                <div style={{ marginTop: '12px', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <button
                    className="btn btn-secondary"
                    style={{ fontSize: '0.78rem', padding: '6px 12px' }}
                    onClick={() => onResolveIncident(inc.id || inc.incident_code)}
                  >
                    Mark as Resolved
                  </button>
                  <button
                    className="btn btn-primary"
                    style={{ fontSize: '0.78rem', padding: '6px 12px' }}
                    onClick={() => onRollbackClick(inc.target_recovery_version || 'v1.0.1')}
                  >
                    <RotateCcw size={12} />
                    <span>Trigger Rollback ({inc.target_recovery_version || 'v1.0.1'})</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
