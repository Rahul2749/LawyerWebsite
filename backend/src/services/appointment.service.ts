// src/services/appointment.service.ts
// Business logic for appointments.
// Controllers call these functions — they don't talk to the DB directly.

import { prisma } from "../config/database";
import { generateReference } from "../utils/generateReference";
import { sendBookingConfirmationEmail, sendLawyerAlertEmail } from "./email.service";
import { buildLawyerWhatsAppData } from "./whatsapp.service";
import { sendAdminBookingNotification } from "./notification.service";

export interface CreateAppointmentInput {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientMessage?: string;
  serviceId: string;
  timeSlotId?: string;
  preferredDate?: string;
  disclaimerAccepted: boolean;
}

// Create a new appointment (status: PENDING_PAYMENT)
// Actual confirmation happens after payment is verified
export async function createAppointment(input: CreateAppointmentInput) {
  const { serviceId, timeSlotId } = input;

  // The frontend sends the slug in the "serviceId" field
  const service = await prisma.service.findUnique({ where: { slug: serviceId } });
  if (!service) throw new Error("Service not found");
  if (!service.isActive) throw new Error("This service is not currently available");

  // If a time slot is selected, mark it as booked
  if (timeSlotId) {
    const slot = await prisma.timeSlot.findUnique({ where: { id: timeSlotId } });
    if (!slot) throw new Error("Time slot not found");
    if (slot.isBooked) throw new Error("This time slot is already booked");
  }

  const referenceNumber = generateReference();

  const appointment = await prisma.appointment.create({
    data: {
      referenceNumber,
      clientName: input.clientName,
      clientEmail: input.clientEmail,
      clientPhone: input.clientPhone,
      clientMessage: input.clientMessage,
      serviceId: service.id, // Use the actual DB UUID
      timeSlotId,
      preferredDate: input.preferredDate ? new Date(input.preferredDate) : undefined,
      disclaimerAccepted: input.disclaimerAccepted,
      status: "PENDING_PAYMENT",
    },
    include: { service: true, timeSlot: true },
  });

  // Mark time slot as booked
  if (timeSlotId) {
    await prisma.timeSlot.update({
      where: { id: timeSlotId },
      data: { isBooked: true },
    });
  }

  // Notify the lawyer as soon as the request is created, even if payment is not completed.
  void sendLawyerAlertEmail({
    clientName: appointment.clientName,
    clientEmail: appointment.clientEmail,
    clientPhone: appointment.clientPhone,
    referenceNumber: appointment.referenceNumber,
    serviceName: appointment.service.name,
    message: appointment.clientMessage ?? undefined,
    amount: appointment.service.price,
    appointmentStatus: "PENDING_PAYMENT",
  }).catch((error) => console.error("Failed to send pending appointment alert:", error));

  void sendAdminBookingNotification(appointment.id, "PENDING_PAYMENT");

  return appointment;
}

// Confirm appointment after payment success
// Called after Razorpay/PhonePe verifies the payment
export async function confirmAppointmentAfterPayment(appointmentId: string) {
  // Only one concurrent payment callback may transition and notify for this booking.
  const transition = await prisma.appointment.updateMany({
    where: { id: appointmentId, status: "PENDING_PAYMENT" },
    data: { status: "CONFIRMED" },
  });
  const appointment = await prisma.appointment.findUniqueOrThrow({
    where: { id: appointmentId },
    include: { service: true, payment: true },
  });
  if (transition.count === 0) {
    // Preserve later admin changes (completed/cancelled/refunded) on a retried callback.
    return appointment;
  }

  void sendAdminBookingNotification(appointment.id, "CONFIRMED");

  // Send emails (non-blocking — don't fail the payment confirmation if email fails)
  const emailParams = {
    clientName: appointment.clientName,
    clientEmail: appointment.clientEmail,
    referenceNumber: appointment.referenceNumber,
    serviceName: appointment.service.name,
    amount: appointment.payment?.amount ?? 0,
  };

  // Fire and forget — email failures shouldn't break the payment flow
  Promise.all([
    sendBookingConfirmationEmail(emailParams).catch((e) =>
      console.error("Failed to send client email:", e)
    ),
    sendLawyerAlertEmail({
      ...emailParams,
      clientPhone: appointment.clientPhone,
      message: appointment.clientMessage ?? undefined,
      appointmentStatus: "CONFIRMED",
    }).catch((e) => console.error("Failed to send lawyer alert email:", e)),
  ]);

  // Build WhatsApp link for the lawyer (included in their alert email)
  const whatsappData = buildLawyerWhatsAppData({
    clientName: appointment.clientName,
    clientPhone: appointment.clientPhone,
    referenceNumber: appointment.referenceNumber,
    serviceName: appointment.service.name,
  });

  console.log(
    `📱 WhatsApp quick-reply link for ${appointment.referenceNumber}: ${whatsappData.clientLink}`
  );

  return appointment;
}

// Get appointment by reference number (for client status page)
export async function getAppointmentByReference(referenceNumber: string) {
  return prisma.appointment.findUnique({
    where: { referenceNumber },
    include: { service: true, payment: true, timeSlot: true },
  });
}

// Get all appointments (admin only)
export async function getAllAppointments(page = 1, pageSize = 20, status?: string) {
  const where = status ? { status: status as "PENDING_PAYMENT" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "REFUNDED" } : {};
  
  const [items, total] = await Promise.all([
    prisma.appointment.findMany({
      where,
      include: { service: true, payment: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.appointment.count({ where }),
  ]);

  return { items, page, pageSize, total, totalPages: Math.ceil(total / pageSize) };
}

// Get available time slots for a given date
export async function getAvailableSlots(date: string) {
  const targetDate = new Date(date);
  return prisma.timeSlot.findMany({
    where: {
      date: targetDate,
      isBooked: false,
    },
    orderBy: { startTime: "asc" },
  });
}
