import React, { useState, useRef, useEffect } from 'react';
import { 
  Terminal, 
  Search, 
  Pause, 
  Play 
} from 'lucide-react';

export default function LiveLogsTab({ logs, onRefresh }) {
  const [filterLevel, setFilterLevel] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isPaused, setIsPaused] = useState(false);
  const terminalEndRef = useRef(null);

  const filteredLogs = logs.filter((l) => {
    const matchesLevel = filterLevel === 'ALL' || l.level === filterLevel;
    const matchesSearch = !searchTerm || l.message.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  useEffect(() => {
    if (!isPaused && terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [filteredLogs, isPaused]);

  return (
    <div className="content-section">
      <div className="glass-panel">
        <div className="panel-header">
          <div>
            <div className="panel-title">
              <Terminal size={20} color="#0284c7" />
              <span>Real-Time Orchestrator & Workload Logs</span>
            </div>
            <div className="panel-description">
              Live stdout/stderr stream from OpsPilot policy runner and monitored Kubernetes container probes
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Filter logs..."
                className="form-input"
                style={{ paddingLeft: '32px', height: '34px', width: '180px', fontSize: '0.78rem' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              className="form-input"
              style={{ height: '34px', width: '110px', fontSize: '0.78rem' }}
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
            >
              <option value="ALL">All Levels</option>
              <option value="INFO">INFO</option>
              <option value="WARN">WARN</option>
              <option value="ERROR">ERROR</option>
              <option value="CRITICAL">CRITICAL</option>
            </select>

            <button
              className="btn btn-secondary"
              style={{ height: '34px', padding: '0 12px' }}
              onClick={() => setIsPaused(!isPaused)}
            >
              {isPaused ? <Play size={14} color="#059669" /> : <Pause size={14} />}
              <span>{isPaused ? 'Resume' : 'Pause'}</span>
            </button>
          </div>
        </div>

        {/* Console Box - Clean Dark Terminal */}
        <div className="terminal-console">
          {filteredLogs.length === 0 ? (
            <div style={{ color: '#64748b', fontStyle: 'italic', padding: '20px', textAlign: 'center' }}>
              No log entries matching the selected criteria.
            </div>
          ) : (
            filteredLogs.map((entry) => (
              <div className="log-entry" key={entry.id}>
                <span className="log-time">{new Date(entry.timestamp).toLocaleTimeString()}</span>
                <span className={`log-level ${entry.level}`}>[{entry.level}]</span>
                <span className="log-msg">{entry.message}</span>
              </div>
            ))
          )}
          <div ref={terminalEndRef} />
        </div>
      </div>
    </div>
  );
}
