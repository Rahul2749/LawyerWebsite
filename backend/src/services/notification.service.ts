import { getAdminMessaging } from "../config/firebase";
import { prisma } from "../config/database";

export type BookingNotificationStatus = "PENDING_PAYMENT" | "CONFIRMED";

export async function sendAdminBookingNotification(appointmentId: string, status: BookingNotificationStatus): Promise<void> {
  try {
    const messaging = getAdminMessaging();
    if (!messaging) return;
    const devices = await prisma.adminPushDevice.findMany({
      where: { user: { role: { in: ["ADMIN", "SUPER_ADMIN"] } } },
      select: { token: true },
    });
    // Use direct device sends; public Firebase topics must not grant access to admin alerts.
    for (let offset = 0; offset < devices.length; offset += 500) {
      const tokens = devices.slice(offset, offset + 500).map((device) => device.token);
      const result = await messaging.sendEachForMulticast({
        tokens,
        // Keep client names, contact details, and legal matters off lock screens.
        data: {
          title: status === "CONFIRMED" ? "Appointment confirmed" : "Checkout closed — payment pending",
          body: status === "CONFIRMED"
            ? "Payment has been received. Open the admin panel to view the appointment."
            : "A checkout was closed without completing payment. Open the admin panel to follow up.",
          url: "/admin-lawyersite/appointments",
          tag: `booking-${appointmentId}`,
          status,
        },
        webpush: { headers: { TTL: "300", Urgency: "high" } },
      });
      const invalidTokens: string[] = [];
      for (let index = 0; index < result.responses.length; index++) {
        const error = result.responses[index].error;
        if (!error) continue;
        if (["messaging/registration-token-not-registered", "messaging/invalid-registration-token"].includes(error.code)) {
          invalidTokens.push(tokens[index]);
        } else {
          console.error("Admin push delivery failed:", error.code);
        }
      }
      if (invalidTokens.length) {
        await prisma.adminPushDevice.deleteMany({ where: { token: { in: invalidTokens } } });
      }
    }
  } catch {
    // A provider outage must not break appointment creation or successful payment confirmation.
    console.error("Could not deliver admin booking notifications. Check Firebase configuration and connectivity.");
  }
}
