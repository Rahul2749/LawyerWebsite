import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Track Your Appointment", "Check the status of your Nyaysaathi legal consultation appointment.", "/track-appointment", false);

export default function TrackingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
