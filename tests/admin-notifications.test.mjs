import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { once } from 'node:events';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { test } from 'node:test';
import ts from 'typescript';

const root = fileURLToPath(new URL('../', import.meta.url));
const backendRequire = createRequire(path.join(root, 'backend/package.json'));
const plain = (value) => JSON.parse(JSON.stringify(value));

function load(file, mocks = {}, globals = {}) {
  const cache = new Map();
  function read(filename) {
    if (cache.has(filename)) return cache.get(filename).exports;
    const cjsModule = { exports: {} };
    cache.set(filename, cjsModule);
    const output = ts.transpileModule(readFileSync(filename, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
    }).outputText;
    vm.runInNewContext(output, {
      module: cjsModule, exports: cjsModule.exports,
      require(id) {
        if (Object.hasOwn(mocks, id)) return mocks[id];
        if (id.startsWith('.')) return read(path.resolve(path.dirname(filename), `${id}.ts`));
        return backendRequire(id);
      },
      console: { error() {}, warn() {}, log() {} },
      Buffer, URL, Response, AbortController, Event, setTimeout, clearTimeout, ...globals,
    }, { filename });
    return cjsModule.exports;
  }
  return read(path.join(root, file));
}

const publicConfig = {
  configured: true,
  firebase: { apiKey: 'public-api-key', appId: 'web-app-id', projectId: 'test-project', messagingSenderId: '123456' },
  vapidKey: 'public-vapid-key',
};

test('notification endpoints enforce authentication, database admin role, device ownership and session expiry', async (t) => {
  const express = backendRequire('express');
  const jwt = backendRequire('jsonwebtoken');
  const secret = 'test-only-notification-secret';
  const state = { role: 'ADMIN', exists: true, count: 0, existing: null, writes: [], deletes: [], configured: true };
  const router = load('backend/src/routes/notification.routes.ts', {
    '../config/env': { env: { JWT_SECRET: secret } },
    '../config/firebase': { getAdminPushConfiguration: () => state.configured ? publicConfig : { configured: false } },
    '../config/database': { prisma: {
      user: { findUnique: async () => state.exists ? { role: state.role } : null },
      adminPushDevice: {
        findUnique: async () => state.existing,
        count: async () => state.count,
        upsert: async (value) => { state.writes.push(plain(value)); },
        deleteMany: async (value) => { state.deletes.push(plain(value)); },
      },
    } },
  }).default;
  const app = express();
  app.use(express.json());
  app.use('/notifications', router);
  const server = app.listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(() => new Promise((resolve) => server.close(resolve)));
  const token = jwt.sign({ userId: 'admin-1', role: 'ADMIN' }, secret, { expiresIn: '1h' });
  const deviceToken = 'browser-token-with-at-least-20-characters';
  const request = (method, route, auth = token, body) => fetch(`http://127.0.0.1:${server.address().port}/notifications${route}`, {
    method, headers: { 'Content-Type': 'application/json', ...(auth && { Authorization: `Bearer ${auth}` }) },
    ...(body && { body: JSON.stringify(body) }),
  });

  await t.test('every endpoint rejects anonymous callers', async () => {
    for (const [method, route] of [['GET', '/config'], ['POST', '/devices'], ['DELETE', '/devices']]) {
      assert.equal((await request(method, route, null, method === 'GET' ? undefined : { token: deviceToken })).status, 401);
    }
    assert.equal(state.writes.length, 0);
  });
  await t.test('a forged or expired login cannot enroll a device', async () => {
    for (const invalid of [jwt.sign({ userId: 'admin-1' }, 'wrong-secret'), jwt.sign({ userId: 'admin-1' }, secret, { expiresIn: -1 }), jwt.sign({ role: 'ADMIN' }, secret, { expiresIn: '1h' })]) {
      assert.equal((await request('POST', '/devices', invalid, { token: deviceToken })).status, 401);
    }
  });
  await t.test('database role wins over a valid admin claim in the JWT', async () => {
    state.role = 'CLIENT';
    assert.equal((await request('POST', '/devices', token, { token: deviceToken })).status, 403);
    state.role = 'ADMIN'; state.exists = false;
    assert.equal((await request('GET', '/config')).status, 403);
    state.exists = true;
  });
  await t.test('a valid admin gets public configuration and enrollment expires with their session', async () => {
    assert.deepEqual((await (await request('GET', '/config')).json()).data, publicConfig);
    const response = await request('POST', '/devices', token, { token: deviceToken });
    assert.equal(response.status, 200);
    const { expiresAt } = (await response.json()).data;
    assert.equal(Date.parse(expiresAt), jwt.decode(token).exp * 1000);
    assert.equal(state.writes[0].create.userId, 'admin-1');
    assert.equal(state.writes[0].update.userId, 'admin-1');
  });
  await t.test('a client cannot choose a different recipient or expiry', async () => {
    assert.equal((await request('POST', '/devices', token, { token: deviceToken, userId: 'someone-else' })).status, 400);
    assert.equal((await request('POST', '/devices', token, { token: deviceToken, expiresAt: '2099-01-01' })).status, 400);
    const unbounded = jwt.sign({ userId: 'admin-1', role: 'ADMIN' }, secret);
    assert.equal((await request('POST', '/devices', unbounded, { token: deviceToken })).status, 401);
  });
  await t.test('device limits allow refreshing an existing enrollment', async () => {
    state.count = 20;
    assert.equal((await request('POST', '/devices', token, { token: deviceToken })).status, 409);
    state.existing = { token: deviceToken, userId: 'admin-1' };
    assert.equal((await request('POST', '/devices', token, { token: deviceToken })).status, 200);
  });
  await t.test('disabled Firebase refuses enrollment and deletion is scoped to the caller', async () => {
    state.configured = false;
    assert.equal((await request('POST', '/devices', token, { token: deviceToken })).status, 503);
    assert.equal((await request('DELETE', '/devices', token, { token: deviceToken })).status, 200);
    assert.deepEqual(state.deletes[0], { where: { token: deviceToken, userId: 'admin-1' } });
  });
});

