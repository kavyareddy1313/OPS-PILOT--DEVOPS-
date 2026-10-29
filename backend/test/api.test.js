const test = require('node:test');
const assert = require('node:assert');
const app = require('../src/app');

// Helper to simulate request to Express app
function makeRequest(path, options = {}) {
  return new Promise((resolve, reject) => {
    const http = require('http');
    const server = http.createServer(app);
    server.listen(0, () => {
      const port = server.address().port;
      const reqOptions = {
        hostname: '127.0.0.1',
        port,
        path,
        method: options.method || 'GET',
        headers: options.headers || {},
      };

      const req = http.request(reqOptions, (res) => {
        let body = '';
        res.on('data', (chunk) => { body += chunk; });
        res.on('end', () => {
          server.close();
          try {
            resolve({ statusCode: res.statusCode, body: JSON.parse(body), rawBody: body });
          } catch (e) {
            resolve({ statusCode: res.statusCode, rawBody: body });
          }
        });
      });

      req.on('error', (err) => {
        server.close();
        reject(err);
      });

      if (options.body) {
        req.write(JSON.stringify(options.body));
      }
      req.end();
    });
  });
}

test('API /api/health returns 200 OK', async () => {
  const res = await makeRequest('/api/health');
  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.status, 'OK');
});

test('API /api/deployments returns release list', async () => {
  const res = await makeRequest('/api/deployments');
  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.success, true);
  assert.ok(Array.isArray(res.body.data));
  assert.ok(res.body.data.length >= 1);
});

test('API /api/metrics/summary returns system indicators', async () => {
  const res = await makeRequest('/api/metrics/summary');
  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.success, true);
  assert.ok(res.body.data.activeRelease);
  assert.ok(res.body.data.health);
  assert.ok(res.body.data.telemetry);
});

test('API /api/incidents returns incidents and policies', async () => {
  const res = await makeRequest('/api/incidents');
  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.success, true);
  assert.ok(Array.isArray(res.body.data));
});

test('API /metrics returns Prometheus metric format', async () => {
  const res = await makeRequest('/metrics');
  assert.strictEqual(res.statusCode, 200);
  assert.ok(res.rawBody.includes('opspilot_'));
});

test.after(() => {
  setTimeout(() => process.exit(0), 100).unref();
});

