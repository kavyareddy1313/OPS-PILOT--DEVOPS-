import React from 'react';
import { 
  FileCheck2, 
  GitCommit, 
  ShieldCheck, 
  User, 
  Clock, 
  Terminal 
} from 'lucide-react';

export default function AuditTrailTab({ auditLogs, onRefresh }) {
  return (
    <div className="content-section">
      <div className="glass-panel">
        <div className="panel-header">
          <div>
            <div className="panel-title">
              <FileCheck2 size={20} color="#10b981" />
              <span>Immutable DevOps Audit Trail & Provenance</span>
            </div>
            <div className="panel-description">
              End-to-end chain of custody connecting Git commits, container image signatures, deployments, incidents, and policy recoveries.
            </div>
          </div>
          <button className="btn btn-secondary" onClick={onRefresh}>
            Refresh Audit Logs
          </button>
        </div>

        <div className="table-wrapper">
          <table className="opspilot-table">
            <thead>
              <tr>
                <th>Event Type</th>
                <th>Actor / Source</th>
                <th>Details & Payload</th>
                <th>Timestamp</th>
                <th>Integrity</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((log) => (
                <tr key={log.id}>
                  <td>
                    <span 
                      className="mono" 
                      style={{ 
                        fontWeight: 600, 
                        color: log.event_type.includes('ROLLBACK') ? '#34d399' : log.event_type.includes('INCIDENT') ? '#fb7185' : '#818cf8',
                        background: 'rgba(255, 255, 255, 0.04)',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '0.78rem'
                      }}
                    >
                      {log.event_type}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <User size={13} color="#94a3b8" />
                      <span>{log.actor}</span>
                    </div>
                  </td>
                  <td>
                    <pre className="mono" style={{ fontSize: '0.75rem', color: '#cbd5e1', margin: 0 }}>
                      {typeof log.details === 'object' ? JSON.stringify(log.details) : log.details}
                    </pre>
                  </td>
                  <td style={{ fontSize: '0.78rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td>
                    <span className="badge badge-active" style={{ fontSize: '0.7rem' }}>
                      <ShieldCheck size={11} /> VERIFIED
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
