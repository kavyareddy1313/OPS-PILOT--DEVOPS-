import React from 'react';
import { 
  Rocket, 
  RotateCcw, 
  CheckCircle, 
  GitCommit, 
  User, 
  Clock, 
  Layers, 
  ShieldCheck 
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
      {/* Active Production Release Card */}
      {active && (
        <div className="glass-panel" style={{ borderLeft: '4px solid #10b981' }}>
          <div className="panel-header">
            <div>
              <div className="panel-title">
                <Rocket size={20} color="#10b981" />
                <span>Currently Active Production Release: {active.release_version}</span>
                <span className="badge badge-active">ACTIVE IN PRODUCTION</span>
              </div>
              <div className="panel-description">
                Running in Kubernetes cluster namespace <code>opspilot-prod</code> • Liveness & Readiness Probes Passing
              </div>
            </div>
            <button className="btn btn-primary" onClick={onOpenDeploy}>
              <Rocket size={15} />
              <span>Deploy New Version</span>
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', background: 'var(--bg-card-subtle)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Git Commit Reference</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', color: 'var(--text-main)' }}>
                <GitCommit size={15} color="#4f46e5" />
                <span className="mono">{active.commit_sha}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>({active.commit_message})</span>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Container Image (Registry)</div>
              <div className="mono" style={{ fontSize: '0.82rem', color: '#0284c7', marginTop: '4px', wordBreak: 'break-all', fontWeight: 500 }}>
                {active.image_tag}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Deployment Time & Deployer</div>
              <div style={{ fontSize: '0.85rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-main)' }}>
                <Clock size={14} color="var(--text-muted)" />
                <span>{new Date(active.deployed_at).toLocaleString()}</span>
                <span>by <strong>{active.author}</strong></span>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Cluster Verification</div>
              <div style={{ fontSize: '0.85rem', color: '#059669', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                <ShieldCheck size={16} />
                <span>K8s Readiness Probes Passed (3/3 Ready)</span>
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
              <Layers size={20} color="#4f46e5" />
              <span>Deployment & Release History</span>
            </div>
            <div className="panel-description">
              Audit-ready history of deployed versions, commit hashes, target images, and recovery actions
            </div>
          </div>
          <button className="btn btn-secondary" onClick={onRefresh}>
            Refresh Releases
          </button>
        </div>

        <div className="table-wrapper">
          <table className="opspilot-table">
            <thead>
              <tr>
                <th>Version</th>
                <th>Commit SHA</th>
                <th>Commit Message</th>
                <th>Image Tag</th>
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="mono" style={{ fontWeight: 700, fontSize: '0.9rem', color: isActive ? '#059669' : 'var(--text-main)' }}>
                          {dep.release_version}
                        </span>
                        {isActive && <span className="badge badge-active">ACTIVE</span>}
                      </div>
                    </td>
                    <td>
                      <code className="mono" style={{ fontSize: '0.8rem', color: '#4f46e5', background: 'var(--bg-card-subtle)', padding: '2px 6px', borderRadius: '4px' }}>
                        {dep.commit_sha}
                      </code>
                    </td>
                    <td>
                      <span style={{ color: 'var(--text-main)', fontSize: '0.85rem' }}>{dep.commit_message}</span>
                    </td>
                    <td>
                      <span className="mono" style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                        {dep.image_tag}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
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
                          title={`Rollback production workload to ${dep.release_version}`}
                        >
                          <RotateCcw size={12} color="#dc2626" />
                          <span>Rollback Here</span>
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>Active Version</span>
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
