import type { Metadata } from "next";
import { inter, cormorant } from "./fonts";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Raja Agrawal — Advocate & Legal Consultant",
    template: "%s | Raja Agrawal",
  },
  description:
    "Trusted legal counsel for complex matters. Over two decades of dedicated practice delivering strategic solutions with unwavering integrity. Corporate Law, Litigation, Real Estate, IP, Family Law, and Regulatory Compliance.",
  keywords: [
    "advocate",
    "lawyer",
    "legal consultant",
    "corporate law",
    "litigation",
    "real estate law",
    "intellectual property",
    "family law",
    "regulatory compliance",
    "India advocate",
    "Raja Agrawal",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Raja Agrawal — Advocate & Legal Consultant",
    title: "Raja Agrawal — Advocate & Legal Consultant",
    description:
      "Trusted legal counsel for complex matters. Over two decades of dedicated practice.",
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
