import { siteSettings } from "@/data/siteSettings";

export interface PushWebConfig {
  apiKey: string;
  appId: string;
  projectId: string;
  messagingSenderId: string;
}
export type AdminPushConfig = { configured: false } | { configured: true; firebase: PushWebConfig; vapidKey: string };
interface Enrollment { token: string; firebase: PushWebConfig; expiresAt: string }
export interface BookingNotice { title: string; body: string; tag: string }

const ENROLLMENT_KEY = "admin_push_enrollment";
const PREFERENCE_KEY = "admin_push_enabled";
const REVISION_KEY = "admin_push_revision";
const WORKER_SCOPE = "/admin-lawyersite";
const CACHE_NAME = "nyaysaathi-admin-push-v1";
const MARKER_URL = "/admin-lawyersite/__push_enabled";
export const PUSH_CHANGED_EVENT = "admin-push-changed";
let operation: Promise<unknown> = Promise.resolve();

function serial<T>(action: () => Promise<T>): Promise<T> {
  const next = operation.then(action, action);
  operation = next.catch(() => undefined);
  return next;
}
function readEnrollment(): Enrollment | null {
  try {
    const value = JSON.parse(localStorage.getItem(ENROLLMENT_KEY) ?? "null");
    return value && typeof value.token === "string" && value.firebase && typeof value.expiresAt === "string" ? value : null;
  } catch { return null; }
}
export function hasAdminPushOptIn(): boolean {
  return localStorage.getItem(PREFERENCE_KEY) === "true";
}
function changed() { window.dispatchEvent(new Event(PUSH_CHANGED_EVENT)); }

