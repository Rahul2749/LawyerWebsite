"use client";

import ScrollReveal from "@/components/ui/ScrollReveal";

const reasons = [
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    title: "100% Confidential & Secure",
    description:
      "Your legal discussions, personal data, and documents remain strictly confidential.",
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    title: "Dedicated Senior Legal Counsel",
    description:
      "Consult experienced advocates for legal guidance tailored to your matter.",
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    title: "Transparent Flat Fee (₹1,000)",
    description:
      "₹1,000 upfront, with no hidden charges or surprise hourly billing.",
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
    title: "Convenient Remote Access",
    description:
      "Consult by phone or secure video call from India or overseas, without travel.",
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    title: "Thorough Document Scrutiny",
    description:
      "Contracts, notices, deeds, and agreements reviewed before strategic advice.",
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
    title: "Actionable Legal Roadmap",
    description:
      "Understand your legal position, risks, and practical next steps.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="section bg-bg-secondary" aria-label="Why Choose Our Online Legal Consultation Services">
      <div className="container">
        <ScrollReveal animation="fade-up" className="text-center mb-8 lg:mb-10">
          <p className="text-eyebrow text-accent-gold mb-3">
            Online Consultation Benefits
          </p>
          <h2 className="text-h2">
            Why Choose Our <span className="italic text-accent-gold">Online Legal Consultation Services?</span>
          </h2>
          <p className="text-body text-text-secondary mt-4 mx-auto max-w-2xl">
            Combining institutional legal rigor with personal client care, remote accessibility, and complete fee transparency across India.
          </p>
          <div className="flex items-center justify-center gap-3 mt-6" aria-hidden="true">
            <div className="h-px w-16 bg-accent-gold/30" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#FFD700] shadow-[0_0_8px_rgba(255,215,0,0.6)]" />
            <div className="h-px w-16 bg-accent-gold/30" />
          </div>
        </ScrollReveal>

        <ScrollReveal
          animation="fade-up"
          stagger={0.1}
          staggerSelector=".reason-card"
        >
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 lg:gap-5">
            {reasons.map((reason) => (
              <div
                key={reason.title}
                className="reason-card group min-w-0 rounded-xl border border-border-subtle bg-bg-primary p-3 transition-all duration-300 hover:border-accent-gold/50 hover:shadow-md sm:p-4 lg:p-5"
              >
                <div aria-hidden="true" className="mb-2.5 flex size-8 items-center justify-center rounded-lg border border-[#FFD700]/40 bg-gradient-to-br from-[#FFD700]/20 to-[#C9A84C]/5 text-[#FFD700] transition-colors duration-300 group-hover:border-[#FFD700] sm:mb-3 sm:size-9 [&>svg]:size-4 sm:[&>svg]:size-5">
                  {reason.icon}
                </div>
                <h3 className="mb-1.5 font-serif text-sm font-semibold leading-snug text-text-primary transition-colors group-hover:text-accent-gold sm:text-base">
                  {reason.title}
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {reason.description}
                </p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
