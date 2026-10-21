import type { Metadata } from "next";
import { inter, cormorant } from "./fonts";

import "./globals.css";
import { DEFAULT_DESCRIPTION, SITE_URL } from "@/lib/seo";
import AdminPushForeground from "@/components/admin/AdminPushForeground";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Nyaysaathi — Advocates & Legal Consultants",
    template: "%s | Nyaysaathi",
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: "Nyaysaathi",
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Nyaysaathi",
    title: "Nyaysaathi — Advocates & Legal Consultants",
    description: DEFAULT_DESCRIPTION,
  },
  // Next.js emits correctly sized icon links from app/icon.png, favicon.ico,
  // and apple-icon.png. Avoid competing metadata pointing at older icon files.
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-IN"
      className={`${inter.variable} ${cormorant.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-bg-primary text-text-primary">
        {children}
        <AdminPushForeground />
      </body>
    </html>
  );
}