export async function adminPushRequest<T>(authToken: string, path: string, init: RequestInit = {}): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(`${siteSettings.BACKEND_URL}/api/admin/notifications${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${authToken}` },
      cache: "no-store", signal: controller.signal,
    });
    const json = await response.json().catch(() => null);
    if (!response.ok || !json?.success) throw new Error(json?.error?.message ?? "Unable to update notifications. Please try again.");
    return json.data as T;
  } finally { clearTimeout(timeout); }
}
export async function supportsAdminPush(): Promise<boolean> {
  if (!window.isSecureContext || !("Notification" in window) || !("serviceWorker" in navigator) || !("caches" in window)) return false;
  const { isSupported } = await import("firebase/messaging");
  return isSupported();
}
async function messagingFor(firebase: PushWebConfig) {
  const [{ getApps, initializeApp }, { getMessaging }] = await Promise.all([import("firebase/app"), import("firebase/messaging")]);
  const name = `admin-notifications-${firebase.appId}`;
  const app = getApps().find((entry) => entry.name === name) ?? initializeApp(firebase, name);
  return getMessaging(app);
}
function assertCurrentAdmin(authToken: string) {
  if (localStorage.getItem("admin_token") !== authToken) throw new Error("Please sign in again before enabling notifications.");
}
async function activeWorker(registration: ServiceWorkerRegistration): Promise<void> {
  if (registration.active?.state === "activated") return;
  const worker = registration.installing ?? registration.waiting ?? registration.active;
  if (!worker) throw new Error("Unable to start notifications. Please refresh and try again.");
  await new Promise<void>((resolve, reject) => {
    const finish = (error?: Error) => {
      clearTimeout(timeout);
      worker.removeEventListener("statechange", check);
      if (error) reject(error); else resolve();
    };
    const check = () => {
      if (worker.state === "activated") finish();
      else if (worker.state === "redundant") finish(new Error("Notification setup failed. Please try again."));
    };
    const timeout = setTimeout(() => finish(new Error("Notification setup timed out. Please try again.")), 20000);
    worker.addEventListener("statechange", check);
    check();
  });
}
async function removeEnrollment(authToken: string | null): Promise<void> {
  const enrollment = readEnrollment();
  // Disable background display before network cleanup, including when logging out offline.
  if ("caches" in window) {
    try { await (await caches.open(CACHE_NAME)).delete(MARKER_URL); } catch { /* Still unsubscribe if cache access fails. */ }
  }
  localStorage.removeItem(ENROLLMENT_KEY);
  localStorage.removeItem(PREFERENCE_KEY);
  changed();
  const registration = "serviceWorker" in navigator ? await navigator.serviceWorker.getRegistration(WORKER_SCOPE) : undefined;
  if (registration?.scope === new URL(WORKER_SCOPE, location.origin).href) {
    await Promise.allSettled([
      registration.getNotifications().then((notices) => notices.forEach((notice) => notice.close())),
      (async () => {
        try { await (await registration.pushManager.getSubscription())?.unsubscribe(); }
        finally { await registration.unregister(); }
      })(),
    ]);
  }
  const cleanup: Promise<unknown>[] = [];
  if (enrollment && authToken) cleanup.push(adminPushRequest(authToken, "/devices", { method: "DELETE", body: JSON.stringify({ token: enrollment.token }) }));
  // Unsubscribe directly: Firebase deleteToken on a fresh page tries to create its default worker.
  // Revoking the browser subscription works offline; invalid Firebase tokens are pruned on delivery.
  // Network errors cannot restore the disabled marker or browser subscription.
  await Promise.allSettled(cleanup);
}
export async function disableAdminPush(authToken: string | null): Promise<void> {
  // Revoke display immediately, even if an earlier enable operation is waiting on Firebase.
  localStorage.removeItem(PREFERENCE_KEY);
  localStorage.setItem(REVISION_KEY, `${Date.now()}-${Math.random()}`);
  changed();
  if ("caches" in window) {
    try { await (await caches.open(CACHE_NAME)).delete(MARKER_URL); } catch { /* Browser cleanup below remains necessary. */ }
  }
  return serial(() => removeEnrollment(authToken));
}
export function enableAdminPush(authToken: string, config: Extract<AdminPushConfig, { configured: true }>): Promise<void> {
  const revision = localStorage.getItem(REVISION_KEY);
  const assertAllowed = () => {
    assertCurrentAdmin(authToken);
    if (localStorage.getItem(REVISION_KEY) !== revision) throw new Error("Notification setup was cancelled because notifications were turned off in another tab.");
  };
  return serial(async () => {
    assertAllowed();
    if (Notification.permission !== "granted") throw new Error("Please allow notifications in your browser settings.");
    try {
      const messaging = await messagingFor(config.firebase);
      const registration = await navigator.serviceWorker.register(
        `/admin-firebase-messaging-sw.js?firebase=${encodeURIComponent(JSON.stringify(config.firebase))}`,
        { scope: WORKER_SCOPE, updateViaCache: "none" },
      );
      await activeWorker(registration);
      assertAllowed();
      const { getToken } = await import("firebase/messaging");
      const token = await getToken(messaging, { vapidKey: config.vapidKey, serviceWorkerRegistration: registration });
      if (!token) throw new Error("No notification token was returned. Please try again.");
      // Save before registering so failures can revoke partially completed enrollment.
      localStorage.setItem(ENROLLMENT_KEY, JSON.stringify({ token, firebase: config.firebase, expiresAt: new Date(0).toISOString() }));
      assertAllowed();
      const { expiresAt } = await adminPushRequest<{ expiresAt: string }>(authToken, "/devices", { method: "POST", body: JSON.stringify({ token }) });
      assertAllowed();
      await (await caches.open(CACHE_NAME)).put(MARKER_URL, new Response(JSON.stringify({ expiresAt })));
      assertAllowed();
      localStorage.setItem(ENROLLMENT_KEY, JSON.stringify({ token, firebase: config.firebase, expiresAt }));
      localStorage.setItem(PREFERENCE_KEY, "true");
      changed();
    } catch (error) {
      await removeEnrollment(authToken).catch(() => undefined);
      throw error;
    }
  });
}
// Also listen on public pages: Firebase delivers foreground messages to visible windows on this origin.
export async function listenForAdminPush(onNotice: (notice: BookingNotice) => void): Promise<() => void> {
  const enrollment = readEnrollment();
  if (!enrollment || !hasAdminPushOptIn() || !localStorage.getItem("admin_token") || !Number.isFinite(Date.parse(enrollment.expiresAt)) || Date.parse(enrollment.expiresAt) <= Date.now()) return () => undefined;
  const { onMessage } = await import("firebase/messaging");
  return onMessage(await messagingFor(enrollment.firebase), (payload) => {
    const current = readEnrollment();
    if (document.visibilityState !== "visible" || !hasAdminPushOptIn() || !localStorage.getItem("admin_token") || !current || !Number.isFinite(Date.parse(current.expiresAt)) || Date.parse(current.expiresAt) <= Date.now()) return;
    if (payload.data?.status !== "PENDING_PAYMENT" && payload.data?.status !== "CONFIRMED") return;
    onNotice({ title: payload.data.title, body: payload.data.body, tag: payload.data.tag });
  });
}
