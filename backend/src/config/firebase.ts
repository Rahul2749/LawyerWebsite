import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";
import { env } from "./env";

export function getAdminMessaging() {
  if (!env.FIREBASE_SERVICE_ACCOUNT_BASE64 || !env.FIREBASE_PROJECT_ID) return null;
  const existing = getApps().find((app) => app.name === "admin-notifications");
  if (existing) return getMessaging(existing);

  const account = JSON.parse(Buffer.from(env.FIREBASE_SERVICE_ACCOUNT_BASE64, "base64").toString("utf8"));
  if (account.project_id !== env.FIREBASE_PROJECT_ID ||
      typeof account.client_email !== "string" || typeof account.private_key !== "string") {
    throw new Error("Firebase service account must belong to FIREBASE_PROJECT_ID.");
  }
  const app = initializeApp({
    credential: cert({
      projectId: account.project_id,
      clientEmail: account.client_email,
      privateKey: account.private_key,
    }),
    projectId: env.FIREBASE_PROJECT_ID,
  }, "admin-notifications");
  return getMessaging(app);
}

export function getAdminPushConfiguration() {
  // Explicit allowlist: never return the service-account JSON or private credentials.
  const firebase = {
    apiKey: env.FIREBASE_WEB_API_KEY,
    appId: env.FIREBASE_WEB_APP_ID,
    projectId: env.FIREBASE_PROJECT_ID,
    messagingSenderId: env.FIREBASE_MESSAGING_SENDER_ID,
  };
  if (Object.values(firebase).some((value) => !value) || !env.FIREBASE_WEB_VAPID_KEY) {
    return { configured: false as const };
  }
  try {
    if (!getAdminMessaging()) return { configured: false as const };
  } catch {
    console.error("Admin push disabled: check Firebase server credentials and project configuration.");
    return { configured: false as const };
  }
  return { configured: true as const, firebase, vapidKey: env.FIREBASE_WEB_VAPID_KEY };
}
