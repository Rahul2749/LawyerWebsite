// src/routes/track.routes.ts

import { Router } from "express";
import rateLimit from "express-rate-limit";
import * as trackController from "../controllers/track.controller";

const router = Router();

// Dedicated rate limiter: 5 requests per 15 min per IP
const trackLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, error: { code: "RATE_LIMITED", message: "Too many tracking requests. Please try again later." } },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/send-otp", trackLimiter, trackController.sendTrackingOTP);
router.post("/verify-otp", trackLimiter, trackController.verifyTrackingOTP);

export default router;
