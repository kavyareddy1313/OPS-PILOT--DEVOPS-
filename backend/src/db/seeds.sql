-- OpsPilot Initial Seed Data
INSERT INTO deployments (release_version, commit_sha, commit_message, author, environment, status, image_tag, replicas_desired, replicas_ready, deployed_at, is_active, verification_status, notes)
VALUES
('v1.0.0', '98ec21a', 'feat: initial release with order ingestion', 'kavyasr', 'production', 'ROLLED_BACK', 'ghcr.io/kavyareddy1313/demo-service:v1.0.0', 3, 3, NOW() - INTERVAL '3 days', false, 'PASSED', 'Initial baseline release'),
('v1.0.1', 'b42c109', 'perf: add redis caching layer to catalog queries', 'kavyasr', 'production', 'ROLLED_BACK', 'ghcr.io/kavyareddy1313/demo-service:v1.0.1', 3, 3, NOW() - INTERVAL '1 day', false, 'PASSED', 'Stable release marked as recovery target'),
('v1.0.2', 'a8f3b21', 'feat: introduce automated health probe analytics', 'kavyasr', 'production', 'HEALTHY', 'ghcr.io/kavyareddy1313/demo-service:v1.0.2', 3, 3, NOW() - INTERVAL '2 hours', true, 'PASSED', 'Current active production release')
ON CONFLICT (release_version) DO NOTHING;

INSERT INTO recovery_policies (name, trigger_rule, threshold_value, cooldown_seconds, action_type, is_enabled, description)
VALUES
('Critical Health Probe Failure', 'PROBE_FAILURE_COUNT >= 3', '3 failures / 15s', 45, 'AUTOMATED_ROLLBACK', true, 'Trigger automated rollback to last known-good version when liveness probe fails consecutively'),
('High 5xx Error Rate Spike', 'HTTP_5XX_PERCENTAGE > 20%', '20% over 30s', 60, 'AUTOMATED_ROLLBACK', true, 'Detect application exception storm and rollback'),
('CrashLoopBackOff Protection', 'POD_RESTART_RATE >= 4', '4 restarts / 120s', 90, 'AUTOMATED_ROLLBACK', true, 'Recover from crashing container image by rolling back to verified image')
ON CONFLICT DO NOTHING;

INSERT INTO incidents (incident_code, severity, title, description, root_cause, affected_version, target_recovery_version, status, recovery_action_taken, detected_at, resolved_at, automated_recovery)
VALUES
('INC-1001', 'CRITICAL', 'Simulated Health Probe Exhaustion', 'Readiness & liveness probes returned HTTP 500 continuously.', 'Memory leak in mock cache subsystem under load.', 'v1.0.1-rc2', 'v1.0.1', 'RESOLVED', 'Rollback to v1.0.1 executed in 38 seconds. Probes verified healthy.', NOW() - INTERVAL '6 hours', NOW() - INTERVAL '5 hours 59 minutes', true)
ON CONFLICT (incident_code) DO NOTHING;

INSERT INTO audit_logs (event_type, actor, details, created_at)
VALUES
('POLICY_CREATED', 'system', '{"policy": "Critical Health Probe Failure", "action": "AUTOMATED_ROLLBACK"}', NOW() - INTERVAL '3 days'),
('DEPLOYMENT_COMPLETED', 'github-actions', '{"version": "v1.0.2", "commit": "a8f3b21", "status": "HEALTHY"}', NOW() - INTERVAL '2 hours'),
('HEALTH_CHECK_PASSED', 'opspilot-monitor', '{"target": "demo-service", "probe": "healthz", "latency_ms": 14}', NOW() - INTERVAL '5 minutes')
ON CONFLICT DO NOTHING;
