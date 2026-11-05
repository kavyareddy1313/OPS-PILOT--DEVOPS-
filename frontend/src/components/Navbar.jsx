import React from 'react';
import { 
  Compass, 
  Server, 
  RotateCcw, 
  PlusCircle, 
  Sun, 
  Moon 
} from 'lucide-react';

export default function Navbar({ 
  summary, 
  onOpenDeploy, 
  onOpenRollback, 
  theme, 
  onToggleTheme 
}) {
  const isHealthy = summary?.health?.isHealthy;
  const openIncidents = summary?.counts?.openIncidents || 0;

  return (
    <nav className="navbar">
      <div className="brand-section">
        <div className="brand-logo">
          <Compass size={22} strokeWidth={2.4} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="brand-title">OpsPilot</span>
            <span className="badge badge-active" style={{ fontSize: '0.68rem', padding: '1px 6px' }}>Prod</span>
          </div>
          <div className="brand-subtitle">Autonomous DevOps & Self-Healing Platform</div>
        </div>
      </div>

      <div className="header-status-group">
        <div className="cluster-pill">
          <Server size={13} color="var(--primary)" />
          <span>k8s: <strong>opspilot-prod</strong></span>
        </div>

        <div className={`status-badge ${isHealthy ? 'healthy' : 'degraded'}`}>
          <div className={`pulse-dot ${isHealthy ? 'green' : 'red'}`} />
          <span>{isHealthy ? '100% Operational' : `Incident Active (${openIncidents})`}</span>
        </div>

        <button 
          className="theme-toggle-btn" 
          onClick={onToggleTheme} 
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          {theme === 'light' ? <Moon size={14} color="#6366f1" /> : <Sun size={14} color="#facc15" />}
          <span>{theme === 'light' ? 'Dark' : 'Light'}</span>
        </button>

        <div style={{ display: 'flex', gap: '6px' }}>
          <button 
            className="btn btn-secondary" 
            onClick={onOpenRollback} 
            title="Rollback workload to verified release"
          >
            <RotateCcw size={13} color="#ef4444" />
            <span>Rollback</span>
          </button>
          <button 
            className="btn btn-primary" 
            onClick={onOpenDeploy}
          >
            <PlusCircle size={14} />
            <span>Deploy</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
