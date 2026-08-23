"use client";

import ScrollReveal from "@/components/ui/ScrollReveal";

const reasons = [
  {
    icon: (
      <svg className="w-6 h-6 text-[#FFD700]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: "100% Confidential & Secure",
    description: "Complete attorney-client privilege. Your personal data, legal discussions, and documents remain strictly confidential.",
  },
  {
    icon: (
      <svg className="w-6 h-6 text-[#FFD700]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    title: "Direct Advocate Access",
    description: "No intermediaries or junior associates. Every session is conducted directly by Advocate Raja Agrawal.",
  },
  {
    icon: (
      <svg className="w-6 h-6 text-[#FFD700]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Transparent Flat Fee (₹1,000)",
    description: "Clear, upfront pricing with zero hidden charges or extra consultation fees. Complete peace of mind.",
  },
  {
    icon: (
      <svg className="w-6 h-6 text-[#FFD700]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
    title: "Flexible Remote Consultation",
    description: "Connect via phone or secure video call from anywhere in India or overseas without travel hassle.",
  },
  {
    icon: (
      <svg className="w-6 h-6 text-[#FFD700]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: "Thorough Document Scrutiny",
    description: "Pre-session review of contracts, court notices, property deeds, or agreements for targeted legal advice.",
  },
  {
    icon: (
      <svg className="w-6 h-6 text-[#FFD700]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    title: "Actionable Legal Roadmap",
    description: "Receive practical, step-by-step guidance outlining your legal standing, risk assessment, and next steps.",
  },
];

export default function WhyChooseUsSection() {
  return (
    <section className="section relative overflow-hidden bg-bg-secondary/40 border-y border-border-subtle/50">
      <div className="container relative z-10">
        <ScrollReveal animation="fade-up" className="text-center mb-14">
          <p className="text-eyebrow text-accent-gold mb-3">Our Key Advantages</p>
          <h2 className="text-h2 text-text-primary">
            Why Choose Our <span className="italic text-accent-gold">Online Legal Consultation</span>?
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
          staggerSelector=".why-card"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {reasons.map((item) => (
            <div
              key={item.title}
              className="why-card p-7 bg-bg-primary border border-border-subtle/70 rounded-2xl hover:border-accent-gold/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FFD700]/20 to-[#C9A84C]/5 border border-[#FFD700]/40 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:border-[#FFD700] transition-all duration-300 shadow-[0_4px_15px_rgba(255,215,0,0.15)]">
                {item.icon}
              </div>
              <h3 className="font-serif text-lg font-semibold text-text-primary mb-2.5 group-hover:text-accent-gold transition-colors">
                {item.title}
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </ScrollReveal>
      </div>
    </section>
  );
}
