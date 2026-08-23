// src/middleware/rateLimiter.middleware.ts
// Rate limiters to prevent abuse and brute-force attacks.
// Different limits for different routes (e.g., appointment form vs. general API).

import rateLimit from "express-rate-limit";
import { sendError } from "../utils/apiResponse";
import { Response } from "express";

// General API rate limit — 100 requests per 15 minutes per IP
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res: Response) => {
    sendError(res, "RATE_LIMIT", "Too many requests, please try again later.", 429);
  },
});

// Appointment form — stricter limit: 5 bookings per hour per IP
export const appointmentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res: Response) => {
    sendError(res, "RATE_LIMIT", "Too many appointment requests. Please wait before trying again.", 429);
  },
});

// Auth endpoints — stricter: 10 attempts per 15 minutes
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res: Response) => {
    sendError(res, "RATE_LIMIT", "Too many login attempts. Please try again later.", 429);
  },
});
