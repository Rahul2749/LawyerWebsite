// src/controllers/track.controller.ts
// Handles OTP-based appointment tracking for clients.

import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess, sendError } from "../utils/apiResponse";
import { generateOTP, verifyOTP, canRequestOTP } from "../services/otp.service";
import { sendOTPEmail } from "../services/email.service";

// POST /api/track/send-otp
// Public — sends OTP to email if appointments exist for it
export const sendTrackingOTP = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email || typeof email !== "string" || !email.includes("@")) {
    sendError(res, "VALIDATION_ERROR", "Please provide a valid email address.", 400);
    return;
  }

  const normalizedEmail = email.toLowerCase().trim();

  // Rate limit check
  if (!canRequestOTP(normalizedEmail)) {
    sendError(
      res,
      "RATE_LIMITED",
      "Too many OTP requests. Please wait 15 minutes before trying again.",
      429
    );
    return;
  }

  // Check if any appointments exist for this email
  const { prisma } = await import("../config/database");
  const count = await prisma.appointment.count({
    where: { clientEmail: { equals: normalizedEmail, mode: "insensitive" } },
  });

  // Always respond with success to avoid email enumeration — but only send OTP if email exists
  if (count > 0) {
    const otp = generateOTP(normalizedEmail);
    try {
      await sendOTPEmail({ email: normalizedEmail, otp });
    } catch {
      sendError(res, "EMAIL_ERROR", "Failed to send OTP. Please try again.", 500);
      return;
    }
  }

  // Same response whether email exists or not (security: avoid enumeration)
  sendSuccess(
    res,
    { masked: maskEmail(normalizedEmail) },
    "If this email was used for a booking, an OTP has been sent to it."
  );
});

// POST /api/track/verify-otp
// Public — verifies OTP and returns appointments for the email
export const verifyTrackingOTP = asyncHandler(async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    sendError(res, "VALIDATION_ERROR", "Email and OTP are required.", 400);
    return;
  }

  const normalizedEmail = email.toLowerCase().trim();
  const result = verifyOTP(normalizedEmail, String(otp).trim());

  if (!result.valid) {
    sendError(res, "INVALID_OTP", result.reason ?? "Invalid OTP.", 401);
    return;
  }

  // OTP valid — fetch appointments
  const { prisma } = await import("../config/database");
  const appointments = await prisma.appointment.findMany({
    where: { clientEmail: { equals: normalizedEmail, mode: "insensitive" } },
    select: {
      id: true,
      referenceNumber: true,
      status: true,
      preferredDate: true,
      createdAt: true,
      service: { select: { name: true, price: true } },
      payment: { select: { status: true, gateway: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  sendSuccess(res, {
    appointments: appointments.map((a) => ({
      referenceNumber: a.referenceNumber,
      serviceName: a.service.name,
      servicePrice: a.service.price,
      status: a.status,
      preferredDate: a.preferredDate ?? null,
      createdAt: a.createdAt,
      paymentStatus: a.payment?.status ?? "NOT_PAID",
      paymentGateway: a.payment?.gateway ?? null,
    })),
  });
});

// ─── Helpers ──────────────────────────────────────────────────────────────────
function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  const masked =
    local.length <= 2
      ? "*".repeat(local.length)
      : local[0] + "*".repeat(local.length - 2) + local[local.length - 1];
  return `${masked}@${domain}`;
}
