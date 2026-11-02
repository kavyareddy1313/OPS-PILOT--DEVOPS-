const { Pool } = require('pg');

let pool = null;
let useFallback = false;

// In-memory persistent state for local standalone execution
const fallbackStore = {
  deployments: [
    {
      id: 1,
      release_version: 'v1.0.0',
      commit_sha: '98ec21a',
      commit_message: 'feat: initial release with order ingestion',
      author: 'kavyasr',
      environment: 'production',
      status: 'ROLLED_BACK',
      image_tag: 'ghcr.io/kavyareddy1313/demo-service:v1.0.0',
      replicas_desired: 3,
      replicas_ready: 3,
      deployed_at: new Date(Date.now() - 3 * 86400000).toISOString(),
      is_active: false,
      verification_status: 'PASSED',
      notes: 'Initial baseline release',
    },
    {
      id: 2,
      release_version: 'v1.0.1',
      commit_sha: 'b42c109',
      commit_message: 'perf: add redis caching layer to catalog queries',
      author: 'kavyasr',
      environment: 'production',
      status: 'ROLLED_BACK',
      image_tag: 'ghcr.io/kavyareddy1313/demo-service:v1.0.1',
      replicas_desired: 3,
      replicas_ready: 3,
      deployed_at: new Date(Date.now() - 1 * 86400000).toISOString(),
      is_active: false,
      verification_status: 'PASSED',
      notes: 'Stable release marked as recovery target',
    },
    {
      id: 3,
      release_version: 'v1.0.2',
      commit_sha: 'a8f3b21',
      commit_message: 'feat: introduce automated health probe analytics',
      author: 'kavyasr',
      environment: 'production',
      status: 'HEALTHY',
      image_tag: 'ghcr.io/kavyareddy1313/demo-service:v1.0.2',
      replicas_desired: 3,
      replicas_ready: 3,
      deployed_at: new Date(Date.now() - 2 * 3600000).toISOString(),
      is_active: true,
      verification_status: 'PASSED',
      notes: 'Current active production release',
    },
  ],
  incidents: [
    {
      id: 1,
      incident_code: 'INC-1001',
      severity: 'CRITICAL',
      title: 'Simulated Health Probe Exhaustion',
      description: 'Readiness & liveness probes returned HTTP 500 continuously.',
      root_cause: 'Memory leak in mock cache subsystem under load.',
      affected_version: 'v1.0.1-rc2',
      target_recovery_version: 'v1.0.1',
      status: 'RESOLVED',
      recovery_action_taken: 'Rollback to v1.0.1 executed in 38 seconds. Probes verified healthy.',
      detected_at: new Date(Date.now() - 6 * 3600000).toISOString(),
      resolved_at: new Date(Date.now() - 5.8 * 3600000).toISOString(),
      automated_recovery: true,
    },
  ],
  policies: [
    {
      id: 1,
      name: 'Critical Health Probe Failure',
      trigger_rule: 'PROBE_FAILURE_COUNT >= 3',
      threshold_value: '3 failures / 15s',
      cooldown_seconds: 45,
      action_type: 'AUTOMATED_ROLLBACK',
      is_enabled: true,
      description: 'Trigger automated rollback to last known-good version when liveness probe fails consecutively',
    },
    {
      id: 2,
      name: 'High 5xx Error Rate Spike',
      trigger_rule: 'HTTP_5XX_PERCENTAGE > 20%',
      threshold_value: '20% over 30s',
      cooldown_seconds: 60,
      action_type: 'AUTOMATED_ROLLBACK',
      is_enabled: true,
      description: 'Detect application exception storm and rollback',
    },
    {
      id: 3,
      name: 'CrashLoopBackOff Protection',
      trigger_rule: 'POD_RESTART_RATE >= 4',
      threshold_value: '4 restarts / 120s',
      cooldown_seconds: 90,
      action_type: 'AUTOMATED_ROLLBACK',
      is_enabled: true,
      description: 'Recover from crashing container image by rolling back to verified image',
    },
  ],
  audit_logs: [
    {
      id: 1,
      event_type: 'POLICY_CREATED',
      actor: 'system',
      details: { policy: 'Critical Health Probe Failure', action: 'AUTOMATED_ROLLBACK' },
      created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    },
    {
      id: 2,
      event_type: 'DEPLOYMENT_COMPLETED',
      actor: 'github-actions',
      details: { version: 'v1.0.2', commit: 'a8f3b21', status: 'HEALTHY' },
      created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
    },
    {
      id: 3,
      event_type: 'HEALTH_CHECK_PASSED',
      actor: 'opspilot-monitor',
      details: { target: 'demo-service', probe: 'healthz', latency_ms: 14 },
      created_at: new Date(Date.now() - 5 * 60000).toISOString(),
    },
  ],
};

