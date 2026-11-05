import React from 'react';
import { 
  AlertOctagon, 
  Sliders, 
  Clock 
} from 'lucide-react';

export default function IncidentRecoveryTab({ 
  incidents, 
  policies 
}) {
  return (
    <div className="content-section">
      <div className="glass-panel">
        <div className="panel-header">
          <div>
            <div className="panel-title">
              <Sliders size={18} color="var(--primary)" />
              <span>Policy-Driven Recovery Configuration</span>
            </div>
            <div className="panel-description">
              Configured automated policies that evaluate health probes and trigger zero-downtime rollback recovery.
            </div>
          </div>
          <span className="badge badge-active">{policies.length || 3} POLICIES ACTIVE</span>
        </div>

        <div className="table-wrapper">
          <table className="opspilot-table">
            <thead>
              <tr>
                <th>Policy Name</th>
                <th>Trigger Rule</th>
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
                  <td><code className="mono" style={{ color: 'var(--primary)' }}>{pol.trigger_rule}</code></td>
                  <td>{pol.threshold_value}</td>
                  <td>
                    <span className="badge" style={{ background: 'var(--primary-light)', color: 'var(--primary-text)' }}>
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

      <div className="glass-panel">
        <div className="panel-header">
          <div>
            <div className="panel-title">
              <AlertOctagon size={18} color="var(--rose)" />
              <span>Incident Records & Recovery Log</span>
            </div>
            <div className="panel-description">
              Auditable log of detected violations, automated responses, and self-healing recovery outcomes.
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {incidents.map((inc) => (
            <div
              key={inc.id || inc.incident_code}
              style={{
                background: 'var(--bg-card-subtle)',
                border: '1px solid var(--border-subtle)',
                borderLeft: inc.status === 'RESOLVED' ? '3px solid var(--emerald)' : '3px solid var(--rose)',
                borderRadius: '8px',
                padding: '16px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="mono" style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.85rem' }}>
                    {inc.incident_code}
                  </span>
                  <span className={`badge ${inc.status === 'RESOLVED' ? 'badge-resolved' : 'badge-critical'}`}>
                    {inc.status}
                  </span>
                  <span className="badge badge-critical">
                    {inc.severity}
                  </span>
                </div>

                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Clock size={12} />
                  <span>Detected: {new Date(inc.detected_at).toLocaleString()}</span>
                </div>
              </div>

              <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-main)', marginBottom: '4px' }}>
                {inc.title}
              </div>

              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                {inc.description}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', background: 'var(--bg-card)', padding: '10px 14px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Root Cause</div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#dc2626' }}>{inc.root_cause}</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Affected Release</div>
                  <div className="mono" style={{ fontSize: '0.78rem', fontWeight: 600 }}>{inc.affected_version}</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Recovery Target</div>
                  <div className="mono" style={{ fontSize: '0.78rem', fontWeight: 600, color: '#059669' }}>{inc.target_recovery_version}</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Remediation Outcome</div>
                  <div style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 600 }}>{inc.recovery_action_taken}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
