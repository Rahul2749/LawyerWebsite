import Link from "next/link";
import { siteSettings } from "@/data/siteSettings";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Contact Nyaysaathi for Legal Consultation", "Contact Nyaysaathi for online lawyer consultations across India. Email the legal consultation team, discuss availability or book an appointment.", "/contact");

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-12 lg:pt-36 lg:pb-16 bg-bg-secondary relative overflow-hidden">
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
      <section className="pb-20 lg:pb-32 pt-8 lg:pt-12">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Info */}
            <div>
              <h2 className="text-h3 mb-8">Contact Information</h2>

              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 border border-accent-gold/30 flex items-center justify-center flex-shrink-0 mt-1">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent-gold" aria-hidden="true">
                      <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-eyebrow text-accent-gold mb-1">Consultation Desk</h3>
                    <Link href="/consultation" className="text-body text-accent-wine hover:underline transition-colors font-medium">
                      Book a Video / In-Person Consultation →
                    </Link>
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
                    <h3 className="text-eyebrow text-accent-gold mb-1">Consultation Desk Hours</h3>
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

            <aside className="bg-bg-secondary p-8 lg:p-12 flex flex-col justify-center">
              <h2 className="text-h3 mb-5">Consultation across India</h2>
              <p className="text-text-secondary leading-relaxed mb-5">Nyaysaathi operates as a legal consultancy without a walk-in office. Start with a video consultation. Any in-person meeting or court representation is arranged separately after the team confirms availability.</p>
              <p className="text-text-secondary leading-relaxed mb-6">Tell us the type of legal issue and any urgent date when you contact us. The team will confirm suitable assistance and appointment availability.</p>
              <Link href="/legal-help" className="text-accent-wine underline mb-4">How to arrange legal help</Link>
              <Link href="/lawyer-fees" className="text-accent-wine underline">Understand consultation fees</Link>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
