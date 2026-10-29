-- OpsPilot PostgreSQL Database Schema
CREATE TABLE IF NOT EXISTS deployments (
    id SERIAL PRIMARY KEY,
    release_version VARCHAR(50) NOT NULL UNIQUE,
    commit_sha VARCHAR(40) NOT NULL,
    commit_message TEXT NOT NULL,
    author VARCHAR(100) NOT NULL,
    environment VARCHAR(50) DEFAULT 'production',
    status VARCHAR(50) NOT NULL, -- HEALTHY, DEPLOYING, UNHEALTHY, ROLLED_BACK
    image_tag VARCHAR(255) NOT NULL,
    replicas_desired INT DEFAULT 3,
    replicas_ready INT DEFAULT 3,
    deployed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT false,
    verification_status VARCHAR(50) DEFAULT 'PASSED',
    notes TEXT
);

CREATE TABLE IF NOT EXISTS incidents (
    id SERIAL PRIMARY KEY,
    incident_code VARCHAR(50) NOT NULL UNIQUE,
    severity VARCHAR(20) NOT NULL, -- CRITICAL, HIGH, WARNING, INFO
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    root_cause TEXT,
    affected_version VARCHAR(50) NOT NULL,
    target_recovery_version VARCHAR(50),
    status VARCHAR(50) NOT NULL, -- OPEN, MITIGATING, RESOLVED
    recovery_action_taken VARCHAR(100),
    detected_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP WITH TIME ZONE,
    automated_recovery BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS recovery_policies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    trigger_rule VARCHAR(100) NOT NULL,
    threshold_value VARCHAR(50) NOT NULL,
    cooldown_seconds INT DEFAULT 60,
    action_type VARCHAR(50) NOT NULL, -- AUTOMATED_ROLLBACK, RESTART_PODS, ALERT_DISPATCH
    is_enabled BOOLEAN DEFAULT true,
    description TEXT
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    event_type VARCHAR(100) NOT NULL,
    actor VARCHAR(100) NOT NULL,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS system_metrics (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    cpu_percent NUMERIC(5,2),
    memory_mb NUMERIC(7,2),
    error_rate NUMERIC(5,2),
    latency_ms NUMERIC(6,2),
    active_pods INT,
    healthy_pods INT
);
