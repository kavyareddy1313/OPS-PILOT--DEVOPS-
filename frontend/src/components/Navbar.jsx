import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Server, 
  Clock, 
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
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const isHealthy = summary?.health?.isHealthy;
  const openIncidents = summary?.counts?.openIncidents || 0;

  return (
    <nav className="navbar">
      <div className="brand-section">
        <div className="brand-logo">
          <Compass size={24} strokeWidth={2.5} />
        </div>
        <div>
          <div className="brand-title">OpsPilot</div>
          <div className="brand-subtitle">Automated Deployment & Self-Healing SRE Platform</div>
        </div>
      </div>

      <div className="header-status-group">
        <div className="cluster-pill">
          <Server size={14} color="#38bdf8" />
          <span>k8s: <strong>opspilot-prod</strong></span>
        </div>

        <div className="cluster-pill">
          <Clock size={14} color="#94a3b8" />
          <span className="mono">{time}</span>
        </div>

        <div className={`status-badge ${isHealthy ? 'healthy' : 'degraded'}`}>
          <div className={`pulse-dot ${isHealthy ? 'green' : 'red'}`} />
          <span>{isHealthy ? 'All Systems Healthy' : `Incident Active (${openIncidents})`}</span>
        </div>

        {/* Theme Switcher Button */}
        <button 
          className="theme-toggle-btn" 
          onClick={onToggleTheme} 
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Bright'} Mode`}
        >
          {theme === 'light' ? <Moon size={14} color="#facc15" /> : <Sun size={14} color="#facc15" />}
          <span>{theme === 'light' ? 'Dark Mode' : 'Bright Mode'}</span>
        </button>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            className="btn btn-secondary" 
            style={{ padding: '7px 14px', fontSize: '0.8rem', background: 'rgba(255, 255, 255, 0.1)', color: '#ffffff', borderColor: 'rgba(255, 255, 255, 0.2)' }}
            onClick={onOpenRollback} 
            title="Emergency rollback to verified release"
          >
            <RotateCcw size={14} color="#f87171" />
            <span>Rollback</span>
          </button>
          <button 
            className="btn btn-primary" 
            style={{ padding: '7px 14px', fontSize: '0.8rem' }}
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
