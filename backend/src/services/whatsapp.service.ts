// src/services/whatsapp.service.ts
// Sends WhatsApp messages to the LAWYER internally when a new appointment is booked.
// 
// HOW IT WORKS:
// We use the WhatsApp Web click-to-chat URL format:
//   https://wa.me/{phone}?text={message}
//
// For AUTOMATED server-to-WhatsApp messages (no user interaction), two options:
//
// Option A (FREE — Simple): 
//   This file generates a WhatsApp link that gets included in the lawyer's 
//   alert email. The lawyer clicks the link to open a pre-filled WhatsApp chat with the client.
//
// Option B (PAID — Automated): 
//   Use Twilio WhatsApp API or WATI.io to auto-send messages.
//   Requires a verified WhatsApp Business Account.
//   Uncomment the Twilio section below and add TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN to .env
//
// Currently using Option A (link generation) as it's free and requires no extra setup.

import { env } from "../config/env";

// Generate a pre-filled WhatsApp click-to-chat URL
// The lawyer can click this in their email to instantly open a WhatsApp chat with the client
export function generateWhatsAppLink(params: {
  clientPhone: string;
  clientName: string;
  referenceNumber: string;
  serviceName: string;
}): string {
  const { clientPhone, clientName, referenceNumber, serviceName } = params;
  
  // Remove non-digits and ensure country code
  const phone = clientPhone.replace(/\D/g, "");
  
  const message = `Hi ${clientName}, this is Raja Agrawal (Advocate). Your appointment for ${serviceName} has been confirmed. Reference: ${referenceNumber}. Please let me know if you have any questions.`;
  
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

// Send internal WhatsApp notification to the LAWYER via Twilio (Option B)
// Uncomment and configure if you want fully automated WhatsApp messages.
//
// import twilio from "twilio";
// const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
//
// export async function sendLawyerWhatsAppAlert(params: {
//   clientName: string;
//   clientPhone: string;
//   referenceNumber: string;
//   serviceName: string;
// }): Promise<void> {
//   const { clientName, referenceNumber, serviceName } = params;
//   await client.messages.create({
//     from: "whatsapp:+14155238886", // Twilio sandbox number
//     to: `whatsapp:+${env.LAWYER_WHATSAPP_NUMBER}`,
//     body: `🔔 New Appointment Booked!\nRef: ${referenceNumber}\nClient: ${clientName}\nService: ${serviceName}\nCheck your email for full details.`,
//   });
// }

// Current implementation: generates WhatsApp links for the lawyer to use
export function buildLawyerWhatsAppData(params: {
  clientName: string;
  clientPhone: string;
  referenceNumber: string;
  serviceName: string;
}): { clientLink: string; lawyerNotificationText: string } {
  const clientLink = generateWhatsAppLink(params);
  
  const lawyerNotificationText = `🔔 New Appointment!\nRef: ${params.referenceNumber}\nClient: ${params.clientName}\nPhone: ${params.clientPhone}\nService: ${params.serviceName}`;

  return { clientLink, lawyerNotificationText };
}

// Escape message for wa.me URL (the lawyer's contact link for lawyer's own WhatsApp)
export function getLawyerWhatsAppLink(): string {
  return `https://wa.me/${env.LAWYER_WHATSAPP_NUMBER}`;
}
