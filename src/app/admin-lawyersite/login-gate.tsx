"use client";

import { useState, ReactNode } from "react";
import { useAuth } from "./auth-context";

export function LoginGate({ children }: { children: ReactNode }) {
  const { token, isLoading, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d1216]">
        <div className="animate-spin w-8 h-8 border-2 border-[#B39352] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (token) return <>{children}</>;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F8F6]">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-[#E6E1D6] overflow-hidden">
          {/* Header strip */}
          <div className="bg-[#5A1824] px-8 py-7">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 rounded-full bg-[#B39352]/20 border border-[#B39352]/40 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B39352" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <span className="text-[#B39352] text-sm font-medium tracking-widest uppercase">Secure Access</span>
            </div>
            <h1 className="text-2xl font-serif text-white">Admin Login</h1>
            <p className="text-white/50 text-sm mt-1">Raja Agrawal Legal Consultancy</p>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            {error && (
              <div className="mb-5 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  className="w-full px-4 py-3 rounded-lg border border-[#E6E1D6] bg-[#F9F8F6] text-gray-900 text-sm focus:outline-none focus:border-[#5A1824] focus:ring-2 focus:ring-[#5A1824]/10 transition"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Password
                </label>
                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  className="w-full px-4 py-3 rounded-lg border border-[#E6E1D6] bg-[#F9F8F6] text-gray-900 text-sm focus:outline-none focus:border-[#5A1824] focus:ring-2 focus:ring-[#5A1824]/10 transition"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#5A1824] hover:bg-[#4a1320] text-white font-medium py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 mt-2"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in…
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>
                    </svg>
                    Sign In
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-5">
          Protected admin area. Unauthorized access is prohibited.
        </p>
      </div>
    </div>
  );
}
