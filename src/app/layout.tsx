import type { Metadata } from "next";
import { inter, cormorant } from "./fonts";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CookieConsent from "@/components/CookieConsent";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Alexander Mitchell — Attorney at Law",
    template: "%s | Alexander Mitchell",
  },
  description:
    "Trusted counsel for complex legal matters. Over two decades of dedicated practice delivering strategic solutions with unwavering integrity. Corporate Law, Litigation, Real Estate, IP, Family Law, and Regulatory Compliance.",
  keywords: [
    "attorney",
    "lawyer",
    "legal counsel",
    "corporate law",
    "litigation",
    "real estate law",
    "intellectual property",
    "family law",
    "regulatory compliance",
    "New York attorney",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Alexander Mitchell — Attorney at Law",
    title: "Alexander Mitchell — Attorney at Law",
    description:
      "Trusted counsel for complex legal matters. Over two decades of dedicated practice.",
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
        {/* Skip to content — Accessibility */}
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>

        <Navbar />

        <main id="main-content" className="flex-1" role="main">
          {children}
        </main>

        <Footer />

        <CookieConsent />
      </body>
    </html>
  );
}
