// src/controllers/payment.controller.ts
// Handles payment gateway interactions for both Razorpay and PhonePe.

import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess, sendError } from "../utils/apiResponse";
import * as paymentService from "../services/payment.service";
import * as appointmentService from "../services/appointment.service";
import { prisma } from "../config/database";

// ─── RAZORPAY ──────────────────────────────────────────────────────────────

// POST /api/payments/razorpay/create-order
// Step 1: Client calls this to get a Razorpay order ID
// Then the frontend opens Razorpay checkout with the order ID
export const createRazorpayOrder = asyncHandler(async (req: Request, res: Response) => {
  const { appointmentId } = req.body;

  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: { service: true },
  });

  if (!appointment) {
    sendError(res, "NOT_FOUND", "Appointment not found", 404);
    return;
  }

  if (appointment.status !== "PENDING_PAYMENT") {
    sendError(res, "ALREADY_PAID", "This appointment has already been paid for", 400);
    return;
  }

  const orderResult = await paymentService.createRazorpayOrder(
    appointment.service.price,
    appointment.referenceNumber
  );

  // Save payment record in DB
  await prisma.payment.upsert({
    where: { appointmentId },
    update: { orderId: orderResult.orderId, gateway: "RAZORPAY" },
    create: {
      appointmentId,
      gateway: "RAZORPAY",
      amount: appointment.service.price,
      orderId: orderResult.orderId,
      status: "CREATED",
    },
  });

  sendSuccess(res, {
    ...orderResult,
    appointmentId,
    clientName: appointment.clientName,
    clientEmail: appointment.clientEmail,
    clientPhone: appointment.clientPhone,
    description: `Consultation — ${appointment.service.name}`,
  });
});

// POST /api/payments/razorpay/verify
// Step 2: After the user pays, Razorpay sends back payment details.
// We verify the signature to confirm the payment is genuine.
export const verifyRazorpayPayment = asyncHandler(async (req: Request, res: Response) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, appointmentId } = req.body;

  const isValid = paymentService.verifyRazorpaySignature(
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
  );

  if (!isValid) {
    sendError(res, "INVALID_SIGNATURE", "Payment verification failed. Please contact support.", 400);
    return;
  }

  // Update payment record
  await prisma.payment.update({
    where: { appointmentId },
    data: {
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
      status: "SUCCESS",
    },
  });

  // Confirm appointment and trigger email/WhatsApp notifications
  const appointment = await appointmentService.confirmAppointmentAfterPayment(appointmentId);

  sendSuccess(res, {
    referenceNumber: appointment.referenceNumber,
    status: appointment.status,
  }, "Payment verified. Appointment confirmed!");
});

// ─── PHONEPE ──────────────────────────────────────────────────────────────

// POST /api/payments/phonepe/initiate
// Step 1: Client calls this to get a PhonePe redirect URL
// Frontend redirects the user to this URL to complete payment on PhonePe
export const initiatePhonePePayment = asyncHandler(async (req: Request, res: Response) => {
  const { appointmentId } = req.body;

  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: { service: true },
  });

  if (!appointment) {
    sendError(res, "NOT_FOUND", "Appointment not found", 404);
    return;
  }

  if (appointment.status !== "PENDING_PAYMENT") {
    sendError(res, "ALREADY_PAID", "This appointment has already been paid for", 400);
    return;
  }

  const result = await paymentService.initiatePhonePePayment(
    appointment.service.price,
    appointment.referenceNumber,
    appointment.clientPhone,
    appointment.clientName
  );

  // Save payment record
  await prisma.payment.upsert({
    where: { appointmentId },
    update: { orderId: result.merchantTransactionId, gateway: "PHONEPE" },
    create: {
      appointmentId,
      gateway: "PHONEPE",
      amount: appointment.service.price,
      orderId: result.merchantTransactionId,
      status: "CREATED",
    },
  });

  sendSuccess(res, { redirectUrl: result.redirectUrl });
});

// POST /api/payments/phonepe/callback
// PhonePe calls this URL after payment completion (webhook)
// We verify the checksum and update the appointment status
export const phonePeCallback = asyncHandler(async (req: Request, res: Response) => {
  const { response } = req.body;
  const receivedChecksum = req.headers["x-verify"] as string;

  if (!response || !receivedChecksum) {
    res.status(400).send("Invalid callback");
    return;
  }

  const isValid = paymentService.verifyPhonePeCallback(response, receivedChecksum);
  if (!isValid) {
    console.error("PhonePe callback checksum verification failed");
    res.status(400).send("Checksum verification failed");
    return;
  }

  const { success, merchantTransactionId } = paymentService.decodePhonePeResponse(response);

  // Find the payment record by PhonePe's transaction ID
  const payment = await prisma.payment.findFirst({
    where: { orderId: merchantTransactionId },
  });

  if (!payment) {
    res.status(404).send("Payment record not found");
    return;
  }

  if (success) {
    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: "SUCCESS" },
    });
    await appointmentService.confirmAppointmentAfterPayment(payment.appointmentId);
  } else {
    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: "FAILED" },
    });
  }

  // PhonePe expects a 200 OK response
  res.status(200).send("OK");
});