test('Firebase configuration exposes only public fields and rejects credentials from another project', () => {
  const account = { project_id: 'test-project', client_email: 'sender@example.invalid', private_key: 'PRIVATE KEY' };
  const env = {
    FIREBASE_PROJECT_ID: 'test-project', FIREBASE_WEB_API_KEY: 'public-api-key', FIREBASE_WEB_APP_ID: 'web-app-id',
    FIREBASE_MESSAGING_SENDER_ID: '123456', FIREBASE_WEB_VAPID_KEY: 'public-vapid-key',
    FIREBASE_SERVICE_ACCOUNT_BASE64: Buffer.from(JSON.stringify(account)).toString('base64'),
  };
  const mocks = {
    '../config/env': { env }, './env': { env },
    'firebase-admin/app': { getApps: () => [], cert: (value) => value, initializeApp: () => ({}) },
    'firebase-admin/messaging': { getMessaging: () => ({}) },
  };
  assert.deepEqual(plain(load('backend/src/config/firebase.ts', mocks).getAdminPushConfiguration()), publicConfig);
  env.FIREBASE_PROJECT_ID = 'another-project';
  assert.deepEqual(plain(load('backend/src/config/firebase.ts', mocks).getAdminPushConfiguration()), { configured: false });
  env.FIREBASE_SERVICE_ACCOUNT_BASE64 = 'invalid-json';
  assert.deepEqual(plain(load('backend/src/config/firebase.ts', mocks).getAdminPushConfiguration()), { configured: false });
});

