import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import MetricCards from './components/MetricCards';
import DeploymentTab from './components/DeploymentTab';
import HealthMetricsTab from './components/HealthMetricsTab';
import IncidentRecoveryTab from './components/IncidentRecoveryTab';
import FailureSimulationLab from './components/FailureSimulationLab';
import AuditTrailTab from './components/AuditTrailTab';
import LiveLogsTab from './components/LiveLogsTab';
import DeployModal from './components/DeployModal';
import RollbackModal from './components/RollbackModal';

import { 
  fetchSummary, 
  fetchTimeSeries, 
  fetchDeployments, 
  createDeployment, 
  triggerRollback, 
  fetchIncidents, 
  fetchPolicies, 
  fetchAuditLogs, 
  simulateFault, 
  resetFault, 
  fetchLogs 
} from './services/api';

import { 
  Rocket, 
  Activity, 
  ShieldCheck, 
  FlaskConical, 
  FileCheck2, 
  Terminal 
} from 'lucide-react';

export default function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('opspilot_theme') || 'light';
  });

  const [activeTab, setActiveTab] = useState('deployments');
  const [summary, setSummary] = useState(null);
  const [timeSeries, setTimeSeries] = useState([]);
  const [deployments, setDeployments] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [logs, setLogs] = useState([]);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [isRollbackModalOpen, setIsRollbackModalOpen] = useState(false);
  const [rollbackTarget, setRollbackTarget] = useState('v1.0.1');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('opspilot_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const loadData = useCallback(async () => {
    try {
      const [sumRes, tsRes, depRes, incRes, polRes, audRes, logRes] = await Promise.all([
        fetchSummary().catch(() => ({ success: false })),
        fetchTimeSeries().catch(() => ({ success: false })),
        fetchDeployments().catch(() => ({ success: false })),
        fetchIncidents().catch(() => ({ success: false })),
        fetchPolicies().catch(() => ({ success: false })),
        fetchAuditLogs().catch(() => ({ success: false })),
        fetchLogs().catch(() => ({ success: false })),
      ]);

      if (sumRes?.success) setSummary(sumRes.data);
      if (tsRes?.success) setTimeSeries(tsRes.data);
      if (depRes?.success) setDeployments(depRes.data);
      if (incRes?.success) setIncidents(incRes.data);
      if (polRes?.success) setPolicies(polRes.data);
      if (audRes?.success) setAuditLogs(audRes.data);
      if (logRes?.success) setLogs(logRes.data);
    } catch (err) {
      console.error('Polling error:', err);
    }
  }, []);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 3500);
    return () => clearInterval(interval);
  }, [loadData]);

  const handleDeploy = async (payload) => {
    await createDeployment(payload);
    await loadData();
    setActiveTab('deployments');
  };

  const handleRollback = async (targetVersion, reason) => {
    await triggerRollback(targetVersion, reason);
    await loadData();
  };

  const handleOpenRollbackForVersion = (targetVersion) => {
    setRollbackTarget(targetVersion);
    setIsRollbackModalOpen(true);
  };

  const handleSimulate = async (type, reason) => {
    setIsLoading(true);
    try {
      await simulateFault(type, reason);
      await loadData();
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async () => {
    setIsLoading(true);
    try {
      await resetFault();
      await loadData();
    } finally {
      setIsLoading(false);
    }
  };

  const availableVersions = deployments
    .map((d) => d.release_version)
    .filter((v) => v !== summary?.activeRelease?.version);

  return (
    <div className="app-container">
      <Navbar
        summary={summary}
        onOpenDeploy={() => setIsDeployModalOpen(true)}
        onOpenRollback={() => {
          setRollbackTarget(availableVersions[0] || 'v1.0.1');
          setIsRollbackModalOpen(true);
        }}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <MetricCards summary={summary} />

      <div className="tab-nav">
        <button
          className={`tab-btn ${activeTab === 'deployments' ? 'active' : ''}`}
          onClick={() => setActiveTab('deployments')}
        >
          <Rocket size={15} />
          <span>Deployments</span>
        </button>

        <button
          className={`tab-btn ${activeTab === 'metrics' ? 'active' : ''}`}
          onClick={() => setActiveTab('metrics')}
        >
          <Activity size={15} />
          <span>Health & Metrics</span>
        </button>

        <button
          className={`tab-btn ${activeTab === 'simulation' ? 'active' : ''}`}
          onClick={() => setActiveTab('simulation')}
        >
          <FlaskConical size={15} />
          <span>Chaos & Self-Healing Lab</span>
          {summary?.simulatedFault && (
            <span className="badge badge-warning" style={{ padding: '1px 6px', fontSize: '0.65rem' }}>
              ACTIVE
            </span>
          )}
        </button>

        <button
          className={`tab-btn ${activeTab === 'incidents' ? 'active' : ''}`}
          onClick={() => setActiveTab('incidents')}
        >
          <ShieldCheck size={15} />
          <span>Policies & Incidents</span>
          {summary?.counts?.openIncidents > 0 && (
            <span className="badge badge-critical" style={{ padding: '1px 6px', fontSize: '0.65rem' }}>
              {summary.counts.openIncidents}
            </span>
          )}
        </button>

        <button
          className={`tab-btn ${activeTab === 'logs' ? 'active' : ''}`}
          onClick={() => setActiveTab('logs')}
        >
          <Terminal size={15} />
          <span>Live Logs</span>
        </button>

        <button
          className={`tab-btn ${activeTab === 'audit' ? 'active' : ''}`}
          onClick={() => setActiveTab('audit')}
        >
          <FileCheck2 size={15} />
          <span>Audit Trail</span>
        </button>
      </div>

      {/* 4. Active Tab Content */}
      {activeTab === 'deployments' && (
        <DeploymentTab
          deployments={deployments}
          onRollbackClick={handleOpenRollbackForVersion}
          onOpenDeploy={() => setIsDeployModalOpen(true)}
          onRefresh={loadData}
        />
      )}

      {activeTab === 'metrics' && (
        <HealthMetricsTab
          summary={summary}
          timeSeries={timeSeries}
        />
      )}

      {activeTab === 'simulation' && (
        <FailureSimulationLab
          summary={summary}
          onSimulateFault={handleSimulate}
          onResetFault={handleReset}
          isLoading={isLoading}
        />
      )}

      {activeTab === 'incidents' && (
        <IncidentRecoveryTab
          incidents={incidents}
          policies={policies}
          onResolveIncident={async (id) => {
            await fetch(`/api/incidents/${id}/resolve`, { method: 'PUT' });
            loadData();
          }}
          onRollbackClick={handleOpenRollbackForVersion}
        />
      )}

      {activeTab === 'logs' && (
        <LiveLogsTab
          logs={logs}
          onRefresh={loadData}
        />
      )}

      {activeTab === 'audit' && (
        <AuditTrailTab
          auditLogs={auditLogs}
          onRefresh={loadData}
        />
      )}

      {/* Modals */}
      <DeployModal
        isOpen={isDeployModalOpen}
        onClose={() => setIsDeployModalOpen(false)}
        onDeploy={handleDeploy}
      />

      <RollbackModal
        isOpen={isRollbackModalOpen}
        targetVersion={rollbackTarget}
        availableVersions={availableVersions.length > 0 ? availableVersions : ['v1.0.1', 'v1.0.0']}
        onClose={() => setIsRollbackModalOpen(false)}
        onConfirm={handleRollback}
      />
    </div>
  );
}
