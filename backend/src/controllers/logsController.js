const recoveryEngine = require('../services/recoveryEngine');

exports.getLogs = (req, res) => {
  const { level, limit = 100 } = req.query;
  let logs = recoveryEngine.logs;

  if (level) {
    logs = logs.filter((l) => l.level === level.toUpperCase());
  }

  res.json({
    success: true,
    total: logs.length,
    data: logs.slice(0, parseInt(limit)),
  });
};
