"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { listenForAdminPush, PUSH_CHANGED_EVENT, type BookingNotice } from "@/lib/adminPush";

export default function AdminPushForeground() {
  const [notice, setNotice] = useState<BookingNotice | null>(null);
  useEffect(() => {
    let stop = () => {};
    let generation = 0;
    let disposed = false;
    const refresh = async () => {
      const current = ++generation;
      stop();
      setNotice(null);
      try {
        const unsubscribe = await listenForAdminPush(setNotice);
        if (disposed || current !== generation) unsubscribe(); else stop = unsubscribe;
      } catch {
        // Setup errors are shown in the admin controls; public pages keep working.
      }
    };
    void refresh();
    window.addEventListener("storage", refresh);
    window.addEventListener(PUSH_CHANGED_EVENT, refresh);
    return () => {
      disposed = true;
      generation++;
      stop();
      window.removeEventListener("storage", refresh);
      window.removeEventListener(PUSH_CHANGED_EVENT, refresh);
    };
  }, []);
  if (!notice) return null;
  return (
    <aside role="status" aria-live="polite" className="fixed right-4 top-4 z-[100] w-[calc(100%-2rem)] max-w-sm rounded-xl border border-[#B39352]/40 bg-white p-5 text-gray-900 shadow-xl">
      <button type="button" aria-label="Dismiss notification" onClick={() => setNotice(null)} className="absolute right-2 top-2 flex size-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100">×</button>
      <p className="pr-6 text-sm font-semibold text-[#5A1824]">{notice.title}</p>
      <p className="mt-2 text-sm text-gray-600">{notice.body}</p>
      <Link href="/admin-lawyersite/appointments" onClick={() => setNotice(null)} className="mt-3 inline-block text-sm font-semibold text-[#5A1824] underline">View appointments</Link>
    </aside>
  );
}
