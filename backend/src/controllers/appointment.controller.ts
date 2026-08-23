// src/controllers/appointment.controller.ts
// Handles HTTP requests for appointments.
// Controllers validate input, call services, and return responses.
// They do NOT contain business logic — that lives in appointment.service.ts

import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess, sendError } from "../utils/apiResponse";
import * as appointmentService from "../services/appointment.service";

// Helper to safely read query string params
function queryStr(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

// POST /api/appointments
// Public — creates a new appointment (status: PENDING_PAYMENT)
export const createAppointment = asyncHandler(async (req: Request, res: Response) => {
  // Honeypot check — bots fill in hidden fields
  if (req.body.website && req.body.website.length > 0) {
    sendSuccess(res, { referenceNumber: "BOT-BLOCKED" }, "Submitted successfully");
    return;
  }

  const appointment = await appointmentService.createAppointment(req.body);

  sendSuccess(
    res,
    {
      id: appointment.id,
      referenceNumber: appointment.referenceNumber,
      status: appointment.status,
      serviceName: appointment.service.name,
      servicePrice: appointment.service.price,
    },
    "Appointment created. Please complete payment to confirm.",
    201
  );
});

// GET /api/appointments/ref/:ref
// Public — allows clients to check their booking status by reference number
export const getAppointmentByRef = asyncHandler(async (req: Request, res: Response) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref: string = (req.params as any).ref ?? "";
  const appointment = await appointmentService.getAppointmentByReference(ref);

  if (!appointment) {
    sendError(res, "NOT_FOUND", "Appointment not found", 404);
    return;
  }

  sendSuccess(res, {
    referenceNumber: appointment.referenceNumber,
    clientName: appointment.clientName,
    status: appointment.status,
    serviceName: appointment.service.name,
    createdAt: appointment.createdAt,
    paymentStatus: appointment.payment?.status ?? "NOT_PAID",
  });
});

// GET /api/admin/appointments
// Admin only — full appointment list with pagination
export const getAllAppointments = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(queryStr(req.query.page) ?? "1") || 1;
  const pageSize = parseInt(queryStr(req.query.pageSize) ?? "20") || 20;
  const status = queryStr(req.query.status);

  const result = await appointmentService.getAllAppointments(page, pageSize, status);
  sendSuccess(res, result);
});

// PATCH /api/admin/appointments/:id/status
// Admin only — update appointment status
export const updateAppointmentStatus = asyncHandler(async (req: Request, res: Response) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const id: string = (req.params as any).id ?? "";
  const { status, notes } = req.body;

  const { prisma } = await import("../config/database");
  const updated = await prisma.appointment.update({
    where: { id },
    data: { status, ...(notes && { notes }) },
  });

  sendSuccess(res, updated, "Appointment status updated");
});

// GET /api/slots?date=YYYY-MM-DD
// Public — get available time slots for a specific date
export const getAvailableSlots = asyncHandler(async (req: Request, res: Response) => {
  const date = queryStr(req.query.date);
  if (!date) {
    sendError(res, "MISSING_DATE", "Please provide a date query parameter (YYYY-MM-DD)", 400);
    return;
  }

  const slots = await appointmentService.getAvailableSlots(date);
  sendSuccess(res, slots);
});

// POST /api/admin/appointments/:id/reply
// Admin only — send an email reply directly to the client
export const replyToClient = asyncHandler(async (req: Request, res: Response) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const id: string = (req.params as any).id ?? "";
  const { subject, message } = req.body;

  if (!subject || !message) {
    sendError(res, "VALIDATION_ERROR", "Subject and message are required", 400);
    return;
  }

  const { prisma } = await import("../config/database");
  const appointment = await prisma.appointment.findUnique({
    where: { id },
    select: { clientName: true, clientEmail: true, referenceNumber: true }
  });

  if (!appointment) {
    sendError(res, "NOT_FOUND", "Appointment not found", 404);
    return;
  }

  const { sendCustomReplyEmail } = await import("../services/email.service");
  await sendCustomReplyEmail({
    clientName: appointment.clientName,
    clientEmail: appointment.clientEmail,
    referenceNumber: appointment.referenceNumber,
    subject,
    message
  });

  sendSuccess(res, null, "Reply sent successfully");
});