test('delivery targets current admin devices, batches messages, and removes invalid tokens without leaking client details', async () => {
  const sent = [], deleted = [];
  let query;
  const notifications = load('backend/src/services/notification.service.ts', {
    '../config/firebase': { getAdminMessaging: () => ({ sendEachForMulticast: async (message) => {
      sent.push(plain(message));
      return { responses: message.tokens.map((_, i) => i === 1 ? { error: { code: 'messaging/registration-token-not-registered' } } : { success: true }) };
    } }) },
    '../config/database': { prisma: { adminPushDevice: {
      deleteMany: async (value) => { deleted.push(plain(value)); },
      findMany: async (value) => { query = plain(value); return Array.from({ length: 501 }, (_, i) => ({ token: `admin-token-${i}` })); },
    } } },
  });
  await notifications.sendAdminBookingNotification('appointment-1', 'PENDING_PAYMENT');
  assert.deepEqual(sent.map((message) => message.tokens.length), [500, 1]);
  assert.deepEqual(query.where.user.role.in, ['ADMIN', 'SUPER_ADMIN']);
  assert.ok(query.where.expiresAt.gt);
  assert.ok(deleted[0].where.expiresAt.lte);
  assert.deepEqual(deleted[1].where.token.in, ['admin-token-1']);
  assert.equal(sent[0].notification, undefined);
  assert.equal(sent[0].data.status, 'PENDING_PAYMENT');
  assert.equal(sent[0].data.url, '/admin-lawyersite/appointments');
  assert.deepEqual(Object.keys(sent[0].data).sort(), ['body', 'status', 'tag', 'title', 'url']);
});

test('missing Firebase and provider failures never reject a booking notification call', async () => {
  for (const getAdminMessaging of [() => null, () => { throw new Error('provider unavailable'); }]) {
    const service = load('backend/src/services/notification.service.ts', {
      '../config/firebase': { getAdminMessaging },
      '../config/database': { prisma: {} },
    });
    await assert.doesNotReject(service.sendAdminBookingNotification('appointment-1', 'CONFIRMED'));
  }
});

test('pending-payment emails escape user input and label unpaid fees accurately', async () => {
  const sent = [];
  const { sendLawyerAlertEmail } = load('backend/src/services/email.service.ts', {
    '../config/env': { env: { RESEND_API_KEY: 'test-key', LAWYER_EMAIL: 'lawyer@example.invalid', EMAIL_FROM_ADDRESS: 'sender@example.invalid' } },
    resend: { Resend: class { emails = { send: async (email) => { sent.push(email); return { error: null }; } }; } },
  });
  await sendLawyerAlertEmail({
    clientName: '<b>Client</b>', clientEmail: 'client@example.invalid', clientPhone: '1234567890',
    referenceNumber: 'TEST-001', serviceName: 'Consultation', message: '<a href="https://evil.invalid">Fake action</a>',
    amount: 1000, appointmentStatus: 'PENDING_PAYMENT',
  });
  assert.equal(sent[0].to, 'lawyer@example.invalid');
  assert.match(sent[0].subject, /Payment Pending/);
  assert.match(sent[0].html, /&lt;b&gt;Client&lt;\/b&gt;/);
  assert.doesNotMatch(sent[0].html, /<a href=/);
  assert.match(sent[0].html, /Consultation Fee/);
  assert.doesNotMatch(sent[0].html, /Amount Paid/);
});

test('creation is silent while checking out and repeated payment callbacks send exactly one confirmation', async () => {
  const events = [], emails = [];
  let changed = false;
  const fixture = {
    id: 'appointment-1', clientName: 'Client', clientEmail: 'client@example.invalid', clientPhone: '1234567890',
    referenceNumber: 'TEST-001', service: { id: 'service-1', name: 'Consultation', price: 1000, isActive: true }, payment: { amount: 1000 },
  };
  const service = load('backend/src/services/appointment.service.ts', {
    '../config/database': { prisma: {
      service: { findUnique: async () => fixture.service },
      appointment: {
        create: async () => ({ ...fixture, status: 'PENDING_PAYMENT' }),
        updateMany: async () => { const count = changed ? 0 : 1; changed = true; return { count }; },
        findUniqueOrThrow: async () => ({ ...fixture, status: 'CONFIRMED' }),
      },
    } },
    '../utils/generateReference': { generateReference: () => 'TEST-001' },
    './email.service': { sendLawyerAlertEmail: async (value) => { emails.push(value); }, sendBookingConfirmationEmail: async () => {} },
    './notification.service': { sendAdminBookingNotification: async (...args) => { events.push(args); } },
    './whatsapp.service': { buildLawyerWhatsAppData: () => ({ clientLink: '' }) },
  });
  const appointment = await service.createAppointment({ clientName: 'Client', clientEmail: 'client@example.invalid', clientPhone: '1234567890', serviceId: 'consultation', disclaimerAccepted: true });
  assert.equal(appointment.status, 'PENDING_PAYMENT');
  assert.deepEqual(events, []);
  assert.deepEqual(emails, []);
  await Promise.all([service.confirmAppointmentAfterPayment('appointment-1'), service.confirmAppointmentAfterPayment('appointment-1')]);
  assert.deepEqual(events, [['appointment-1', 'CONFIRMED']]);
  assert.deepEqual(emails.map((email) => email.appointmentStatus), ['CONFIRMED']);
});

