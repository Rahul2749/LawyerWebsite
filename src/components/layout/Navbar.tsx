"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { siteSettings } from "@/data/siteSettings";
import MobileNavigationDrawer from "./MobileNavigationDrawer";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/#about", label: "About" },
  { href: "#services-menu", label: "Legal Services", isDropdown: true },
  // Hidden per request (code kept for future restoration)
  // { href: "/insights", label: "Blogs & Articles" },
  // { href: "/videos", label: "Videos" },
  { href: "/consultation", label: "Consultation" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const [mobileMenuPath, setMobileMenuPath] = useState<string | null>(null);
  const isMobileMenuOpen = mobileMenuPath === pathname;
  const closeMobileMenu = useCallback(() => setMobileMenuPath(null), []);

  if (mobileMenuPath !== null && mobileMenuPath !== pathname) {
    setMobileMenuPath(null);
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[60] h-20 bg-white border-b border-border-subtle transition-all duration-500 lg:h-auto ${
          isScrolled
            ? "lg:py-2 lg:bg-bg-primary/95 backdrop-blur-md shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
            : "lg:py-3 lg:bg-transparent lg:border-transparent"
        }`}
        role="banner"
      >
        <div className="container flex h-full flex-col justify-center max-lg:[--container-padding:1rem] sm:max-lg:[--container-padding:1.5rem]">

          {/* Top Tier */}
          <div className="flex items-center gap-3 w-full lg:justify-between lg:border-b lg:border-border-subtle/50 lg:pb-3">
            <button
              type="button"
              onClick={() => setMobileMenuPath(pathname)}
              className="flex size-11 shrink-0 items-center justify-center rounded-lg text-accent-wine hover:bg-bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-wine lg:hidden"
              aria-label="Open menu"
              aria-expanded={isMobileMenuOpen}
              aria-controls="public-navigation-drawer"
              aria-haspopup="dialog"
            >
              <svg aria-hidden="true" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
            </button>
            {/* Logo */}
            <Link
              href="/"
              className="relative z-[60] group flex min-w-0 items-center gap-2.5 lg:gap-3"
              aria-label={`${siteSettings.firmName} - Home`}
            >
              <Image
                src="/nyaysaathi_logo.png"
                alt="Nyaysaathi Logo"
                width={48}
                height={48}
                priority
                className="w-10 h-10 shrink-0 lg:w-12 lg:h-12 rounded-full object-cover ring-1 ring-accent-gold/40 shadow-sm"
              />
              <div className="flex min-w-0 flex-col">
                <span className="font-serif text-2xl font-medium tracking-tight text-text-primary">
                  {siteSettings.firmName}
                </span>
                <span className="text-[9px] lg:text-[10px] uppercase tracking-[0.1em] lg:tracking-[0.2em] text-accent-wine lg:text-accent-gold font-sans font-medium">
                  {siteSettings.firmTagline}
                </span>
              </div>
            </Link>

            {/* Desktop Top Right: Contact & CTA */}
            <div className="hidden lg:flex items-center gap-6">
              <a
                href={`mailto:${siteSettings.email}`}
                className="flex items-center gap-2 text-xs font-medium text-text-secondary hover:text-accent-gold transition-colors"
                title="Email Chamber"
              >
                <svg className="w-3.5 h-3.5 text-accent-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>{siteSettings.email}</span>
              </a>

              <Link href="/track-appointment" className="text-xs font-medium text-text-secondary hover:text-accent-gold transition-colors">
                Track Booking
              </Link>

              <Link href="/consultation" className="btn btn-primary bg-accent-wine hover:bg-accent-wine-hover text-xs py-2 px-5">
                Book a Consultation
              </Link>
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
                              href={`/legal-services/${service.slug}`}
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

      {isMobileMenuOpen && (
        <MobileNavigationDrawer id="public-navigation-drawer" label="Main navigation" onClose={closeMobileMenu}>
          <nav aria-label="Mobile navigation" className="flex-1 px-5 py-6 sm:px-7">
            {navLinks.map((link) => {
              const active = link.href === "/"
                ? pathname === "/"
                : pathname === link.href || pathname.startsWith(link.href + "/");
              const linkClass = "flex min-h-14 items-center py-3 text-base font-semibold transition-colors hover:text-accent-wine focus-visible:outline-2 focus-visible:outline-accent-wine";

              if (link.isDropdown) {
                return (
                  <details key={link.label} className="group">
                    <summary className={linkClass + " cursor-pointer list-none justify-between gap-2 text-text-primary [&::-webkit-details-marker]:hidden"}>
                      {link.label}
                      <svg aria-hidden="true" className="size-4 shrink-0 transition-transform group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6" /></svg>
                    </summary>
                    <div className="mb-3 space-y-1 border-l border-border-subtle pl-4">
                      {siteSettings.services.map((service) => (
                        <Link key={service.slug} href={`/legal-services/${service.slug}`} onClick={closeMobileMenu} className="flex min-h-11 items-center py-2 text-sm leading-relaxed text-text-secondary hover:text-accent-wine">
                          {service.name}
                        </Link>
                      ))}
                    </div>
                  </details>
                );
              }

              return (
                <Link key={link.href} href={link.href} onClick={closeMobileMenu} aria-current={active ? "page" : undefined} className={linkClass + (active ? " text-accent-wine" : " text-text-primary")}>
                  {link.label}
                </Link>
              );
            })}
            <Link href="/track-appointment" onClick={closeMobileMenu} className="flex min-h-14 items-center py-3 text-base font-semibold text-text-primary hover:text-accent-wine">
              Track Booking
            </Link>
          </nav>
          <div className="shrink-0 border-t border-border-subtle px-5 py-5 sm:px-7">
            <Link href="/consultation" onClick={closeMobileMenu} className="btn btn-primary w-full text-center text-sm">
              Book a Consultation
            </Link>
          </div>
        </MobileNavigationDrawer>
      )}

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
