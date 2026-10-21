import { initializeApp } from "firebase/app";
import { getMessaging, onBackgroundMessage } from "firebase/messaging/sw";

// Register first so Firebase's default notification-click handler cannot override this one.
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.stopImmediatePropagation();
  event.waitUntil((async () => {
    const target = new URL("/admin-lawyersite/appointments", self.location.origin).href;
    const windows = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    const existing = windows.find((client) => new URL(client.url).pathname.startsWith("/admin-lawyersite"));
    if (existing) { await existing.navigate(target); await existing.focus(); }
    else await self.clients.openWindow(target);
  })());
});
self.addEventListener("install", (event) => event.waitUntil(self.skipWaiting()));
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

const config = JSON.parse(new URL(self.location.href).searchParams.get("firebase") ?? "null");
if (config?.apiKey && config?.appId && config?.projectId && config?.messagingSenderId) {
  const messaging = getMessaging(initializeApp(config));
  onBackgroundMessage(messaging, async (payload) => {
    // Notification consent persists independently of the admin's login session.
    if (payload.data?.status !== "PENDING_PAYMENT" && payload.data?.status !== "CONFIRMED") return;
    const marker = await (await caches.open("nyaysaathi-admin-push-v1")).match("/admin-lawyersite/__push_enabled");
    if (!marker) return;
    const { enabled } = await marker.json();
    if (enabled !== true) return;
    await self.registration.showNotification(payload.data.title, {
      body: payload.data.body, icon: "/nyaysaathi_logo.png", tag: payload.data.tag,
      data: { url: "/admin-lawyersite/appointments" },
    });
  });
}