test('checkout tracking stays silent during failed attempts and successful retries', async () => {
  const reports = [];
  const { checkoutOutcomeTracker } = load('src/lib/checkoutOutcome.ts');
  const checkout = checkoutOutcomeTracker(async (reason) => { reports.push(reason); });
  assert.deepEqual(reports, []);
  checkout.onFailure();
  assert.deepEqual(reports, []);
  checkout.onSuccess();
  checkout.onDismiss();
  await Promise.resolve();
  assert.deepEqual(reports, []);
});

test('closing checkout reports cancellation or final failure only once', async () => {
  const { checkoutOutcomeTracker } = load('src/lib/checkoutOutcome.ts');
  for (const failed of [false, true]) {
    const reports = [];
    const checkout = checkoutOutcomeTracker(async (reason) => { reports.push(reason); });
    if (failed) checkout.onFailure();
    checkout.onDismiss();
    checkout.onDismiss();
    await Promise.resolve();
    assert.deepEqual(reports, [failed ? 'FAILED' : 'CANCELLED']);
  }
});

test('checkout proofs bind one appointment and order, expire, and cannot be used as admin JWTs', () => {
  const secret = 'test-only-checkout-proof-secret';
  let now = Date.now();
  const clock = class extends Date { static now() { return now; } };
  const { createCheckoutToken, verifyCheckoutToken } = load('backend/src/utils/checkoutToken.ts', {
    '../config/env': { env: { JWT_SECRET: secret } },
  }, { Date: clock });
  const proof = createCheckoutToken('appointment-1', 'order-1');
  assert.equal(verifyCheckoutToken('appointment-1', 'order-1', proof), true);
  assert.equal(verifyCheckoutToken('appointment-2', 'order-1', proof), false);
  assert.equal(verifyCheckoutToken('appointment-1', 'order-2', proof), false);
  assert.equal(verifyCheckoutToken('appointment-1', 'order-1', 'invalid'), false);
  assert.throws(() => backendRequire('jsonwebtoken').verify(proof, secret));
  now += 3 * 60 * 60 * 1000;
  assert.equal(verifyCheckoutToken('appointment-1', 'order-1', proof), false);
});

test('Razorpay state checks suppress paid and processing payments before any unpaid alert', async () => {
  let order = { status: 'created', amount_paid: 0 };
  let items = [];
  const { isRazorpayCheckoutUnpaid } = load('backend/src/services/payment.service.ts', {
    '../config/env': { env: { RAZORPAY_KEY_ID: 'test-key', RAZORPAY_KEY_SECRET: 'test-secret' } },
    razorpay: class { orders = { fetch: async () => order, fetchPayments: async () => ({ items }) }; },
    axios: {},
  });
  assert.equal(await isRazorpayCheckoutUnpaid('order-1'), true);
  items = [{ status: 'failed' }];
  assert.equal(await isRazorpayCheckoutUnpaid('order-1'), true);
  for (const status of ['created', 'authorized', 'captured', 'refunded']) {
    items = [{ status }];
    assert.equal(await isRazorpayCheckoutUnpaid('order-1'), false, status);
  }
  items = [];
  order = { status: 'paid', amount_paid: 100000 };
  assert.equal(await isRazorpayCheckoutUnpaid('order-1'), false);
});

