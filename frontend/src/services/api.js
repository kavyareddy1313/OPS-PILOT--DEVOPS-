const API_BASE = '/api';

export async function fetchSummary() {
  const res = await fetch(`${API_BASE}/metrics/summary`);
  if (!res.ok) throw new Error('Failed to fetch summary');
  return res.json();
}

export async function fetchTimeSeries() {
  const res = await fetch(`${API_BASE}/metrics/timeseries`);
  if (!res.ok) throw new Error('Failed to fetch time series');
  return res.json();
}

export async function fetchDeployments() {
  const res = await fetch(`${API_BASE}/deployments`);
  if (!res.ok) throw new Error('Failed to fetch deployments');
  return res.json();
}

export async function createDeployment(payload) {
  const res = await fetch(`${API_BASE}/deployments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to trigger deployment');
  }
  return res.json();
}

export async function triggerRollback(targetVersion, reason = '') {
  const res = await fetch(`${API_BASE}/deployments/rollback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ target_version: targetVersion, reason }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to trigger rollback');
  }
  return res.json();
}

export async function fetchIncidents() {
  const res = await fetch(`${API_BASE}/incidents`);
  if (!res.ok) throw new Error('Failed to fetch incidents');
  return res.json();
}

export async function fetchPolicies() {
  const res = await fetch(`${API_BASE}/policies`);
  if (!res.ok) throw new Error('Failed to fetch policies');
  return res.json();
}

export async function fetchAuditLogs() {
  const res = await fetch(`${API_BASE}/audit`);
  if (!res.ok) throw new Error('Failed to fetch audit logs');
  return res.json();
}

export async function simulateFault(type, reason) {
  const res = await fetch(`${API_BASE}/demo/simulate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, reason }),
  });
  if (!res.ok) throw new Error('Failed to simulate fault');
  return res.json();
}

export async function resetFault() {
  const res = await fetch(`${API_BASE}/demo/reset`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to reset fault');
  return res.json();
}

export async function fetchLogs(level = '') {
  const url = level ? `${API_BASE}/logs?level=${level}` : `${API_BASE}/logs`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch logs');
  return res.json();
}
