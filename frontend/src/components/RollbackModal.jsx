import React, { useState } from 'react';
import { X, RotateCcw, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function RollbackModal({ isOpen, targetVersion, availableVersions, onClose, onConfirm }) {
  const [selectedVersion, setSelectedVersion] = useState(targetVersion || 'v1.0.1');
  const [reason, setReason] = useState('Manual operator initiated rollback to known-good baseline');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onConfirm(selectedVersion, reason);
      onClose();
    } catch (err) {
      alert(`Rollback failed: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <RotateCcw size={20} color="#fb7185" />
            <h3 style={{ fontSize: '1.2rem', color: '#f8fafc' }}>Trigger Policy-Driven Rollback</h3>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.3)', padding: '12px', borderRadius: '8px', marginBottom: '16px', display: 'flex', gap: '10px', alignItems: 'center' }}>
          <AlertTriangle size={18} color="#fb7185" flexShrink={0} />
          <div style={{ fontSize: '0.8rem', color: '#fb7185' }}>
            Executing a rollback will switch the active Kubernetes traffic routing and container image back to the chosen verified release version.
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Target Recovery Version</label>
            <select
              className="form-input"
              value={selectedVersion}
              onChange={(e) => setSelectedVersion(e.target.value)}
            >
              {availableVersions.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Remediation Justification / Reason</label>
            <textarea
              className="form-input"
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-danger" disabled={isSubmitting}>
              <RotateCcw size={14} />
              <span>{isSubmitting ? 'Executing Rollback...' : `Execute Rollback to ${selectedVersion}`}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