test('repeated unpaid-checkout reports claim at most one pending email and push alert', async () => {
  let claimed = false;
  const events = [], emails = [];
  const fixture = {
    id: 'appointment-1', status: 'PENDING_PAYMENT', clientName: 'Client', clientEmail: 'client@example.invalid', clientPhone: '1234567890',
    referenceNumber: 'TEST-001', service: { name: 'Consultation', price: 1000 }, payment: { orderId: 'order-1', status: 'CREATED' },
  };
  const service = load('backend/src/services/appointment.service.ts', {
    '../config/database': { prisma: { appointment: {
      updateMany: async (query) => {
        assert.equal(query.where.status, 'PENDING_PAYMENT');
        assert.equal(query.where.payment.is.orderId, 'order-1');
        assert.equal(query.where.payment.is.status.not, 'SUCCESS');
        assert.equal(query.where.pendingPaymentAlertedAt, null);
        const count = claimed ? 0 : 1; claimed = true; return { count };
      },
      findUnique: async () => fixture,
    } } },
    '../utils/generateReference': {},
    './email.service': { sendLawyerAlertEmail: async (value) => { emails.push(value.appointmentStatus); } },
    './notification.service': { sendAdminBookingNotification: async (...args) => { events.push(args); } },
    './whatsapp.service': {},
  });
  const outcomes = await Promise.all([service.notifyIncompleteCheckout('appointment-1', 'order-1'), service.notifyIncompleteCheckout('appointment-1', 'order-1')]);
  assert.deepEqual(outcomes.sort(), [false, true]);
  assert.deepEqual(events, [['appointment-1', 'PENDING_PAYMENT']]);
  assert.deepEqual(emails, ['PENDING_PAYMENT']);
});

test('checkout outcome endpoint ignores invalid, obsolete, already paid, and still-processing checkouts', async () => {
  const state = { valid: true, orderId: 'order-1', status: 'PENDING_PAYMENT', payment: 'CREATED', alerted: null, unpaid: true, providerError: false, providerReads: 0, notifications: 0 };
  const { recordRazorpayCheckoutOutcome } = load('backend/src/controllers/payment.controller.ts', {
    '../config/database': { prisma: { appointment: { findUnique: async () => ({
      id: 'appointment-1', status: state.status, pendingPaymentAlertedAt: state.alerted,
      payment: { gateway: 'RAZORPAY', orderId: state.orderId, status: state.payment },
    }) } } },
    '../utils/checkoutToken': { verifyCheckoutToken: () => state.valid },
    '../services/payment.service': { isRazorpayCheckoutUnpaid: async () => {
      state.providerReads++;
      if (state.providerError) throw new Error('gateway unavailable');
      return state.unpaid;
    } },
    '../services/appointment.service': { notifyIncompleteCheckout: async () => { state.notifications++; return true; } },
  });
  const invoke = () => new Promise((resolve, reject) => {
    const res = { code: 200, status(code) { this.code = code; return this; }, json(body) { resolve({ code: this.code, body }); } };
    recordRazorpayCheckoutOutcome({ body: { appointmentId: 'appointment-1', orderId: 'order-1', checkoutToken: 'proof', reason: 'CANCELLED' } }, res, reject);
  });
  state.valid = false;
  assert.equal((await invoke()).code, 401);
  state.valid = true; state.orderId = 'new-order';
  assert.equal((await invoke()).code, 409);
  state.orderId = 'order-1'; state.status = 'CONFIRMED';
  assert.equal((await invoke()).body.data.notified, false);
  state.status = 'PENDING_PAYMENT'; state.payment = 'SUCCESS';
  assert.equal((await invoke()).body.data.notified, false);
  state.payment = 'CREATED'; state.alerted = new Date();
  assert.equal((await invoke()).body.data.notified, false);
  assert.equal(state.providerReads, 0);
  state.alerted = null; state.unpaid = false;
  assert.equal((await invoke()).body.data.notified, false);
  state.unpaid = true; state.providerError = true;
  assert.equal((await invoke()).code, 503);
  assert.equal(state.notifications, 0);
  state.providerError = false;
  assert.equal((await invoke()).body.data.notified, true);
  assert.equal(state.notifications, 1);
});

