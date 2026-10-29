const recoveryEngine = require('../services/recoveryEngine');

exports.simulateFault = async (req, res) => {
  try {
    const { type, reason, latencyMs } = req.body;
    let faultType = type || 'probe_failure';
    let faultReason = reason;

    if (faultType === 'probe_failure') {
      faultReason = faultReason || 'Controlled Simulation: Liveness probe check returning HTTP 500';
      await recoveryEngine.injectDemoFault('unhealthy', faultReason);
    } else if (faultType === 'crash_loop') {
      faultReason = faultReason || 'Controlled Simulation: Fatal container panic causing CrashLoopBackOff';
      await recoveryEngine.injectDemoFault('crash', faultReason);
    } else if (faultType === 'error_spike') {
      faultReason = faultReason || 'Controlled Simulation: Upstream connection pool starvation (85% 5xx errors)';
      await recoveryEngine.injectDemoFault('error_spike', faultReason);
    } else if (faultType === 'latency') {
      faultReason = faultReason || 'Controlled Simulation: Thread lock contention causing 1200ms latency spike';
      await recoveryEngine.injectDemoFault('latency', faultReason);
    }

    res.json({
      success: true,
      message: `Controlled failure simulation activated: ${faultType}`,
      details: {
        type: faultType,
        reason: faultReason,
        target: recoveryEngine.targetUrl,
        consecutiveFailures: recoveryEngine.consecutiveFailures,
        threshold: recoveryEngine.failureThreshold,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.resetFault = async (req, res) => {
  try {
    await recoveryEngine.resetDemoAppFault();
    recoveryEngine.consecutiveFailures = 0;
    recoveryEngine.activeSimulatedFault = null;
    recoveryEngine.log('INFO', 'Controlled failure simulation deactivated. Workload restored to normal state.');

    res.json({
      success: true,
      message: 'Controlled failure simulation deactivated. Workload healthy.',
      consecutiveFailures: 0,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getDemoStatus = (req, res) => {
  res.json({
    success: true,
    data: {
      targetUrl: recoveryEngine.targetUrl,
      consecutiveFailures: recoveryEngine.consecutiveFailures,
      failureThreshold: recoveryEngine.failureThreshold,
      activeFault: recoveryEngine.activeSimulatedFault,
      lastCheck: recoveryEngine.lastHealthCheck,
    },
  });
};
