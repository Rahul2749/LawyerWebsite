// src/app.ts
// Express application setup — middleware, routes, error handling.
// server.ts imports this and starts it on a port.

import express from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./config/env";
import { generalLimiter } from "./middleware/rateLimiter.middleware";
import { errorMiddleware } from "./middleware/error.middleware";

// Import routes
import authRoutes from "./routes/auth.routes";
import appointmentRoutes from "./routes/appointment.routes";
import paymentRoutes from "./routes/payment.routes";
import serviceRoutes from "./routes/service.routes";
import contactRoutes from "./routes/contact.routes";

const app = express();

// ─── Security Middleware ────────────────────────────────────────────────────
app.use(helmet()); // Sets secure HTTP headers (XSS protection, hide X-Powered-By, etc.)
app.use(
  cors({
    origin: env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ─── Body Parsers ──────────────────────────────────────────────────────────
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));

// ─── Global Rate Limiter ───────────────────────────────────────────────────
app.use("/api", generalLimiter);

// ─── Health Check ─────────────────────────────────────────────────────────
// Always reachable — use for uptime monitoring
app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    data: {
      status: "healthy",
      timestamp: new Date().toISOString(),
      environment: env.NODE_ENV,
    },
  });
});

// ─── Routes ───────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/contact", contactRoutes);

// ─── 404 Handler ──────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: { code: "NOT_FOUND", message: "Route not found" },
  });
});

// ─── Global Error Handler ─────────────────────────────────────────────────
// Must be LAST middleware — 4-argument signature tells Express it's an error handler
app.use(errorMiddleware);

export default app;
