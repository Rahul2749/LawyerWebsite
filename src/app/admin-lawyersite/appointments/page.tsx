"use client";

import { useEffect, useState } from "react";
import { siteSettings } from "@/data/siteSettings";

type Appointment = {
  id: string;
  referenceNumber: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  service: { name: string };
  status: string;
  createdAt: string;
};

export default function AppointmentsPage() {
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Reply Modal State
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem("admin_token");
    if (savedToken) {
      setToken(savedToken);
      fetchAppointments(savedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${siteSettings.BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      
      localStorage.setItem("admin_token", data.data.token);
      setToken(data.data.token);
      fetchAppointments(data.data.token);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const fetchAppointments = async (authToken: string) => {
    try {
      const res = await fetch(`${siteSettings.BACKEND_URL}/api/admin/appointments`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch");
      setAppointments(data.data.items || []);
    } catch (err: any) {
      setError(err.message);
      if (err.message.includes("Unauthorized") || err.message.includes("token")) {
        localStorage.removeItem("admin_token");
        setToken(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppointment || !token) return;

    setSendingReply(true);
    try {
      const res = await fetch(`${siteSettings.BACKEND_URL}/api/admin/appointments/${selectedAppointment.id}/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          subject: `Re: Your Appointment`,
          message: replyMessage
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send reply");
      
      alert("Reply sent successfully via email!");
      setSelectedAppointment(null);
      setReplyMessage("");
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setSendingReply(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading...</div>;
  }

  // --- LOGIN VIEW ---
  if (!token) {
    return (
      <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-serif text-[#172B54] mb-6 text-center">Admin Login required</h2>
        {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              required
              className="w-full px-4 py-2 border rounded-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              required
              className="w-full px-4 py-2 border rounded-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="w-full bg-[#172B54] text-white py-2 rounded-md hover:bg-[#1a3366] transition">
            Login
          </button>
        </form>
      </div>
    );
  }

  // --- DASHBOARD VIEW ---
  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div>
          <h2 className="text-2xl font-serif text-gray-900 mb-1">Appointments</h2>
          <p className="text-gray-500 text-sm">View and manage client bookings.</p>
        </div>
        <button 
          onClick={() => {
            localStorage.removeItem("admin_token");
            setToken(null);
          }}
          className="text-sm text-red-600 border border-red-200 px-4 py-2 rounded hover:bg-red-50"
        >
          Logout
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-[#F9F8F6] text-gray-700 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-medium">Ref #</th>
                <th className="px-6 py-4 font-medium">Client</th>
                <th className="px-6 py-4 font-medium">Service</th>
                <th className="px-6 py-4 font-medium">Date Booked</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                    No appointments found.
                  </td>
                </tr>
              ) : (
                appointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 font-mono text-xs">{apt.referenceNumber}</td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{apt.clientName}</p>
                      <p className="text-xs text-gray-500">{apt.clientEmail}</p>
                      <p className="text-xs text-gray-500">{apt.clientPhone}</p>
                    </td>
                    <td className="px-6 py-4">{apt.service.name}</td>
                    <td className="px-6 py-4">{new Date(apt.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        apt.status === "CONFIRMED" ? "bg-green-100 text-green-700" :
                        apt.status === "PENDING_PAYMENT" ? "bg-amber-100 text-amber-700" :
                        "bg-gray-100 text-gray-700"
                      }`}>
                        {apt.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button 
                        onClick={() => setSelectedAppointment(apt)}
                        className="text-[#C9A84C] hover:text-[#b0923e] font-medium"
                      >
                        Reply Email
                      </button>
                      <span className="text-gray-300">|</span>
                      <a 
                        href={`https://wa.me/${apt.clientPhone.replace(/\D/g, "")}?text=Hi ${encodeURIComponent(apt.clientName)}, this is Raja Agrawal regarding your appointment (${apt.referenceNumber}).`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-700 font-medium"
                      >
                        WhatsApp
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reply Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-serif text-[#172B54]">Reply via Email</h3>
                <p className="text-sm text-gray-500">To: {selectedAppointment.clientName} ({selectedAppointment.clientEmail})</p>
              </div>
              <button onClick={() => setSelectedAppointment(null)} className="text-gray-400 hover:text-gray-700">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            <form onSubmit={handleReplySubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  required
                  rows={6}
                  className="w-full px-4 py-2 border rounded-md focus:ring-1 focus:ring-[#C9A84C] focus:border-[#C9A84C] outline-none"
                  placeholder="Type your message here..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setSelectedAppointment(null)}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={sendingReply}
                  className="px-4 py-2 text-sm bg-[#172B54] text-white rounded-md hover:bg-[#1a3366] disabled:opacity-50"
                >
                  {sendingReply ? "Sending..." : "Send Email"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
