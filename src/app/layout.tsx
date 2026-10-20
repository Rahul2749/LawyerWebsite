import type { Metadata } from "next";
import { inter, cormorant } from "./fonts";

import "./globals.css";
import { DEFAULT_DESCRIPTION, SITE_URL } from "@/lib/seo";

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
    siteName: "Nyaysaathi — Advocates & Legal Consultants",
    title: "Nyaysaathi — Advocates & Legal Consultants",
    description: DEFAULT_DESCRIPTION,
  },
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    apple: "/apple-icon.png",
    shortcut: "/icon.png",
  },
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
      </body>
    </html>
  );
}
