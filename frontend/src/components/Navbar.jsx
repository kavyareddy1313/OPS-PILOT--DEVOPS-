import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Server, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  RotateCcw, 
  PlusCircle, 
  Sparkles 
} from 'lucide-react';

export default function Navbar({ summary, onOpenDeploy, onOpenRollback, activeTab, setActiveTab }) {
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const isHealthy = summary?.health?.isHealthy;
  const activeRelease = summary?.activeRelease?.version || 'v1.0.2';
  const openIncidents = summary?.counts?.openIncidents || 0;

  return (
    <nav className="navbar">
      <div className="brand-section">
        <div className="brand-logo">
          <Compass size={26} strokeWidth={2.2} />
        </div>
        <div>
          <div className="brand-title">OpsPilot</div>
          <div className="brand-subtitle">Automated Deployment & Recovery Platform</div>
        </div>
      </div>

      <div className="header-status-group">
        <div className="cluster-pill">
          <Server size={14} />
          <span>k8s: <strong>opspilot-prod</strong></span>
        </div>

        <div className="cluster-pill">
          <Clock size={14} />
          <span className="mono">{time}</span>
        </div>

        <div className={`status-badge ${isHealthy ? 'healthy' : 'degraded'}`}>
          <div className={`pulse-dot ${isHealthy ? 'green' : 'red'}`} />
          <span>{isHealthy ? 'All Systems Healthy' : `Incident Detected (${openIncidents} Active)`}</span>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-secondary" onClick={onOpenRollback} title="Emergency rollback to verified release">
            <RotateCcw size={15} />
            <span>Rollback</span>
          </button>
          <button className="btn btn-primary" onClick={onOpenDeploy}>
            <PlusCircle size={15} />
            <span>Deploy</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
