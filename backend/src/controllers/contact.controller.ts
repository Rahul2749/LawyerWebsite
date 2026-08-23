// src/controllers/contact.controller.ts
// Handles general contact form submissions (not appointment bookings).

import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/apiResponse";
import { prisma } from "../config/database";
import { sendLawyerAlertEmail } from "../services/email.service";
import { env } from "../config/env";
import nodemailer from "nodemailer";

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
  const transporter = nodemailer.createTransport({
    host: env.EMAIL_HOST,
    port: env.EMAIL_PORT,
    secure: env.EMAIL_PORT === 465,
    auth: { user: env.EMAIL_USER, pass: env.EMAIL_PASS },
  });

  await transporter.sendMail({
    from: `"Contact Form" <${env.EMAIL_FROM_ADDRESS}>`,
    to: env.LAWYER_EMAIL,
    subject: `📩 New Contact Message — ${subject || "No Subject"}`,
    html: `<p><b>From:</b> ${name} (${email})</p><p><b>Phone:</b> ${phone || "N/A"}</p><p><b>Message:</b><br/>${message}</p>`,
  }).catch((e) => console.error("Contact email failed:", e));

  sendSuccess(res, {}, "Message sent successfully");
});
