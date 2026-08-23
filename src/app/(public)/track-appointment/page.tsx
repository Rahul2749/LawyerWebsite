"use client";

import { useState, useRef, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { siteSettings } from "@/data/siteSettings";

// ─── Types ────────────────────────────────────────────────────────────────────
type AppointmentData = {
  referenceNumber: string;
  serviceName: string;
  servicePrice: number;
  status: string;
  preferredDate: string | null;
  createdAt: string;
  paymentStatus: string;
  paymentGateway: string | null;
};

// ─── Status helpers ───────────────────────────────────────────────────────────
const STATUS_META: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  CONFIRMED: {
    label: "Confirmed",
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
    ),
  },
  PENDING_PAYMENT: {
    label: "Pending Payment",
    color: "bg-amber-100 text-amber-700 border-amber-200",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
  },
  COMPLETED: {
    label: "Completed",
    color: "bg-blue-100 text-blue-700 border-blue-200",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    ),
  },
  CANCELLED: {
    label: "Cancelled",
    color: "bg-red-100 text-red-600 border-red-200",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    ),
  },
  REFUNDED: {
    label: "Refunded",
    color: "bg-gray-100 text-gray-600 border-gray-200",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
    ),
  },
};

// ─── Step 1: Email Input ──────────────────────────────────────────────────────
function EmailStep({
  onSuccess,
}: {
  onSuccess: (email: string, masked: string) => void;
}) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${siteSettings.BACKEND_URL}/api/track/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message ?? data.error ?? "Failed to send OTP");
      onSuccess(email, data.data.masked);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-300">
      <div className="text-center mb-10">
        <div className="w-16 h-16 rounded-2xl bg-[#5A1824]/8 flex items-center justify-center mx-auto mb-5">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#5A1824" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
        </div>
        <h2 className="text-2xl font-serif text-gray-900 mb-2">Track Your Appointment</h2>
        <p className="text-gray-500 text-sm max-w-xs mx-auto">
          Enter the email address you used when booking your consultation.
        </p>
      </div>

      {error && (
        <div className="mb-5 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl flex items-start gap-2">
          <svg className="mt-0.5 shrink-0" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Email Address
          </label>
          <input
            type="email"
            required
            autoComplete="email"
            className="w-full px-4 py-3.5 rounded-xl border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-[#5A1824] focus:ring-3 focus:ring-[#5A1824]/8 transition bg-gray-50/50"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#5A1824] hover:bg-[#4a1320] text-white font-medium py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2.5 disabled:opacity-60 text-sm"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Sending OTP…
            </>
          ) : (
            <>
              Send One-Time Password
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </>
          )}
        </button>
      </form>

      <p className="text-center text-xs text-gray-400 mt-6">
        We&apos;ll send a 6-digit code to your email. Valid for 10 minutes.
      </p>
    </div>
  );
}