test('retried payment callbacks preserve later appointment statuses without re-alerting', async () => {
  for (const status of ['COMPLETED', 'CANCELLED', 'REFUNDED']) {
    const alerts = [];
    const service = load('backend/src/services/appointment.service.ts', {
      '../config/database': { prisma: { appointment: {
        updateMany: async (query) => {
          assert.equal(query.where.status, 'PENDING_PAYMENT');
          return { count: 0 };
        },
        findUniqueOrThrow: async () => ({ id: 'appointment-1', status }),
      } } },
      '../utils/generateReference': { generateReference: () => 'TEST-001' },
      './email.service': { sendLawyerAlertEmail: async () => { alerts.push('lawyer'); }, sendBookingConfirmationEmail: async () => { alerts.push('client'); } },
      './notification.service': { sendAdminBookingNotification: async () => { alerts.push('push'); } },
      './whatsapp.service': { buildLawyerWhatsAppData: () => ({ clientLink: '' }) },
    });
    const appointment = await service.confirmAppointmentAfterPayment('appointment-1');
    assert.equal(appointment.status, status);
    assert.deepEqual(alerts, []);
  }
});

function browserHarness({ offline = false, logoutOnRegister = false, disableOnRegister = false } = {}) {
  const storage = new Map([['admin_token', 'admin-jwt']]);
  const marker = new Map();
  const actions = [];
  let callback;
  const firebase = {
    getApps: () => [], initializeApp: (config) => config, getMessaging: () => ({}),
    getToken: async () => 'browser-token-with-at-least-20-characters', deleteToken: async () => { actions.push('firebase-deleted'); },
    onMessage: (_messaging, fn) => { callback = fn; return () => {}; },
  };
  const registration = {
    active: { state: 'activated' }, scope: 'https://example.invalid/admin-lawyersite',
    getNotifications: async () => [{ close: () => actions.push('closed') }],
    pushManager: { getSubscription: async () => ({ unsubscribe: async () => { actions.push('unsubscribed'); } }) },
    unregister: async () => { actions.push('unregistered'); },
  };
  const cache = {
    put: async (key, value) => { marker.set(key, value); },
    delete: async (key) => { marker.delete(key); actions.push('marker-deleted'); },
  };
  const globals = {
    window: { dispatchEvent() {}, caches: {} },
    localStorage: { getItem: (key) => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value), removeItem: (key) => storage.delete(key) },
    navigator: { serviceWorker: { register: async () => registration, getRegistration: async () => registration } },
    Notification: { permission: 'granted' },
    caches: { open: async () => cache }, location: { origin: 'https://example.invalid' }, document: { visibilityState: 'visible' },
    fetch: async (_url, init) => {
      actions.push(init.method);
      if (offline) throw new Error('offline');
      if (logoutOnRegister && init.method === 'POST') storage.delete('admin_token');
      if (disableOnRegister && init.method === 'POST') storage.set('admin_push_revision', 'turned-off-in-another-tab');
      return { ok: true, json: async () => ({ success: true, data: { expiresAt: new Date(Date.now() + 3600000).toISOString() } }) };
    },
  };
  const api = load('src/lib/adminPush.ts', {
    '@/data/siteSettings': { siteSettings: { BACKEND_URL: '' } }, 'firebase/app': firebase, 'firebase/messaging': firebase,
  }, globals);
  return { api, storage, marker, actions, emit: (payload) => callback?.(payload) };
}

test('browser enrollment requires the current admin and marks active only after backend registration', async () => {
  const { api, storage, marker } = browserHarness();
  await assert.rejects(api.enableAdminPush('another-jwt', publicConfig), /sign in again/);
  assert.equal(marker.size, 0);
  await api.enableAdminPush('admin-jwt', publicConfig);
  assert.equal(storage.get('admin_push_enabled'), 'true');
  assert.equal(marker.size, 1);
});

