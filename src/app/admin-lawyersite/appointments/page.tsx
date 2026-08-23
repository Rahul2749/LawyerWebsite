"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "../auth-context";
import { siteSettings } from "@/data/siteSettings";

type Appointment = {
  id: string;
  referenceNumber: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientMessage?: string;
  preferredDate?: string;
  service: { name: string; price: number };
  status: string;
  notes?: string;
  createdAt: string;
};

const STATUS_COLORS: Record<string, string> = {
  CONFIRMED: "bg-emerald-100 text-emerald-700",
  PENDING_PAYMENT: "bg-amber-100 text-amber-700",
  COMPLETED: "bg-blue-100 text-blue-700",
  CANCELLED: "bg-red-100 text-red-600",
  REFUNDED: "bg-gray-100 text-gray-600",
};

const STATUS_LABELS: Record<string, string> = {
  CONFIRMED: "Confirmed",
  PENDING_PAYMENT: "Pending Payment",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  REFUNDED: "Refunded",
};

const ALL_STATUSES = ["ALL", "PENDING_PAYMENT", "CONFIRMED", "COMPLETED", "CANCELLED"];
const TAB_LABELS: Record<string, string> = {
  ALL: "All",
  PENDING_PAYMENT: "Pending Payment",
  CONFIRMED: "Upcoming",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

function AppointmentsPageInner() {
  const { token } = useAuth();
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get("status") ?? "ALL";

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState(initialStatus);

  // Reply modal state
  const [selectedApt, setSelectedApt] = useState<Appointment | null>(null);
  const [replyMsg, setReplyMsg] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  // Status update state
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  const fetchAppointments = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ pageSize: "100" });
      const res = await fetch(`${siteSettings.BACKEND_URL}/api/appointments?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message ?? "Failed to fetch");
      setAppointments(data.data.items ?? []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    if (!token) return;
    setUpdatingStatus(id);
    try {
      const res = await fetch(`${siteSettings.BACKEND_URL}/api/appointments/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
      );
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error updating status");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApt || !token) return;
    setSendingReply(true);
    try {
      const res = await fetch(
        `${siteSettings.BACKEND_URL}/api/appointments/${selectedApt.id}/reply`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ subject: `Re: Your Appointment ${selectedApt.referenceNumber}`, message: replyMsg }),
        }
      );
      if (!res.ok) throw new Error("Failed to send reply");
      alert("Reply sent successfully!");
      setSelectedApt(null);
      setReplyMsg("");
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error sending reply");
    } finally {
      setSendingReply(false);
    }
  };

  const filtered =
    activeTab === "ALL"
      ? appointments
      : appointments.filter((a) => a.status === activeTab);

  // Tab counts
  const counts: Record<string, number> = { ALL: appointments.length };
  ALL_STATUSES.slice(1).forEach((s) => {
    counts[s] = appointments.filter((a) => a.status === s).length;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Appointments</h2>
          <p className="text-sm text-gray-500 mt-0.5">Manage and track all client bookings.</p>
        </div>
        <button
          onClick={fetchAppointments}
          className="flex items-center gap-2 text-sm text-[#5A1824] border border-[#5A1824]/30 hover:bg-[#5A1824]/5 px-4 py-2 rounded-lg transition"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-5 py-4 rounded-xl">
          {error}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl border border-[#E6E1D6] overflow-hidden">
        <div className="flex border-b border-[#E6E1D6] overflow-x-auto">
          {ALL_STATUSES.map((status) => (
            <button
              key={status}
              onClick={() => setActiveTab(status)}
              className={`flex items-center gap-2 px-5 py-4 text-sm font-medium whitespace-nowrap transition-all border-b-2 -mb-px ${
                activeTab === status
                  ? "border-[#5A1824] text-[#5A1824] bg-[#5A1824]/3"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              {TAB_LABELS[status]}
              <span
                className={`text-xs rounded-full px-2 py-0.5 font-semibold ${
                  activeTab === status
                    ? "bg-[#5A1824] text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {counts[status] ?? 0}
              </span>
            </button>
          ))}
        </div>

        {/* Table */}
        {loading ? (
          <div className="p-12 text-center text-gray-400 text-sm">Loading appointments…</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            </div>
            <p className="text-gray-400 text-sm">No appointments in this category.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-[#F9F8F6] text-gray-500 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3 font-medium">Ref #</th>
                  <th className="px-5 py-3 font-medium">Client</th>
                  <th className="px-5 py-3 font-medium">Service</th>
                  <th className="px-5 py-3 font-medium">Preferred Date</th>
                  <th className="px-5 py-3 font-medium">Booked On</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F4F2EF]">
                {filtered.map((apt) => (
                  <tr key={apt.id} className="hover:bg-[#FAFAF9] transition-colors">
                    <td className="px-5 py-4 font-mono text-xs text-gray-400">{apt.referenceNumber}</td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-900">{apt.clientName}</p>
                      <p className="text-xs text-gray-400">{apt.clientEmail}</p>
                      <p className="text-xs text-gray-400">{apt.clientPhone}</p>
                    </td>
                    <td className="px-5 py-4 text-gray-600">
                      <p>{apt.service.name}</p>
                      <p className="text-xs text-gray-400">₹{apt.service.price.toLocaleString("en-IN")}</p>
                    </td>
                    <td className="px-5 py-4 text-gray-500 text-xs">
                      {apt.preferredDate
                        ? new Date(apt.preferredDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                        : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-5 py-4 text-gray-500 text-xs">
                      {new Date(apt.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[apt.status] ?? "bg-gray-100 text-gray-600"}`}>
                        {STATUS_LABELS[apt.status] ?? apt.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Status update */}
                        <select
                          disabled={updatingStatus === apt.id}
                          value={apt.status}
                          onChange={(e) => handleStatusUpdate(apt.id, e.target.value)}
                          className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 text-gray-600 focus:outline-none focus:border-[#5A1824] cursor-pointer bg-white disabled:opacity-50"
                        >
                          {["PENDING_PAYMENT", "CONFIRMED", "COMPLETED", "CANCELLED", "REFUNDED"].map((s) => (
                            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                          ))}
                        </select>

                        {/* Reply email */}
                        <button
                          onClick={() => { setSelectedApt(apt); setReplyMsg(""); }}
                          title="Reply via Email"
                          className="p-1.5 rounded-lg text-[#B39352] hover:bg-[#B39352]/10 transition"
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                        </button>

                        {/* WhatsApp */}
                        <a
                          href={`https://wa.me/${apt.clientPhone.replace(/\D/g, "")}?text=${encodeURIComponent(`Hi ${apt.clientName}, this is Raja Agrawal regarding your appointment (${apt.referenceNumber}).`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="WhatsApp"
                          className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition"
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reply Modal */}
      {selectedApt && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedApt(null)}>
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-5 border-b border-gray-100 flex items-start justify-between">
              <div>
                <h3 className="text-base font-semibold text-gray-900">Reply via Email</h3>
                <p className="text-sm text-gray-500 mt-0.5">To: {selectedApt.clientName} ({selectedApt.clientEmail})</p>
                <p className="text-xs text-gray-400 mt-0.5">Ref: {selectedApt.referenceNumber}</p>
              </div>
              <button onClick={() => setSelectedApt(null)} className="text-gray-400 hover:text-gray-600 mt-0.5">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <form onSubmit={handleReplySubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Message</label>
                <textarea
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#5A1824] focus:ring-2 focus:ring-[#5A1824]/10 transition resize-none"
                  placeholder="Type your message here..."
                  value={replyMsg}
                  onChange={(e) => setReplyMsg(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setSelectedApt(null)} className="px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sendingReply}
                  className="px-5 py-2.5 text-sm bg-[#5A1824] text-white rounded-lg hover:bg-[#4a1320] transition disabled:opacity-50 flex items-center gap-2"
                >
                  {sendingReply ? (
                    <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending…</>
                  ) : (
                    <>Send Email</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AppointmentsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-400 text-sm">Loading…</div>}>
      <AppointmentsPageInner />
    </Suspense>
  );
}
