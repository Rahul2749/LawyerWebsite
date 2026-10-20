"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/admin-lawyersite/auth-context";
import { adminPushRequest, disableAdminPush, enableAdminPush, hasAdminPushOptIn, supportsAdminPush, type AdminPushConfig } from "@/lib/adminPush";

export default function AdminNotifications() {
  const { token } = useAuth();
  const [config, setConfig] = useState<AdminPushConfig | null>(null);
  const [supported, setSupported] = useState(true);
  const [enabled, setEnabled] = useState(false);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    (async () => {
      try {
        const canNotify = await supportsAdminPush();
        if (cancelled) return;
        setSupported(canNotify);
        if (!canNotify) return;
        const settings = await adminPushRequest<AdminPushConfig>(token, "/config");
        if (cancelled) return;
        setConfig(settings);
        if (settings.configured && hasAdminPushOptIn() && Notification.permission === "granted") {
          await enableAdminPush(token, settings);
          if (!cancelled) setEnabled(true);
        } else if (hasAdminPushOptIn()) {
          await disableAdminPush(token);
        }
      } catch (error) {
        if (!cancelled) setError(error instanceof Error ? error.message : "Unable to load notification settings.");
      } finally {
        if (!cancelled) setBusy(false);
      }
    })();
    const sync = () => setEnabled(hasAdminPushOptIn() && "Notification" in window && Notification.permission === "granted");
    window.addEventListener("storage", sync);
    return () => { cancelled = true; window.removeEventListener("storage", sync); };
  }, [token]);

  async function toggle() {
    if (!token || !config?.configured) return;
    setBusy(true);
    setError("");
    try {
      if (enabled) {
        await disableAdminPush(token);
        setEnabled(false);
      } else {
        // Browsers require permission to be requested from a button click.
        const permission = await Notification.requestPermission();
        if (permission !== "granted") throw new Error("Notifications were not allowed. You can enable them in your browser's site settings.");
        await enableAdminPush(token, config);
        setEnabled(true);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to update notifications. Please try again.");
    } finally { setBusy(false); }
  }

  return (
    <section aria-label="Booking notifications" className="mb-6 rounded-xl border border-[#E6E1D6] bg-white p-4 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-[#5A1824]">Booking notifications</h2>
          <p className="mt-1 text-sm text-gray-600">
            {!supported ? "This browser does not support notifications. On iPhone or iPad, add this site to your Home Screen and open it there."
              : config && !config.configured ? "Notifications have not been set up yet."
              : enabled ? "Notifications are enabled on this device for pending and confirmed appointments."
              : "Get alerts on this device for appointments awaiting payment and confirmed bookings."}
          </p>
          <p className="mt-1 text-xs text-gray-500">Only signed-in admins can enable alerts. Logging out turns them off on this device.</p>
        </div>
        {supported && <button type="button" onClick={toggle} disabled={busy || !config?.configured}
          className="min-h-11 shrink-0 rounded-lg border border-[#5A1824] px-4 py-2 text-sm font-medium text-[#5A1824] transition hover:bg-[#F0EBE1] disabled:cursor-not-allowed disabled:opacity-50">
          {busy ? "Please wait…" : enabled ? "Turn off notifications" : "Enable notifications"}
        </button>}
      </div>
      {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
    </section>
  );
}
