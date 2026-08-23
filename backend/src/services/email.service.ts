// src/services/email.service.ts
// Sends transactional emails via Resend.
// All emails are currently hardcoded to go to rgnagrikar@gmail.com for testing purposes.

import { Resend } from "resend";
import { env } from "../config/env";

// Initialize Resend
const resend = new Resend(env.RESEND_API_KEY);

// As requested, all emails will go here for now when form is submitted
// NOTE: Resend free tier only allows sending to the account's own email until a domain is verified
const TESTING_EMAIL = "rahulnagrikar123@gmail.com";

// ─── Send booking confirmation to CLIENT ────────────────────────────────────
export async function sendBookingConfirmationEmail(params: {
  clientName: string;
  clientEmail: string;
  referenceNumber: string;
  serviceName: string;
  appointmentDate?: string;
  amount: number;
}): Promise<void> {
  const { clientName, clientEmail, referenceNumber, serviceName, appointmentDate, amount } = params;

  try {
    await resend.emails.send({
      from: `"${env.EMAIL_FROM_NAME}" <${env.EMAIL_FROM_ADDRESS}>`,
      to: TESTING_EMAIL, // overriding clientEmail for now
      subject: `Appointment Confirmed — ${referenceNumber} (Originally to: ${clientEmail})`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8" />
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; background: #f7f4ee; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 40px auto; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.08); }
            .header { background: #172B54; padding: 32px 40px; }
            .header h1 { color: #C9A84C; margin: 0; font-size: 24px; font-weight: 600; }
            .header p { color: #fff; margin: 8px 0 0; opacity: 0.8; font-size: 14px; }
            .body { padding: 32px 40px; }
            .ref-box { background: #f7f4ee; border: 1px solid #e2dcd0; border-left: 4px solid #C9A84C; padding: 16px 20px; margin: 24px 0; border-radius: 4px; }
            .ref-box .label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #68645e; margin: 0; }
            .ref-box .value { font-size: 22px; font-weight: 700; color: #172B54; margin: 4px 0 0; font-family: monospace; }
            .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f0ece4; }
            .detail-row:last-child { border-bottom: none; }
            .detail-label { color: #68645e; font-size: 14px; }
            .detail-value { color: #171717; font-size: 14px; font-weight: 500; }
            .footer { background: #f7f4ee; padding: 24px 40px; text-align: center; }
            .footer p { color: #68645e; font-size: 12px; margin: 4px 0; }
            .disclaimer { font-size: 11px; color: #999; margin-top: 16px; line-height: 1.5; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Appointment Confirmed</h1>
              <p>Raja Agrawal — Advocate &amp; Legal Consultant</p>
            </div>
            <div class="body">
              <p>Dear ${clientName},</p>
              <p>Your consultation appointment has been <strong>confirmed</strong>. Please save your reference number for tracking.</p>
              
              <div class="ref-box">
                <p class="label">Booking Reference</p>
                <p class="value">${referenceNumber}</p>
              </div>

              <div style="margin: 24px 0;">
                <div class="detail-row">
                  <span class="detail-label">Service</span>
                  <span class="detail-value">${serviceName}</span>
                </div>
                ${appointmentDate ? `
                <div class="detail-row">
                  <span class="detail-label">Appointment Date</span>
                  <span class="detail-value">${appointmentDate}</span>
                </div>` : ""}
                <div class="detail-row">
                  <span class="detail-label">Amount Paid</span>
                  <span class="detail-value">₹${amount}</span>
                </div>
              </div>

              <p>I will reach out to you to confirm the exact time. Kindly respond within 24 hours if you need to reschedule.</p>
              <p style="margin-top: 24px;">Warm regards,<br/><strong>Raja Agrawal</strong><br/>Advocate &amp; Legal Consultant</p>
            </div>
            <div class="footer">
              <p>Chamber No. 123, District Court Complex, New Delhi — 110001</p>
              <p>+91 86053 99330 | contact@rajaagrawal.in</p>
              <p class="disclaimer">Submitting this form and completing payment does not create an attorney-client relationship. Full engagement begins upon written retainer agreement.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });
  } catch (error) {
    console.error("Failed to send booking confirmation email:", error);
  }
}

// ─── Send new booking alert to LAWYER ───────────────────────────────────────
export async function sendLawyerAlertEmail(params: {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  referenceNumber: string;
  serviceName: string;
  message?: string;
  amount: number;
}): Promise<void> {
  const { clientName, clientEmail, clientPhone, referenceNumber, serviceName, message, amount } = params;

  try {
    await resend.emails.send({
      from: `"Booking System" <${env.EMAIL_FROM_ADDRESS}>`,
      to: TESTING_EMAIL,
      subject: `🔔 New Appointment — ${referenceNumber} (${serviceName})`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #172B54;">New Appointment Booked</h2>
          <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
            <tr><td style="padding: 8px; background: #f7f4ee; font-weight: bold;">Reference</td><td style="padding: 8px;">${referenceNumber}</td></tr>
            <tr><td style="padding: 8px; background: #f7f4ee; font-weight: bold;">Client Name</td><td style="padding: 8px;">${clientName}</td></tr>
            <tr><td style="padding: 8px; background: #f7f4ee; font-weight: bold;">Email</td><td style="padding: 8px;">${clientEmail}</td></tr>
            <tr><td style="padding: 8px; background: #f7f4ee; font-weight: bold;">Phone</td><td style="padding: 8px;">${clientPhone}</td></tr>
            <tr><td style="padding: 8px; background: #f7f4ee; font-weight: bold;">Service</td><td style="padding: 8px;">${serviceName}</td></tr>
            <tr><td style="padding: 8px; background: #f7f4ee; font-weight: bold;">Amount</td><td style="padding: 8px;">₹${amount}</td></tr>
            ${message ? `<tr><td style="padding: 8px; background: #f7f4ee; font-weight: bold; vertical-align: top;">Message</td><td style="padding: 8px;">${message}</td></tr>` : ""}
          </table>
          <p style="color: #666; font-size: 13px;">Login to the admin panel to view full details and manage the appointment.</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send lawyer alert email:", error);
  }
}

// ─── Send custom reply from Admin to CLIENT ────────────────────────────────
export async function sendCustomReplyEmail(params: {
  clientName: string;
  clientEmail: string;
  referenceNumber: string;
  subject: string;
  message: string;
}): Promise<void> {
  const { clientName, clientEmail, referenceNumber, subject, message } = params;

  // Format message to respect line breaks
  const formattedMessage = message.replace(/\n/g, "<br/>");

  try {
    await resend.emails.send({
      from: `"${env.EMAIL_FROM_NAME}" <${env.EMAIL_FROM_ADDRESS}>`,
      to: TESTING_EMAIL, // overriding clientEmail for testing
      subject: `${subject} (Ref: ${referenceNumber})`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8" />
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; background: #f7f4ee; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 40px auto; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.08); }
            .header { background: #172B54; padding: 24px 40px; }
            .header h1 { color: #C9A84C; margin: 0; font-size: 20px; font-weight: 600; }
            .body { padding: 32px 40px; font-size: 15px; color: #333; line-height: 1.6; }
            .footer { background: #f7f4ee; padding: 24px 40px; text-align: center; }
            .footer p { color: #68645e; font-size: 12px; margin: 4px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Raja Agrawal — Legal Consultancy</h1>
            </div>
            <div class="body">
              <p>Dear ${clientName},</p>
              <div style="margin: 24px 0;">
                ${formattedMessage}
              </div>
              <p style="margin-top: 32px;">Warm regards,<br/><strong>Raja Agrawal</strong><br/>Advocate &amp; Legal Consultant</p>
            </div>
            <div class="footer">
              <p>Reference Number: ${referenceNumber}</p>
              <p>+91 86053 99330 | contact@rajaagrawal.in</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });
  } catch (error) {
    console.error("Failed to send custom reply email:", error);
  }
}

// ─── Send contact form alert to LAWYER ──────────────────────────────────────
export async function sendContactAlertEmail(params: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}): Promise<void> {
  const { name, email, phone, subject, message } = params;

  try {
    await resend.emails.send({
      from: `"Contact Form" <${env.EMAIL_FROM_ADDRESS}>`,
      to: TESTING_EMAIL,
      subject: `📩 New Contact Message — ${subject || "No Subject"}`,
      html: `<p><b>From:</b> ${name} (${email})</p><p><b>Phone:</b> ${phone || "N/A"}</p><p><b>Message:</b><br/>${message}</p>`,
    });
  } catch (error) {
    console.error("Failed to send contact form alert email:", error);
  }
}

// ─── Send OTP for Appointment Tracking ──────────────────────────────────────
export async function sendOTPEmail(params: {
  email: string;
  otp: string;
}): Promise<void> {
  const { email, otp } = params;

  try {
    await resend.emails.send({
      from: `"${env.EMAIL_FROM_NAME}" <${env.EMAIL_FROM_ADDRESS}>`,
      to: TESTING_EMAIL, // override for testing; replace with `email` once domain is verified
      subject: `Your Appointment Tracking OTP — ${otp}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8" />
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; background: #f7f4ee; margin: 0; padding: 0; }
            .container { max-width: 560px; margin: 40px auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 16px rgba(0,0,0,0.08); }
            .header { background: #172B54; padding: 28px 40px; }
            .header h1 { color: #C9A84C; margin: 0; font-size: 20px; font-weight: 600; letter-spacing: -0.3px; }
            .header p { color: rgba(255,255,255,0.65); margin: 6px 0 0; font-size: 13px; }
            .body { padding: 36px 40px; }
            .body p { color: #333; font-size: 15px; line-height: 1.6; margin: 0 0 16px; }
            .otp-box { background: #f7f4ee; border: 2px dashed #C9A84C; border-radius: 10px; padding: 24px; text-align: center; margin: 28px 0; }
            .otp-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: #888; margin: 0 0 10px; }
            .otp-code { font-size: 42px; font-weight: 800; color: #172B54; letter-spacing: 12px; font-family: 'Courier New', monospace; margin: 0; }
            .expiry { background: #fff8ed; border: 1px solid #ffe4a0; border-radius: 6px; padding: 10px 16px; font-size: 13px; color: #92600a; text-align: center; margin-bottom: 24px; }
            .footer { background: #f7f4ee; padding: 20px 40px; text-align: center; border-top: 1px solid #e8e3db; }
            .footer p { color: #888; font-size: 11px; margin: 3px 0; }
            .warning { color: #c0392b; font-size: 13px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Appointment Tracking</h1>
              <p>Raja Agrawal — Advocate &amp; Legal Consultant</p>
            </div>
            <div class="body">
              <p>You requested to track your appointment. Use the one-time password below to view your appointment status.</p>

              <div class="otp-box">
                <p class="otp-label">Your One-Time Password</p>
                <p class="otp-code">${otp}</p>
              </div>

              <div class="expiry">
                ⏱ This OTP is valid for <strong>10 minutes</strong> only.
              </div>

              <p class="warning">If you did not request this, please ignore this email. Do not share this OTP with anyone.</p>
            </div>
            <div class="footer">
              <p>Chamber No. 123, District Court Complex, New Delhi — 110001</p>
              <p>+91 86053 99330 | contact@rajaagrawal.in</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });
  } catch (error) {
    console.error("Failed to send OTP email:", error);
    throw error; // Re-throw so controller can catch and return error to user
  }
}
