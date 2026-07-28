import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CookieConsent from "@/components/CookieConsent";
import SmoothScrollProvider from "@/providers/SmoothScrollProvider";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SmoothScrollProvider>
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
    </SmoothScrollProvider>
  );
}
