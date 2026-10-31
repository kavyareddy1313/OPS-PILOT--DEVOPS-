import React from 'react';
import { 
  Rocket, 
  RotateCcw, 
  GitCommit, 
  Clock, 
  Layers, 
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

export default function DeploymentTab({ 
  deployments, 
  onRollbackClick, 
  onOpenDeploy, 
  onRefresh 
}) {
  const active = deployments.find((d) => d.is_active) || deployments[0];

  return (
    <div className="content-section">
      {/* Active Workload Summary Card */}
      {active && (
        <div className="glass-panel" style={{ borderLeft: '3px solid var(--emerald)' }}>
          <div className="panel-header" style={{ marginBottom: '12px' }}>
            <div>
              <div className="panel-title">
                <Rocket size={18} color="var(--emerald)" />
                <span>Active Workload: <strong>{active.release_version}</strong></span>
                <span className="badge badge-active">Live in Production</span>
              </div>
              <div className="panel-description">
                Running in Kubernetes namespace <code>opspilot-prod</code> • Probes verified healthy
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn btn-secondary" onClick={onRefresh} title="Refresh release history">
                <RefreshCw size={13} />
                <span>Refresh</span>
              </button>
              <button className="btn btn-primary" onClick={onOpenDeploy}>
                <Rocket size={14} />
                <span>Deploy New Version</span>
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', background: 'var(--bg-card-subtle)', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>Git Commit</div>
              <div style={{ fontSize: '0.84rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
                <GitCommit size={14} color="var(--primary)" />
                <span className="mono" style={{ color: 'var(--primary)' }}>{active.commit_sha}</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>({active.commit_message})</span>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>Container Image</div>
              <div className="mono" style={{ fontSize: '0.78rem', color: 'var(--cyan-text)', marginTop: '3px', wordBreak: 'break-all' }}>
                {active.image_tag}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>Deployed By / Time</div>
              <div style={{ fontSize: '0.8rem', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={13} color="var(--text-muted)" />
                <span>{new Date(active.deployed_at).toLocaleString()} by <strong>{active.author}</strong></span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Deployment History Table */}
      <div className="glass-panel">
        <div className="panel-header">
          <div>
            <div className="panel-title">
              <Layers size={18} color="var(--primary)" />
              <span>Release History & Rollback Targets</span>
            </div>
            <div className="panel-description">
              Auditable list of deployed releases. Click "Rollback Here" on any past version to switch traffic instantly.
            </div>
          </div>
        </div>

        <div className="table-wrapper">
          <table className="opspilot-table">
            <thead>
              <tr>
                <th>Version</th>
                <th>Commit SHA</th>
                <th>Commit Message</th>
                <th>Deployed At</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {deployments.map((dep) => {
                const isActive = dep.is_active;
                return (
                  <tr key={dep.id || dep.release_version}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span className="mono" style={{ fontWeight: 700, fontSize: '0.88rem', color: isActive ? 'var(--emerald)' : 'var(--text-main)' }}>
                          {dep.release_version}
                        </span>
                        {isActive && <span className="badge badge-active">ACTIVE</span>}
                      </div>
                    </td>
                    <td>
                      <code className="mono" style={{ fontSize: '0.78rem', color: 'var(--primary)', background: 'var(--bg-card-subtle)', padding: '2px 6px', borderRadius: '4px' }}>
                        {dep.commit_sha}
                      </code>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.82rem' }}>{dep.commit_message}</span>
                    </td>
                    <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                      {new Date(dep.deployed_at).toLocaleString()}
                    </td>
                    <td>
                      {dep.status === 'HEALTHY' && (
                        <span className="badge badge-active">HEALTHY</span>
                      )}
                      {dep.status === 'ROLLED_BACK' && (
                        <span className="badge badge-rolledback">ROLLED BACK</span>
                      )}
                      {dep.status === 'UNHEALTHY' && (
                        <span className="badge badge-critical">UNHEALTHY</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {!isActive ? (
                        <button
                          className="btn btn-secondary"
                          style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                          onClick={() => onRollbackClick(dep.release_version)}
                          title={`Rollback to ${dep.release_version}`}
                        >
                          <RotateCcw size={12} color="#dc2626" />
                          <span>Rollback Here</span>
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.74rem', color: '#059669', fontWeight: 600 }}>Current Live Release</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
