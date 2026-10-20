import crypto from "crypto";
import { env } from "../config/env";

function signature(appointmentId: string, orderId: string, expiry: string): Buffer {
  return crypto.createHmac("sha256", env.JWT_SECRET)
    .update(`checkout-outcome:${appointmentId}:${orderId}:${expiry}`).digest();
}

// This proof is deliberately not an admin JWT and cannot authenticate admin API requests.
export function createCheckoutToken(appointmentId: string, orderId: string): string {
  const expiry = String(Date.now() + 2 * 60 * 60 * 1000);
  return `${expiry}.${signature(appointmentId, orderId, expiry).toString("base64url")}`;
}

export function verifyCheckoutToken(appointmentId: string, orderId: string, token: string): boolean {
  if (!/^\d{13}\.[A-Za-z0-9_-]{43}$/.test(token)) return false;
  const [expiry, encoded] = token.split(".");
  if (Number(expiry) <= Date.now()) return false;
  const received = Buffer.from(encoded, "base64url");
  const expected = signature(appointmentId, orderId, expiry);
  return received.length === expected.length && crypto.timingSafeEqual(received, expected);
}
