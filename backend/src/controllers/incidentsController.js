const db = require('../config/db');

exports.getIncidents = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM incidents ORDER BY detected_at DESC');
    res.json({
      success: true,
      total: result.rowCount,
      data: result.rows,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getPolicies = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM recovery_policies');
    res.json({
      success: true,
      total: result.rowCount,
      data: result.rows,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.resolveIncident = async (req, res) => {
  try {
    const { id } = req.params;
    const { resolution_notes } = req.body;

    const incident = db.fallbackStore.incidents.find((i) => i.id === parseInt(id) || i.incident_code === id);
    if (!incident) {
      return res.status(404).json({ success: false, error: 'Incident not found' });
    }

    incident.status = 'RESOLVED';
    incident.resolved_at = new Date().toISOString();
    incident.recovery_action_taken = resolution_notes || 'Manually marked as resolved by operator.';

    res.json({
      success: true,
      message: `Incident ${incident.incident_code} marked as RESOLVED`,
      data: incident,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getAuditLogs = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM audit_logs ORDER BY created_at DESC');
    res.json({
      success: true,
      total: result.rowCount,
      data: result.rows,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
