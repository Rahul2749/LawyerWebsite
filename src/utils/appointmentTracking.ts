import { siteSettings } from "@/data/siteSettings";

type TrackingResponse<T> = {
  success: boolean;
  data?: T;
  error?: string | { message?: string };
};

export async function requestAppointmentTracking<T>(
  action: "send-otp" | "verify-otp",
  body: { email: string; otp?: string },
): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${siteSettings.BACKEND_URL}/api/track/${action}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, email: body.email.trim().toLowerCase() }),
      signal: AbortSignal.timeout(15000),
    });
  } catch {
    throw new Error("Unable to connect to appointment tracking. Please try again shortly.");
  }

  let result: TrackingResponse<T>;
  try {
    result = await response.json();
  } catch {
    throw new Error("Appointment tracking is temporarily unavailable. Please try again later.");
  }

  if (!response.ok || !result?.success || result.data === undefined) {
    const message = typeof result?.error === "string" ? result.error : result?.error?.message;
    throw new Error(message || "Unable to track your appointment. Please try again.");
  }

  return result.data;
}
