// src/routes/appointment.routes.ts

import { Router } from "express";
import * as appointmentController from "../controllers/appointment.controller";
import { validate } from "../middleware/validate.middleware";
import { authMiddleware } from "../middleware/auth.middleware";
import { appointmentLimiter } from "../middleware/rateLimiter.middleware";
import { createAppointmentSchema } from "../validators/appointment.validator";

const router = Router();

// Public routes
router.post("/", appointmentLimiter, validate(createAppointmentSchema), appointmentController.createAppointment);
router.get("/ref/:ref", appointmentController.getAppointmentByRef);
router.get("/slots", appointmentController.getAvailableSlots);

// Admin routes (protected)
router.get("/", authMiddleware, appointmentController.getAllAppointments);
router.patch("/:id/status", authMiddleware, appointmentController.updateAppointmentStatus);
router.post("/:id/reply", authMiddleware, appointmentController.replyToClient);

export default router;
