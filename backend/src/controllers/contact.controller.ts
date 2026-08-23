// src/controllers/contact.controller.ts
// Handles general contact form submissions (not appointment bookings).

import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/apiResponse";
import { prisma } from "../config/database";
import { sendContactAlertEmail } from "../services/email.service";
// POST /api/contact
// Public
export const submitContact = asyncHandler(async (req: Request, res: Response) => {
  // Honeypot check
  if (req.body.website && req.body.website.length > 0) {
    sendSuccess(res, {}, "Message sent successfully");
    return;
  }

  const { name, email, phone, subject, message } = req.body;

  await prisma.contactMessage.create({
    data: { name, email, phone, subject, message },
  });

  // Alert the lawyer via email
  await sendContactAlertEmail({ name, email, phone, subject, message });

  sendSuccess(res, {}, "Message sent successfully");
});
