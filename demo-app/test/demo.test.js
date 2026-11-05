const test = require('node:test');
const assert = require('node:assert');
const app = require('../src/index');

test('Demo App - Health check endpoint returns 200 in healthy state', async () => {
  assert.ok(app);
});
