// src/services/otp.service.ts
// In-memory OTP store for appointment tracking.
// OTPs expire after 10 minutes and are deleted after first successful use.
// Rate limiting: max 3 requests per email per 15 minutes.

interface OTPRecord {
  otp: string;
  expiry: number;      // Unix timestamp ms
  attempts: number;    // Failed verification attempts
}

interface RateLimitRecord {
  count: number;
  windowStart: number; // Unix timestamp ms
}

// In-memory stores
const otpStore = new Map<string, OTPRecord>();
const rateLimitStore = new Map<string, RateLimitRecord>();

const OTP_EXPIRY_MS = 10 * 60 * 1000;        // 10 minutes
const MAX_ATTEMPTS = 3;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_OTP_REQUESTS = 3;

// ─── Generate & Store OTP ─────────────────────────────────────────────────────
export function generateOTP(email: string): string {
  const key = email.toLowerCase();
  const otp = String(Math.floor(100000 + Math.random() * 900000)); // 6 digits
  otpStore.set(key, {
    otp,
    expiry: Date.now() + OTP_EXPIRY_MS,
    attempts: 0,
  });

  // Update rate limit record
  const existing = rateLimitStore.get(key);
  if (existing && Date.now() - existing.windowStart < RATE_LIMIT_WINDOW_MS) {
    existing.count += 1;
  } else {
    rateLimitStore.set(key, { count: 1, windowStart: Date.now() });
  }

  return otp;
}

// ─── Rate Limit Check ─────────────────────────────────────────────────────────
export function canRequestOTP(email: string): boolean {
  const key = email.toLowerCase();
  const record = rateLimitStore.get(key);
  if (!record) return true;
  if (Date.now() - record.windowStart >= RATE_LIMIT_WINDOW_MS) {
    rateLimitStore.delete(key);
    return true;
  }
  return record.count < MAX_OTP_REQUESTS;
}

// ─── Verify OTP ───────────────────────────────────────────────────────────────
export function verifyOTP(email: string, otp: string): { valid: boolean; reason?: string } {
  const key = email.toLowerCase();
  const record = otpStore.get(key);

  if (!record) {
    return { valid: false, reason: "No OTP found. Please request a new one." };
  }

  if (Date.now() > record.expiry) {
    otpStore.delete(key);
    return { valid: false, reason: "OTP has expired. Please request a new one." };
  }

  if (record.attempts >= MAX_ATTEMPTS) {
    otpStore.delete(key);
    return { valid: false, reason: "Too many failed attempts. Please request a new OTP." };
  }

  if (record.otp !== otp.trim()) {
    record.attempts += 1;
    return { valid: false, reason: `Invalid OTP. ${MAX_ATTEMPTS - record.attempts} attempts remaining.` };
  }

  // ✅ Valid — delete immediately (single use)
  otpStore.delete(key);
  return { valid: true };
}

// ─── Cleanup (run periodically to avoid memory leaks) ─────────────────────────
export function cleanupExpiredOTPs(): void {
  const now = Date.now();
  for (const [key, record] of otpStore.entries()) {
    if (now > record.expiry) otpStore.delete(key);
  }
  for (const [key, record] of rateLimitStore.entries()) {
    if (now - record.windowStart >= RATE_LIMIT_WINDOW_MS) rateLimitStore.delete(key);
  }
}

// Run cleanup every 30 minutes
setInterval(cleanupExpiredOTPs, 30 * 60 * 1000);
