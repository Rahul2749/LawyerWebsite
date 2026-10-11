import type { Metadata } from "next";
import { inter, cormorant } from "./fonts";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Nyaysaathi — Advocates & Legal Consultants",
    template: "%s | Nyaysaathi",
  },
  description:
    "Nyaysaathi is a premier multi-disciplinary law firm. Experienced team of advocates and legal counsel providing strategic solutions with unwavering integrity in Corporate Law, Litigation, Real Estate, IP, Criminal Defence, and Family Law.",
  keywords: [
    "Nyaysaathi",
    "Nyaysaathi legal",
    "advocates firm",
    "law firm India",
    "legal consultant",
    "Raja Agrawal",
    "corporate law",
    "litigation advocates",
    "real estate law",
    "criminal defence",
    "intellectual property",
    "family law",
    "Delhi High Court advocate",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Nyaysaathi — Advocates & Legal Consultants",
    title: "Nyaysaathi — Advocates & Legal Consultants",
    description:
      "Premier multi-disciplinary legal practice. Experienced panel of advocates delivering strategic legal solutions across Indian courts.",
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
      lang="en"
      className={`${inter.variable} ${cormorant.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-bg-primary text-text-primary">
        {children}
      </body>
    </html>
  );
}
