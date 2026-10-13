import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import ts from 'typescript';

const testDirectory = path.dirname(fileURLToPath(import.meta.url));

function loadTypeScript(file, mocks = {}, globals = {}) {
  const cache = new Map();
  function load(filename) {
    filename = path.resolve(filename);
    if (cache.has(filename)) return cache.get(filename).exports;
    const cjsModule = { exports: {} };
    cache.set(filename, cjsModule);
    const source = ts.transpileModule(readFileSync(filename, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
    }).outputText;
    vm.runInNewContext(source, {
      module: cjsModule, exports: cjsModule.exports,
      require: (id) => {
        if (Object.hasOwn(mocks, id)) return mocks[id];
        if (id.startsWith('.')) return load(path.resolve(path.dirname(filename), `${id}.ts`));
        throw new Error(`Unexpected dependency: ${id}`);
      },
      console: { warn() {}, error() {} },
      setInterval: () => 0,
      AbortSignal, Date, ...globals,
    }, { filename });
    return cjsModule.exports;
  }
  return load(file);
}

const trackingApiPath = path.join(testDirectory, '../src/utils/appointmentTracking.ts');

test('tracking sends a normalized email and returns verified appointment data', async () => {
  let sent;
  const expected = { appointments: [{ referenceNumber: 'TEST-001', status: 'CONFIRMED' }] };
  const { requestAppointmentTracking } = loadTypeScript(trackingApiPath, {
    '@/data/siteSettings': { siteSettings: { BACKEND_URL: 'http://localhost:5000' } },
  }, {
    fetch: async (url, options) => {
      sent = { url, options };
      return { ok: true, json: async () => ({ success: true, data: expected }) };
    },
  });
  assert.equal(await requestAppointmentTracking('verify-otp', { email: ' CLIENT@example.invalid ', otp: '123456' }), expected);
  assert.equal(sent.url, 'http://localhost:5000/api/track/verify-otp');
  assert.deepEqual(JSON.parse(sent.options.body), { email: 'client@example.invalid', otp: '123456' });
  assert.ok(sent.options.signal instanceof AbortSignal);
});

for (const [name, response, message] of [
  ['connection failure', () => { throw new TypeError('Failed to fetch'); }, /Unable to connect/],
  ['email delivery failure', () => ({ ok: false, json: async () => ({ success: false, error: { message: 'Failed to send OTP. Please try again.' } }) }), /Failed to send OTP/],
  ['rate limit', () => ({ ok: false, json: async () => ({ success: false, error: { message: 'Too many tracking requests.' } }) }), /Too many tracking requests/],
  ['HTML error response', () => ({ ok: false, json: async () => { throw new SyntaxError('Unexpected token'); } }), /temporarily unavailable/],
  ['empty JSON response', () => ({ ok: true, json: async () => null }), /Unable to track/],
]) {
  test(`tracking reports ${name} without treating it as success`, async () => {
    const { requestAppointmentTracking } = loadTypeScript(trackingApiPath, {
      '@/data/siteSettings': { siteSettings: { BACKEND_URL: 'http://localhost:5000' } },
    }, { fetch: async () => response() });
    await assert.rejects(requestAppointmentTracking('send-otp', { email: 'client@example.invalid' }), message);
  });
}

test('OTP email rejects provider errors and missing delivery configuration', async () => {
  const emailFile = path.join(testDirectory, '../backend/src/services/email.service.ts');
  for (const apiKey of ['', 'test-key']) {
    const { sendOTPEmail } = loadTypeScript(emailFile, {
      '../config/env': { env: { RESEND_API_KEY: apiKey } },
      resend: { Resend: class { emails = { send: async () => ({ error: { message: 'Sender domain is not verified' } }) }; } },
    });
    await assert.rejects(sendOTPEmail({ email: 'client@example.invalid', otp: '123456' }),
      apiKey ? /Sender domain is not verified/ : /not configured/);
  }
});

test('tracking verifies emailed OTPs, returns appointments, and rejects code reuse', async () => {
  let delivered;
  let query;
  const fixture = {
    referenceNumber: 'TEST-001', status: 'CONFIRMED', preferredDate: null,
    createdAt: '2026-10-13T00:00:00.000Z',
    service: { name: 'General Consultation', price: 1000 },
    payment: { status: 'SUCCESS', gateway: 'RAZORPAY' },
  };
  const controller = loadTypeScript(path.join(testDirectory, '../backend/src/controllers/track.controller.ts'), {
    '../config/database': { prisma: { appointment: {
      count: async () => 1,
      findMany: async (options) => { query = options; return [fixture]; },
    } } },
    '../services/email.service': { sendOTPEmail: async (options) => { delivered = options; } },
  });
  const invoke = (handler, body) => new Promise((resolve, reject) => {
    const res = {
      statusCode: 200,
      status(code) { this.statusCode = code; return this; },
      json(data) { resolve({ status: this.statusCode, data }); },
    };
    handler({ body }, res, reject);
  });
  const sent = await invoke(controller.sendTrackingOTP, { email: ' CLIENT@example.invalid ' });
  assert.equal(sent.status, 200);
  assert.equal(delivered.email, 'client@example.invalid');
  assert.match(delivered.otp, /^\d{6}$/);
  const verified = await invoke(controller.verifyTrackingOTP, { email: delivered.email, otp: delivered.otp });
  assert.equal(verified.status, 200);
  assert.equal(verified.data.data.appointments[0].referenceNumber, 'TEST-001');
  assert.equal(verified.data.data.appointments[0].paymentStatus, 'SUCCESS');
  assert.equal(query.where.clientEmail.equals, delivered.email);
  const reused = await invoke(controller.verifyTrackingOTP, { email: delivered.email, otp: delivered.otp });
  assert.equal(reused.status, 401);
});
