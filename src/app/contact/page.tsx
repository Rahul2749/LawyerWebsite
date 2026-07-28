import type { Metadata } from "next";
import Link from "next/link";
import { siteSettings } from "@/data/siteSettings";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Raja Agrawal. Office located in New York City. Call, email, or visit us.",
};

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-40 pb-20 lg:pt-48 lg:pb-32 bg-bg-secondary relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=2000&auto=format&fit=crop"
            alt="Contact us background"
            className="w-full h-full object-cover opacity-10 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-secondary via-transparent to-transparent" />
        </div>
        <div className="container relative z-10 text-center lg:text-left">
          <p className="text-eyebrow text-accent-gold mb-4">Contact</p>
          <h1 className="text-hero max-w-3xl mx-auto lg:mx-0">
            Get in
            <br className="hidden sm:block" />
            <span className="italic"> Touch</span>
          </h1>
        </div>
      </section>

      {/* Contact Info + Map */}
      <section className="section">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Info */}
            <div>
              <h2 className="text-h3 mb-8">Contact Information</h2>

              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 border border-accent-gold/30 flex items-center justify-center flex-shrink-0 mt-1">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent-gold" aria-hidden="true">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-eyebrow text-accent-gold mb-1">Office Address</h3>
                    <p className="text-body text-text-primary">{siteSettings.address.full}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 border border-accent-gold/30 flex items-center justify-center flex-shrink-0 mt-1">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent-gold" aria-hidden="true">
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-eyebrow text-accent-gold mb-1">Phone</h3>
                    <a href={`tel:${siteSettings.phone.replace(/\s/g, "")}`} className="text-body text-text-primary hover:text-accent-wine transition-colors">
                      {siteSettings.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 border border-accent-gold/30 flex items-center justify-center flex-shrink-0 mt-1">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent-gold" aria-hidden="true">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-eyebrow text-accent-gold mb-1">Email</h3>
                    <a href={`mailto:${siteSettings.email}`} className="text-body text-text-primary hover:text-accent-wine transition-colors">
                      {siteSettings.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 border border-accent-gold/30 flex items-center justify-center flex-shrink-0 mt-1">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent-gold" aria-hidden="true">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-eyebrow text-accent-gold mb-1">Office Hours</h3>
                    <p className="text-body text-text-primary">{siteSettings.officeHours.weekday}</p>
                    <p className="text-body text-text-secondary">{siteSettings.officeHours.weekend}</p>
                  </div>
                </div>
              </div>

              <div className="mt-12">
                <Link href="/consultation" className="btn btn-primary">
                  Book a Consultation
                </Link>
              </div>
            </div>

            {/* Map Placeholder (lazy-loaded in production) */}
            <div className="relative aspect-square lg:aspect-auto bg-bg-secondary overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center text-text-secondary/20">
                <div className="text-center">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5" className="mx-auto mb-3" aria-hidden="true">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <p className="text-xs">Google Maps Embed</p>
                  <p className="text-[10px] mt-1">Lazy-loaded on scroll</p>
                </div>
              </div>
              <div className="absolute bottom-0 right-0 w-24 h-24 border-b border-r border-accent-gold/20" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
