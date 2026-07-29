"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { siteSettings } from "@/data/siteSettings";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/#about", label: "About" },
  { href: "/practice-areas", label: "Expertise" },
  { href: "/insights", label: "Blogs & Articles" },
  { href: "/videos", label: "Videos" },
  { href: "/consultation", label: "Consultation" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-500 ${
          isScrolled
            ? "py-2 bg-bg-primary/95 backdrop-blur-md border-b border-border-subtle shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
            : "py-3 bg-transparent"
        }`}
        role="banner"
      >
        <div className="container flex flex-col">
          
          {/* Top Tier */}
          <div className="flex items-center justify-between w-full lg:border-b lg:border-border-subtle/50 lg:pb-3">
            {/* Logo */}
            <Link
              href="/"
              className="relative z-[60] group flex items-center gap-3"
              aria-label={`${siteSettings.firmName} - Home`}
            >
              <img
                src="/advocate_logo.png"
                alt="Logo"
                className="w-10 h-10 lg:w-12 lg:h-12 rounded-full object-cover"
              />
              <div className="flex flex-col">
                <span className="font-serif text-xl lg:text-2xl font-medium tracking-tight text-text-primary">
                  {siteSettings.firmName}
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-accent-gold font-sans font-medium">
                  {siteSettings.firmTagline}
                </span>
              </div>
            </Link>

            {/* Desktop Top Right: Contact & CTA */}
            <div className="hidden lg:flex items-center gap-6">
              <a
                href={`https://wa.me/${siteSettings.phone.replace(/\D/g, "")}`}
                className="flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-accent-wine transition-colors"
                aria-label="Call us"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                </svg>
                {siteSettings.phone}
              </a>
              <Link href="/consultation" className="btn btn-primary bg-accent-wine hover:bg-accent-wine-hover text-xs py-2 px-5">
                Book a Consultation
              </Link>
            </div>

            {/* Mobile: Phone + Hamburger */}
            <div className="flex items-center gap-4 lg:hidden">
              <a
                href={`https://wa.me/${siteSettings.phone.replace(/\D/g, "")}`}
                className="text-accent-wine text-sm font-medium hidden sm:flex items-center gap-1.5"
                aria-label="Call now"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                </svg>
                Call Now
              </a>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="relative z-[60] w-10 h-10 flex flex-col items-center justify-center gap-1.5"
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMobileMenuOpen}
              >
                <span className={`block w-6 h-px bg-text-primary transition-all duration-300 ${isMobileMenuOpen ? "rotate-45 translate-y-[3.5px]" : ""}`} />
                <span className={`block w-6 h-px bg-text-primary transition-all duration-300 ${isMobileMenuOpen ? "-rotate-45 -translate-y-[3.5px]" : ""}`} />
              </button>
            </div>
          </div>

          {/* Bottom Tier (Desktop only) */}
          <nav
            className="hidden lg:flex items-center justify-center gap-10 w-full pt-3 pb-1"
            aria-label="Main navigation"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative text-[13px] uppercase tracking-[0.08em] font-medium transition-colors duration-300 ${
                  (link.href === "/" ? pathname === "/" : (pathname === link.href || pathname.startsWith(link.href + "/")))
                    ? "text-accent-wine"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {link.label}
                {((link.href === "/" ? pathname === "/" : (pathname === link.href ||
                  pathname.startsWith(link.href + "/")))) && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-1 left-0 right-0 h-px bg-accent-wine"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </nav>

        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[55] bg-bg-primary flex flex-col justify-start items-end pt-32 px-10 pb-10 overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            <nav className="flex flex-col items-end gap-6 w-full" aria-label="Mobile navigation">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.4 }}
                className="mb-2 w-full text-right border-b border-border-subtle pb-6"
              >
                <Link href="/consultation" className="btn btn-primary w-full sm:w-auto text-sm">
                  Book a Consultation
                </Link>
              </motion.div>

              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ delay: i * 0.06, duration: 0.4 }}
                >
                  <Link
                    href={link.href}
                    className={`font-serif text-2xl font-light tracking-wide transition-colors text-right block w-full ${
                      pathname === link.href
                        ? "text-accent-wine"
                        : "text-text-primary hover:text-accent-wine"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              {/* Mobile phone number */}
              <motion.a
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                href={`https://wa.me/${siteSettings.phone.replace(/\D/g, "")}`}
                className="mt-6 text-text-secondary text-sm flex items-center justify-end gap-2 w-full"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                </svg>
                {siteSettings.phone}
              </motion.a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Sticky CTA */}
      {!isMobileMenuOpen && (
        <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden p-4 bg-bg-primary/95 backdrop-blur-md border-t border-border-subtle">
          <Link
            href="/consultation"
            className="btn btn-primary bg-accent-wine hover:bg-accent-wine-hover w-full text-center"
          >
            Book a Consultation
          </Link>
        </div>
      )}
    </>
  );
}
