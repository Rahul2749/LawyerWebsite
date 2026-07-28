"use client";

import ScrollReveal from "@/components/ui/ScrollReveal";

const reasons = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    title: "Personalized Approach",
    description:
      "Every case receives my direct, personal attention. No associates, no hand-offs — you work directly with me from start to finish.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
    title: "Proven Track Record",
    description:
      "Over 500+ successful cases across multiple practice areas, with a 98% client satisfaction rate built on results.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    title: "Confidential & Discreet",
    description:
      "Your privacy is paramount. Every consultation and case detail is handled with the highest level of confidentiality.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
        <path d="M2 12h20" />
      </svg>
    ),
    title: "Pan-India Practice",
    description:
      "Appearing before Supreme Court, High Courts, and District Courts across India with a comprehensive understanding of diverse legal landscapes.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="section bg-bg-secondary" aria-label="Why Choose Us">
      <div className="container">
        <ScrollReveal animation="fade-up" className="text-center mb-12 lg:mb-16">
          <p className="text-eyebrow text-accent-gold mb-4">
            Why Choose Me
          </p>
          <h2 className="text-h2">
            Dedicated to Your <span className="italic">Success</span>
          </h2>
        </ScrollReveal>

        <ScrollReveal
          animation="fade-up"
          stagger={0.12}
          staggerSelector=".reason-card"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {reasons.map((reason) => (
              <div
                key={reason.title}
                className="reason-card group bg-bg-primary p-6 lg:p-8 rounded-2xl border border-border-subtle hover:border-accent-gold/40 hover:shadow-xl transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-full bg-accent-wine/10 text-accent-wine flex items-center justify-center mb-6 group-hover:bg-accent-wine group-hover:text-white transition-colors duration-300">
                  {reason.icon}
                </div>
                <h3 className="font-serif text-xl font-medium mb-3 text-text-primary">
                  {reason.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
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
