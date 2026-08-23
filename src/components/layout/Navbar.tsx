"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { siteSettings } from "@/data/siteSettings";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/#about", label: "About" },
  { href: "#services-menu", label: "Legal Services", isDropdown: true },
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
                href={`tel:${siteSettings.phone.replace(/\s+/g, "")}`}
                className="flex items-center gap-2 text-xs font-medium text-text-secondary hover:text-accent-gold transition-colors"
              >
                <svg className="w-3.5 h-3.5 text-accent-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>{siteSettings.phone}</span>
              </a>

              <Link href="/consultation" className="btn btn-primary bg-accent-wine hover:bg-accent-wine-hover text-xs py-2 px-5">
                Book a Consultation
              </Link>
            </div>

            {/* Mobile: Hamburger */}
            <div className="flex items-center gap-4 lg:hidden">
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
            className="hidden lg:flex items-center justify-center gap-10 w-full pt-2 pb-2"
            aria-label="Main navigation"
          >
            {navLinks.map((link) => {
              if (link.isDropdown) {
                return (
                  <div key={link.label} className="group relative">
                    <button className="relative text-[11px] uppercase tracking-[0.08em] font-medium transition-colors duration-300 text-text-secondary hover:text-text-primary flex items-center gap-1 py-4">
                      {link.label}
                      <svg className="w-3 h-3 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    
                    {/* Mega Menu Dropdown */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-[900px] max-w-[95vw] bg-bg-primary shadow-2xl border border-border-subtle rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 overflow-hidden z-[100]">
                      <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-3">
                          {siteSettings.services.map((service) => (
                            <Link 
                              key={service.slug} 
                              href={`/consultation?service=${service.slug}`}
                              className="flex items-center gap-3 p-2 rounded-lg hover:bg-bg-secondary transition-colors group/item"
                            >
                              <div className="w-7 h-7 rounded-full bg-accent-wine/5 flex items-center justify-center flex-shrink-0 group-hover/item:bg-accent-wine/10">
                                <svg className="w-3.5 h-3.5 text-accent-wine" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                              </div>
                              <span className="text-sm font-medium text-text-primary group-hover/item:text-accent-wine transition-colors truncate">
                                {service.name}
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative text-[11px] uppercase tracking-[0.08em] font-medium transition-colors duration-300 py-4 ${
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
                      className="absolute bottom-3 left-0 right-0 h-px bg-accent-wine"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
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

              {navLinks.map((link, i) => {
                if (link.isDropdown) {
                  return (
                    <motion.div
                      key={link.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ delay: i * 0.06, duration: 0.4 }}
                      className="w-full flex flex-col items-end"
                    >
                      <span className="font-serif text-2xl font-light tracking-wide text-text-secondary mb-3 block">{link.label}</span>
                      <div className="flex flex-col items-end gap-3 pr-4 border-r border-border-subtle/50 w-full mb-2">
                        {siteSettings.services.map((service) => (
                          <Link 
                            key={service.slug}
                            href={`/consultation?service=${service.slug}`}
                            className="text-[15px] font-medium text-text-primary hover:text-accent-wine text-right"
                          >
                            {service.name}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  );
                }

                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ delay: i * 0.06, duration: 0.4 }}
                    className="w-full"
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
                );
              })}


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