test('logout during registration rolls back server registration and browser permission state', async () => {
  const { api, marker, storage, actions } = browserHarness({ logoutOnRegister: true });
  await assert.rejects(api.enableAdminPush('admin-jwt', publicConfig), /sign in again/);
  assert.equal(marker.size, 0);
  assert.equal(storage.has('admin_push_enabled'), false);
  assert.ok(actions.includes('DELETE'));
  assert.ok(actions.includes('unsubscribed'));
});

test('turning notifications off removes local display and subscriptions even when the server is offline', async () => {
  const { api, marker, storage, actions } = browserHarness({ offline: true });
  marker.set('/admin-lawyersite/__push_enabled', {});
  storage.set('admin_push_enabled', 'true');
  storage.set('admin_push_enrollment', JSON.stringify({ token: 'browser-token', firebase: publicConfig.firebase, expiresAt: '2099-01-01' }));
  await api.disableAdminPush('admin-jwt');
  assert.equal(marker.size, 0);
  assert.equal(storage.has('admin_push_enabled'), false);
  assert.equal(storage.has('admin_push_enrollment'), false);
  assert.ok(actions.includes('unsubscribed'));
  assert.ok(actions.includes('unregistered'));
  assert.ok(actions.includes('closed'));
});

test('turning notifications off in another tab cancels an in-flight enrollment', async () => {
  const { api, marker, storage, actions } = browserHarness({ disableOnRegister: true });
  await assert.rejects(api.enableAdminPush('admin-jwt', publicConfig), /turned off in another tab/);
  assert.equal(storage.get('admin_token'), 'admin-jwt');
  assert.equal(storage.has('admin_push_enabled'), false);
  assert.equal(marker.size, 0);
  assert.ok(actions.includes('DELETE'));
});

test('foreground alerts require a nonexpired enrolled admin and stop immediately on logout', async () => {
  const { api, storage, emit } = browserHarness();
  const notices = [];
  await api.enableAdminPush('admin-jwt', publicConfig);
  await api.listenForAdminPush((notice) => notices.push(notice));
  const payload = { data: { status: 'PENDING_PAYMENT', title: 'Pending', body: 'New appointment', tag: 'booking-1' } };
  emit(payload);
  assert.equal(notices.length, 1);
  storage.delete('admin_token');
  emit(payload);
  assert.equal(notices.length, 1);
});

test('background worker suppresses missing, expired and disabled enrollment and opens only the admin page', async () => {
  let background;
  let marker = null;
  const displayed = [], opened = [];
  const handlers = {};
  load('workers/admin-push.js', {
    'firebase/app': { initializeApp: () => ({}) },
    'firebase/messaging/sw': { getMessaging: () => ({}), onBackgroundMessage: (_messaging, handler) => { background = handler; } },
  }, {
    self: {
      addEventListener: (type, handler) => { handlers[type] = handler; },
      location: { origin: 'https://example.invalid', href: `https://example.invalid/admin-firebase-messaging-sw.js?firebase=${encodeURIComponent(JSON.stringify(publicConfig.firebase))}` },
      registration: { showNotification: async (...args) => { displayed.push(args); } },
      clients: { matchAll: async () => [], openWindow: async (url) => { opened.push(url); } },
    },
    caches: { open: async () => ({ match: async () => marker && new Response(JSON.stringify(marker)) }) },
  });
  const payload = { data: { title: 'Pending', body: 'New request', tag: 'booking-1', status: 'PENDING_PAYMENT', url: 'https://evil.invalid' } };
  await background(payload);
  marker = { expiresAt: '2000-01-01' };
  await background(payload);
  marker = { expiresAt: 'invalid-date' };
  await background(payload);
  assert.equal(displayed.length, 0);
  marker = { expiresAt: '2099-01-01' };
  await background(payload);
  assert.equal(displayed.length, 1);
  let finished;
  handlers.notificationclick({ notification: { close() {} }, stopImmediatePropagation() {}, waitUntil: (promise) => { finished = promise; } });
  await finished;
  assert.deepEqual(opened, ['https://example.invalid/admin-lawyersite/appointments']);
});
