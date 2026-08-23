"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "./auth-context";
import { siteSettings } from "@/data/siteSettings";

type Stats = {
  total: number;
  today: number;
  upcoming: number;
  completed: number;
  actionTaken: number;
  pendingPayment: number;
};

type RecentAppointment = {
  id: string;
  referenceNumber: string;
  clientName: string;
  service: { name: string };
  status: string;
  createdAt: string;
  preferredDate?: string;
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

export default function AdminDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState<Stats>({
    total: 0, today: 0, upcoming: 0, completed: 0, actionTaken: 0, pendingPayment: 0,
  });
  const [recent, setRecent] = useState<RecentAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    fetchData();
  }, [token]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${siteSettings.BACKEND_URL}/api/appointments?pageSize=100`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message ?? "Failed to load");

      const appointments: RecentAppointment[] = data.data.items ?? [];
      const today = new Date().toISOString().split("T")[0];

      const computed: Stats = {
        total: appointments.length,
        today: appointments.filter((a) => a.createdAt.startsWith(today)).length,
        upcoming: appointments.filter((a) => a.status === "CONFIRMED").length,
        completed: appointments.filter((a) => a.status === "COMPLETED").length,
        actionTaken: appointments.filter((a) => a.status === "CONFIRMED").length,
        pendingPayment: appointments.filter((a) => a.status === "PENDING_PAYMENT").length,
      };

      setStats(computed);
      setRecent(appointments.slice(0, 6));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      label: "Total Appointments",
      value: stats.total,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      ),
      color: "bg-[#5A1824]",
      textColor: "text-[#5A1824]",
      bgColor: "bg-[#5A1824]/8",
      filter: "",
    },
    {
      label: "Today's Bookings",
      value: stats.today,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
      ),
      color: "bg-violet-600",
      textColor: "text-violet-600",
      bgColor: "bg-violet-50",
      filter: "",
    },
    {
      label: "Upcoming",
      value: stats.upcoming,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
        </svg>
      ),
      color: "bg-blue-600",
      textColor: "text-blue-600",
      bgColor: "bg-blue-50",
      filter: "CONFIRMED",
    },
    {
      label: "Action Taken",
      value: stats.actionTaken,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
      ),
      color: "bg-emerald-600",
      textColor: "text-emerald-600",
      bgColor: "bg-emerald-50",
      filter: "CONFIRMED",
    },
    {
      label: "Completed",
      value: stats.completed,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
        </svg>
      ),
      color: "bg-sky-600",
      textColor: "text-sky-600",
      bgColor: "bg-sky-50",
      filter: "COMPLETED",
    },
    {
      label: "Pending Payment",
      value: stats.pendingPayment,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
      ),
      color: "bg-amber-500",
      textColor: "text-amber-600",
      bgColor: "bg-amber-50",
      filter: "PENDING_PAYMENT",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-[#5A1824] to-[#7a2030] rounded-2xl p-7 text-white">
        <p className="text-white/60 text-sm mb-1">Good day,</p>
        <h2 className="text-2xl font-serif mb-1">Welcome to your Dashboard</h2>
        <p className="text-white/60 text-sm">Here&apos;s an overview of your consultancy activity.</p>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-5 py-4 rounded-xl">
          {error}
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
        {statCards.map((card) => (
          <Link
            key={card.label}
            href={`/admin-lawyersite/appointments${card.filter ? `?status=${card.filter}` : ""}`}
            className="bg-white rounded-xl border border-[#E6E1D6] p-5 hover:shadow-md transition-all duration-200 group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 ${card.bgColor} rounded-xl flex items-center justify-center ${card.textColor}`}>
                {card.icon}
              </div>
              <svg className={`w-4 h-4 ${card.textColor} opacity-0 group-hover:opacity-100 transition-opacity`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
            </div>
            <div>
              {loading ? (
                <div className="h-8 w-16 bg-gray-100 rounded animate-pulse mb-1" />
              ) : (
                <p className="text-3xl font-bold text-gray-900">{card.value}</p>
              )}
              <p className="text-sm text-gray-500 mt-0.5">{card.label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Appointments */}
      <div className="bg-white rounded-xl border border-[#E6E1D6] overflow-hidden">
        <div className="px-6 py-5 border-b border-[#E6E1D6] flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Recent Appointments</h3>
          <Link
            href="/admin-lawyersite/appointments"
            className="text-sm text-[#5A1824] font-medium hover:text-[#7a2030]"
          >
            View all →
          </Link>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-400 text-sm">Loading…</div>
        ) : recent.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            </div>
            <p className="text-gray-400 text-sm">No appointments yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-[#F9F8F6] text-gray-500 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3 font-medium">Ref #</th>
                  <th className="px-6 py-3 font-medium">Client</th>
                  <th className="px-6 py-3 font-medium">Service</th>
                  <th className="px-6 py-3 font-medium">Booked On</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F4F2EF]">
                {recent.map((apt) => (
                  <tr key={apt.id} className="hover:bg-[#FAFAF9] transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-gray-500">{apt.referenceNumber}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{apt.clientName}</td>
                    <td className="px-6 py-4 text-gray-600">{apt.service.name}</td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(apt.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[apt.status] ?? "bg-gray-100 text-gray-600"}`}>
                        {STATUS_LABELS[apt.status] ?? apt.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
