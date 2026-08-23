// src/validators/appointment.validator.ts
// Zod schemas for validating appointment-related request bodies.

import { z } from "zod";

export const createAppointmentSchema = z.object({
  clientName: z.string().min(2, "Name must be at least 2 characters").max(100),
  clientEmail: z.string().email("Please provide a valid email address"),
  clientPhone: z
    .string()
    .min(7, "Please provide a valid phone number")
    .max(15)
    .regex(/^[+\d\s()-]+$/, "Invalid phone number format"),
  clientMessage: z.string().max(1000).optional(),
  serviceId: z.string().min(1, "Please select a service"),
  timeSlotId: z.string().uuid("Invalid time slot ID").optional(),
  preferredDate: z.string().optional(),
  disclaimerAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the disclaimer to proceed",
  }),
  // Honeypot — hidden from real users, bots fill it in
  website: z.string().max(0, "Bot detected").optional(),
});

export const verifyRazorpaySchema = z.object({
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
  appointmentId: z.string().uuid(),
});

export const initiatePhonePeSchema = z.object({
  appointmentId: z.string().uuid(),
});

export const createRazorpayOrderSchema = z.object({
  appointmentId: z.string().uuid(),
});

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
