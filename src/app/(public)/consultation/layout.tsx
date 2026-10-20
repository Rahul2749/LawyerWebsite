import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Book an Online Lawyer Consultation in India",
  "Book a Nyaysaathi video or in-person legal consultation. Choose your legal service, review the consultation fee and request an appointment.",
  "/consultation",
);

export default function ConsultationLayout({ children }: { children: React.ReactNode }) {
  return children;
}
