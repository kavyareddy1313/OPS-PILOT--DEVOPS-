import React, { useState } from 'react';
import { X, Rocket, GitCommit, CheckCircle2 } from 'lucide-react';

export default function DeployModal({ isOpen, onClose, onDeploy }) {
  const [version, setVersion] = useState('v1.0.3');
  const [commitSha, setCommitSha] = useState('c7e819f');
  const [commitMsg, setCommitMsg] = useState('feat: add intelligent circuit breaker and retry policies');
  const [author, setAuthor] = useState('kavyasr');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onDeploy({
        release_version: version,
        commit_sha: commitSha,
        commit_message: commitMsg,
        author: author,
        image_tag: `ghcr.io/kavyareddy1313/demo-service:${version}`,
      });
      onClose();
    } catch (err) {
      alert(`Deployment failed: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Rocket size={20} color="#6366f1" />
            <h3 style={{ fontSize: '1.2rem', color: '#f8fafc' }}>Deploy New Container Release</h3>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Release Version (SemVer)</label>
            <input
              type="text"
              className="form-input"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Git Commit SHA</label>
            <input
              type="text"
              className="form-input mono"
              value={commitSha}
              onChange={(e) => setCommitSha(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Commit Message</label>
            <input
              type="text"
              className="form-input"
              value={commitMsg}
              onChange={(e) => setCommitMsg(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Deployer / Author</label>
            <input
              type="text"
              className="form-input"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              <Rocket size={15} />
              <span>{isSubmitting ? 'Deploying to Cluster...' : 'Initiate Deployment'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
