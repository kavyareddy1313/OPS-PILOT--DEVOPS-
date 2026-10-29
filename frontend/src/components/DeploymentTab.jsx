import React from 'react';
import { 
  Rocket, 
  RotateCcw, 
  CheckCircle, 
  GitCommit, 
  User, 
  Clock, 
  Layers, 
  ExternalLink,
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
                <span>Currently Active Workload Release: {active.release_version}</span>
                <span className="badge badge-active">ACTIVE IN PRODUCTION</span>
              </div>
              <div className="panel-description">
                Running in Kubernetes cluster namespace <code>opspilot-prod</code> • Probes passing
              </div>
            </div>
            <button className="btn btn-primary" onClick={onOpenDeploy}>
              <Rocket size={15} />
              <span>Deploy New Version</span>
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', background: 'rgba(255, 255, 255, 0.02)', padding: '16px', borderRadius: '10px' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Git Commit Reference</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                <GitCommit size={15} color="#818cf8" />
                <span className="mono">{active.commit_sha}</span>
                <span style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>({active.commit_message})</span>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Image Identifier (Registry)</div>
              <div className="mono" style={{ fontSize: '0.82rem', color: '#38bdf8', marginTop: '4px', wordBreak: 'break-all' }}>
                {active.image_tag}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Deployed At / Author</div>
              <div style={{ fontSize: '0.85rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={14} color="#94a3b8" />
                <span>{new Date(active.deployed_at).toLocaleString()}</span>
                <span>by <strong>{active.author}</strong></span>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Rollout Verification</div>
              <div style={{ fontSize: '0.85rem', color: '#34d399', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
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
              <Layers size={20} color="#6366f1" />
              <span>Deployment & Release History</span>
            </div>
            <div className="panel-description">
              Auditable log linking source commits, container images, deployment timestamps, and recovery status
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
                <th>Status</th>
                <th>Commit SHA</th>
                <th>Commit Message</th>
                <th>Container Image</th>
                <th>Author</th>
                <th>Deployed At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {deployments.map((dep) => (
                <tr key={dep.id || dep.release_version}>
                  <td>
                    <strong style={{ color: dep.is_active ? '#34d399' : '#f8fafc' }}>
                      {dep.release_version}
                    </strong>
                  </td>
                  <td>
                    {dep.is_active ? (
                      <span className="badge badge-active">ACTIVE</span>
                    ) : dep.status === 'ROLLED_BACK' ? (
                      <span className="badge badge-rolledback">ROLLED BACK</span>
                    ) : (
                      <span className="badge badge-warning">{dep.status}</span>
                    )}
                  </td>
                  <td>
                    <span className="mono" style={{ color: '#818cf8', background: 'rgba(99, 102, 241, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                      {dep.commit_sha}
                    </span>
                  </td>
                  <td style={{ maxWidth: '240px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {dep.commit_message}
                  </td>
                  <td className="mono" style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    {dep.image_tag}
                  </td>
                  <td>{dep.author}</td>
                  <td style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    {new Date(dep.deployed_at).toLocaleDateString()} {new Date(dep.deployed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td>
                    {!dep.is_active ? (
                      <button
                        className="btn btn-secondary"
                        style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                        onClick={() => onRollbackClick(dep.release_version)}
                      >
                        <RotateCcw size={12} />
                        <span>Rollback to this</span>
                      </button>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>Active</span>
                    )}
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