// ─── Step 2: OTP Input ────────────────────────────────────────────────────────
function OTPStep({
  email,
  maskedEmail,
  onSuccess,
  onBack,
}: {
  email: string;
  maskedEmail: string;
  onSuccess: (appointments: AppointmentData[]) => void;
  onBack: () => void;
}) {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(600); // 10 min
  const [canResend, setCanResend] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(timer); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Resend cooldown
  useEffect(() => {
    if (canResend) return;
    const timer = setInterval(() => {
      setResendCooldown((t) => {
        if (t <= 1) { clearInterval(timer); setCanResend(true); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [canResend]);

  const formatTime = (secs: number) =>
    `${String(Math.floor(secs / 60)).padStart(2, "0")}:${String(secs % 60).padStart(2, "0")}`;

  const handleDigitChange = (index: number, value: string) => {
    const clean = value.replace(/\D/g, "").slice(-1);
    const newDigits = [...digits];
    newDigits[index] = clean;
    setDigits(newDigits);
    setError("");

    if (clean && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all filled
    if (clean && newDigits.every((d) => d !== "") && index === 5) {
      submitOTP(newDigits.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      const newDigits = pasted.split("");
      setDigits(newDigits);
      inputRefs.current[5]?.focus();
      setTimeout(() => submitOTP(pasted), 50);
    }
  };

  const submitOTP = useCallback(async (otp: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${siteSettings.BACKEND_URL}/api/track/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message ?? data.error ?? "Invalid OTP");
      onSuccess(data.data.appointments);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Verification failed");
      setDigits(["", "", "", "", "", ""]);
      setTimeout(() => inputRefs.current[0]?.focus(), 50);
    } finally {
      setLoading(false);
    }
  }, [email, onSuccess]);

  const handleResend = async () => {
    if (!canResend) return;
    setCanResend(false);
    setResendCooldown(60);
    setTimeLeft(600);
    setDigits(["", "", "", "", "", ""]);
    setError("");
    try {
      await fetch(`${siteSettings.BACKEND_URL}/api/track/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch {
      // silent
    }
    inputRefs.current[0]?.focus();
  };

  return (
    <div className="animate-in fade-in duration-300">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition mb-8">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
        Back
      </button>

      <div className="text-center mb-10">
        <div className="w-16 h-16 rounded-2xl bg-[#5A1824]/8 flex items-center justify-center mx-auto mb-5">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#5A1824" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
          </svg>
        </div>
        <h2 className="text-2xl font-serif text-gray-900 mb-2">Enter OTP</h2>
        <p className="text-gray-500 text-sm">
          We sent a code to <span className="font-medium text-gray-700">{maskedEmail}</span>
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl flex items-start gap-2">
          <svg className="mt-0.5 shrink-0" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          {error}
        </div>
      )}

      {/* 6-digit OTP boxes */}
      <div className="flex gap-3 justify-center mb-8" onPaste={handlePaste}>
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={(el) => { inputRefs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            disabled={loading}
            onChange={(e) => handleDigitChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            autoFocus={i === 0}
            className={`w-12 h-14 text-center text-xl font-bold border-2 rounded-xl outline-none transition-all duration-200 disabled:opacity-50
              ${digit
                ? "border-[#5A1824] bg-[#5A1824]/5 text-[#5A1824]"
                : "border-gray-200 bg-gray-50 text-gray-900 focus:border-[#5A1824] focus:bg-white"
              }`}
          />
        ))}
      </div>

      {/* Timer & Resend */}
      <div className="flex items-center justify-between text-sm mb-6">
        <span className={`font-mono font-medium ${timeLeft < 60 ? "text-red-500" : "text-gray-500"}`}>
          {timeLeft > 0 ? `⏱ ${formatTime(timeLeft)}` : "OTP expired"}
        </span>
        <button
          onClick={handleResend}
          disabled={!canResend}
          className={`text-sm font-medium transition ${canResend ? "text-[#5A1824] hover:underline" : "text-gray-300 cursor-not-allowed"}`}
        >
          {canResend ? "Resend OTP" : `Resend in ${resendCooldown}s`}
        </button>
      </div>

      <button
        onClick={() => submitOTP(digits.join(""))}
        disabled={loading || digits.some((d) => !d) || timeLeft === 0}
        className="w-full bg-[#5A1824] hover:bg-[#4a1320] text-white font-medium py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2.5 disabled:opacity-50 text-sm"
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Verifying…
          </>
        ) : "Verify & Track"}
      </button>
    </div>
  );
}

// ─── Step 3: Results ──────────────────────────────────────────────────────────
function ResultsStep({
  appointments,
  onReset,
}: {
  appointments: AppointmentData[];
  onReset: () => void;
}) {
  return (
    <div className="animate-in fade-in duration-300 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-serif text-gray-900">Your Appointments</h2>
          <p className="text-sm text-gray-500 mt-0.5">{appointments.length} booking{appointments.length !== 1 ? "s" : ""} found</p>
        </div>
        <button onClick={onReset} className="text-xs text-gray-400 hover:text-gray-600 border border-gray-200 rounded-lg px-3 py-1.5 transition">
          ← New Search
        </button>
      </div>

      {appointments.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          </div>
          <p className="text-gray-500 text-sm">No appointments found for this email.</p>
          <Link href="/consultation" className="mt-4 inline-block text-sm font-medium text-[#5A1824] hover:underline">
            Book a Consultation →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((apt) => {
            const meta = STATUS_META[apt.status] ?? { label: apt.status, color: "bg-gray-100 text-gray-600 border-gray-200", icon: null };
            return (
              <div key={apt.referenceNumber} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div>
                    <p className="text-xs font-mono text-gray-400 mb-1">{apt.referenceNumber}</p>
                    <h3 className="font-semibold text-gray-900">{apt.serviceName}</h3>
                    <p className="text-sm text-gray-500">₹{apt.servicePrice.toLocaleString("en-IN")}</p>
                  </div>
                  <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${meta.color} shrink-0`}>
                    {meta.icon}
                    {meta.label}
                  </span>
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400 mb-0.5">Booked On</p>
                    <p className="font-medium text-gray-800">
                      {new Date(apt.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400 mb-0.5">Preferred Date</p>
                    <p className="font-medium text-gray-800">
                      {apt.preferredDate
                        ? new Date(apt.preferredDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                        : "Not specified"}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400 mb-0.5">Payment</p>
                    <p className={`font-medium ${apt.paymentStatus === "SUCCESS" ? "text-emerald-600" : apt.paymentStatus === "FAILED" ? "text-red-600" : "text-amber-600"}`}>
                      {apt.paymentStatus === "SUCCESS" ? "✓ Paid" : apt.paymentStatus === "NOT_PAID" ? "Pending" : apt.paymentStatus}
                      {apt.paymentGateway && <span className="text-gray-400 font-normal ml-1">via {apt.paymentGateway}</span>}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400 mb-0.5">Next Step</p>
                    <p className="font-medium text-gray-800 text-xs leading-snug">
                      {apt.status === "CONFIRMED" && "Lawyer will contact you within 1 business day"}
                      {apt.status === "PENDING_PAYMENT" && "Complete payment to confirm"}
                      {apt.status === "COMPLETED" && "Consultation done ✓"}
                      {apt.status === "CANCELLED" && "Appointment cancelled"}
                      {apt.status === "REFUNDED" && "Refund processed"}
                    </p>
                  </div>
                </div>

                {/* WhatsApp CTA for confirmed */}
                {apt.status === "CONFIRMED" && (
                  <a
                    href={`https://wa.me/${siteSettings.whatsapp}?text=${encodeURIComponent(`Hi, I have a confirmed appointment. My reference number is ${apt.referenceNumber}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 flex items-center justify-center gap-2 text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl py-2.5 hover:bg-emerald-100 transition"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    Message Lawyer on WhatsApp
                  </a>
                )}

                {apt.status === "PENDING_PAYMENT" && (
                  <Link
                    href="/consultation"
                    className="mt-4 flex items-center justify-center gap-2 text-sm font-medium text-[#5A1824] bg-[#5A1824]/5 border border-[#5A1824]/20 rounded-xl py-2.5 hover:bg-[#5A1824]/10 transition"
                  >
                    Complete Payment →
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Book another */}
      <div className="pt-2 text-center">
        <Link
          href="/consultation"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#5A1824] hover:text-[#7a2030] transition"
        >
          Book a New Consultation
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </Link>
      </div>
    </div>
  );
}

// ─── Progress Step Dots ───────────────────────────────────────────────────────
function StepDots({ step }: { step: 1 | 2 | 3 }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {[1, 2, 3].map((s) => (
        <div
          key={s}
          className={`rounded-full transition-all duration-300 ${
            s === step
              ? "w-6 h-2 bg-[#5A1824]"
              : s < step
              ? "w-2 h-2 bg-[#5A1824]/40"
              : "w-2 h-2 bg-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
function TrackAppointmentPageInner() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [maskedEmail, setMaskedEmail] = useState("");
  const [appointments, setAppointments] = useState<AppointmentData[]>([]);

  const handleEmailSuccess = (e: string, masked: string) => {
    setEmail(e);
    setMaskedEmail(masked);
    setStep(2);
  };

  const handleOTPSuccess = (apts: AppointmentData[]) => {
    setAppointments(apts);
    setStep(3);
  };

  const handleReset = () => {
    setStep(1);
    setEmail("");
    setMaskedEmail("");
    setAppointments([]);
  };

  return (
    <>
      {/* Hero */}
      <section
        className="pt-32 pb-12 lg:pt-36 lg:pb-16 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0d1b35 0%, #172B54 100%)" }}
      >
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "radial-gradient(circle at 2px 2px, #C9A84C 1px, transparent 0)", backgroundSize: "40px 40px" }}
          aria-hidden="true"
        />
        <div className="container relative z-10 text-center">
          <p className="text-eyebrow mb-3" style={{ color: "#C9A84C" }}>
            Appointment Status
          </p>
          <h1 className="text-hero" style={{ color: "#F7F4EE" }}>
            Track Your <span className="italic" style={{ color: "#C9A84C" }}>Booking</span>
          </h1>
          <p className="text-body mt-4 mx-auto" style={{ color: "rgba(247,244,238,0.6)", maxWidth: "440px" }}>
            Enter your email to receive a one-time code and view the status of your consultation.
          </p>
        </div>
      </section>

      {/* Card */}
      <section className="py-16 lg:py-24">
        <div className="container max-w-lg mx-auto">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 px-8 py-10">
            {step !== 3 && <StepDots step={step} />}

            {step === 1 && <EmailStep onSuccess={handleEmailSuccess} />}
            {step === 2 && (
              <OTPStep
                email={email}
                maskedEmail={maskedEmail}
                onSuccess={handleOTPSuccess}
                onBack={() => setStep(1)}
              />
            )}
            {step === 3 && (
              <ResultsStep appointments={appointments} onReset={handleReset} />
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default function TrackAppointmentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-[#5A1824] border-t-transparent rounded-full" /></div>}>
      <TrackAppointmentPageInner />
    </Suspense>
  );
}