async function initDb() {
  const connectionString = process.env.DATABASE_URL;

  if (connectionString || process.env.PGHOST) {
    try {
      pool = new Pool({
        connectionString: connectionString || `postgresql://${process.env.PGUSER || 'postgres'}:${process.env.PGPASSWORD || 'postgres'}@${process.env.PGHOST || 'localhost'}:${process.env.PGPORT || 5432}/${process.env.PGDATABASE || 'opspilot'}`,
        connectionTimeoutMillis: 3000,
      });

      // Test connection
      const client = await pool.connect();
      console.log('Connected successfully to PostgreSQL database.');

      // Check if schema needs initialization
      try {
        const checkTable = await client.query("SELECT to_regclass('public.deployments')");
        if (!checkTable.rows[0]?.to_regclass) {
          console.log('Deployments table not found. Auto-applying schema and seed data...');
          const fs = require('fs');
          const path = require('path');
          const schemaPath = path.join(__dirname, '../db/schema.sql');
          const seedsPath = path.join(__dirname, '../db/seeds.sql');
          if (fs.existsSync(schemaPath)) {
            await client.query(fs.readFileSync(schemaPath, 'utf8'));
          }
          if (fs.existsSync(seedsPath)) {
            await client.query(fs.readFileSync(seedsPath, 'utf8'));
          }
          console.log('Database schema and seeds auto-initialized successfully.');
        }
      } catch (migrationErr) {
        console.warn('Auto-migration notice:', migrationErr.message);
      }

      client.release();
      useFallback = false;
      return;
    } catch (err) {
      console.warn('PostgreSQL connection failed, operating in high-performance resilient fallback mode.', err.message);
      useFallback = true;
    }
  } else {
    console.log('No PostgreSQL connection string provided, using embedded fallback store for rapid local development.');
    useFallback = true;
  }
}

// Unified query executor
async function query(text, params = []) {
  if (!useFallback && pool) {
    try {
      const res = await pool.query(text, params);
      return res;
    } catch (err) {
      console.error('PostgreSQL query error, falling back to local store:', err.message);
      useFallback = true;
    }
  }

  // Fallback query routing for standard operations
  const normalized = text.trim().toUpperCase();

  if (normalized.includes('FROM DEPLOYMENTS')) {
    let rows = [...fallbackStore.deployments].sort((a, b) => new Date(b.deployed_at) - new Date(a.deployed_at));
    return { rows, rowCount: rows.length };
  }

  if (normalized.includes('FROM INCIDENTS')) {
    let rows = [...fallbackStore.incidents].sort((a, b) => new Date(b.detected_at) - new Date(a.detected_at));
    return { rows, rowCount: rows.length };
  }

  if (normalized.includes('FROM RECOVERY_POLICIES')) {
    return { rows: fallbackStore.policies, rowCount: fallbackStore.policies.length };
  }

  if (normalized.includes('FROM AUDIT_LOGS')) {
    let rows = [...fallbackStore.audit_logs].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return { rows, rowCount: rows.length };
  }

  return { rows: [], rowCount: 0 };
}

module.exports = {
  initDb,
  query,
  fallbackStore,
  isFallback: () => useFallback,
};
