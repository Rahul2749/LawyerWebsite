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
      "Complete attorney-client privilege. Your personal data, legal discussions, and case documents remain strictly confidential.",
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    title: "Direct Advocate Access",
    description:
      "No intermediaries or junior associates. Every session is conducted directly by Advocate Raja Agrawal.",
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
      "Clear, upfront flat pricing with zero hidden charges or surprise hourly billing. Complete peace of mind.",
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
    title: "Convenient Remote Access",
    description:
      "Connect via phone or secure video call from anywhere in India or overseas without travel hassles.",
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
      "Prior legal examination of contracts, court notices, deeds, or agreements before providing strategic counsel.",
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
      "Receive practical, step-by-step guidance outlining your legal standing, risk assessment, and clear next steps.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="section bg-bg-secondary" aria-label="Why Choose Our Online Legal Consultation Services">
      <div className="container">
        <ScrollReveal animation="fade-up" className="text-center mb-12 lg:mb-16">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {reasons.map((reason) => (
              <div
                key={reason.title}
                className="reason-card group bg-bg-primary p-7 rounded-2xl border border-border-subtle hover:border-accent-gold/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FFD700]/20 to-[#C9A84C]/5 border border-[#FFD700]/40 text-[#FFD700] flex items-center justify-center mb-5 group-hover:scale-110 group-hover:border-[#FFD700] transition-all duration-300 shadow-[0_4px_15px_rgba(255,215,0,0.15)]">
                  {reason.icon}
                </div>
                <h3 className="font-serif text-lg font-semibold mb-2.5 text-text-primary group-hover:text-accent-gold transition-colors">
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
