require('dotenv').config();
const app = require('./app');
const { initDb } = require('./config/db');
const recoveryEngine = require('./services/recoveryEngine');

const PORT = process.env.PORT || 5001;

async function bootstrap() {
  try {
    await initDb();

    // Start background health probe monitoring loop (every 5 seconds)
    recoveryEngine.startMonitoring(process.env.PROBE_INTERVAL_MS ? parseInt(process.env.PROBE_INTERVAL_MS) : 5000);

    app.listen(PORT, () => {
      console.log(`=======================================================`);
      console.log(`🚀 OpsPilot Backend API running on port ${PORT}`);
      console.log(`📡 Metrics exposed at: http://localhost:${PORT}/metrics`);
      console.log(`🛰️ Target Demo Microservice URL: ${recoveryEngine.targetUrl}`);
      console.log(`=======================================================`);
    });
  } catch (err) {
    console.error('Fatal initialization error:', err);
    process.exit(1);
  }
}

bootstrap();
