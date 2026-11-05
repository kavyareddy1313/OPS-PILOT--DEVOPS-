const db = require('../config/db');
const recoveryEngine = require('../services/recoveryEngine');
const { deploymentCounter } = require('../metrics/promMetrics');

exports.getDeployments = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM deployments ORDER BY deployed_at DESC');
    res.json({
      success: true,
      total: result.rowCount,
      data: result.rows,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.createDeployment = async (req, res) => {
  try {
    const { release_version, commit_sha, commit_message, author, image_tag, notes } = req.body;

    if (!release_version || !commit_sha) {
      return res.status(400).json({ success: false, error: 'release_version and commit_sha are required.' });
    }

    const version = release_version.trim();
    const sha = commit_sha.trim().substring(0, 7);

    db.fallbackStore.deployments.forEach((d) => {
      d.is_active = false;
      if (d.status === 'HEALTHY') d.status = 'ROLLED_BACK';
    });

    const newDep = {
      id: db.fallbackStore.deployments.length + 1,
      release_version: version,
      commit_sha: sha,
      commit_message: commit_message || `Release deployment ${version}`,
      author: author || 'kavyasr',
      environment: 'production',
      status: 'HEALTHY',
      image_tag: image_tag || `ghcr.io/kavyareddy1313/demo-service:${version}`,
      replicas_desired: 3,
      replicas_ready: 3,
      deployed_at: new Date().toISOString(),
      is_active: true,
      verification_status: 'PASSED',
      notes: notes || 'Automated deployment via OpsPilot API',
    };

    db.fallbackStore.deployments.unshift(newDep);

    db.fallbackStore.audit_logs.unshift({
      id: db.fallbackStore.audit_logs.length + 1,
      event_type: 'DEPLOYMENT_TRIGGERED',
      actor: author || 'kavyasr',
      details: { version, commit: sha, status: 'HEALTHY' },
      created_at: new Date().toISOString(),
    });

    deploymentCounter.labels(version, 'HEALTHY').inc();
    recoveryEngine.log('INFO', `New release ${version} (${sha}) successfully deployed to Kubernetes production namespace.`);

    res.status(201).json({
      success: true,
      message: `Release ${version} deployed and active`,
      data: newDep,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.rollbackDeployment = async (req, res) => {
  try {
    const { target_version, reason } = req.body;

    if (!target_version) {
      return res.status(400).json({ success: false, error: 'target_version is required' });
    }

    const exists = db.fallbackStore.deployments.find((d) => d.release_version === target_version);
    if (!exists) {
      return res.status(404).json({ success: false, error: `Deployment ${target_version} not found in release history` });
    }

    const result = await recoveryEngine.executeRollback(target_version);

    res.json({
      success: true,
      message: `Successfully executed rollback to ${target_version}`,
      data: result,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
