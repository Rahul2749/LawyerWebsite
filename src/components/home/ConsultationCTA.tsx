"use client";

import Link from "next/link";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function ConsultationCTA() {
  const sectionRef = useScrollReveal<HTMLElement>();

  return (
    <section
      ref={sectionRef}
      className="section reveal-up"
      aria-label="Book a consultation"
    >
      <div className="container">
        <div className="bg-bg-dark text-text-inverse px-8 py-16 lg:px-20 lg:py-24 relative overflow-hidden">
          {/* Decorative accents */}
          <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-accent-gold/20 via-transparent to-accent-gold/20" />
          <div className="absolute top-0 left-0 w-40 h-px bg-gradient-to-r from-accent-gold/30 to-transparent" />
          <div className="absolute bottom-0 right-0 w-40 h-px bg-gradient-to-l from-accent-gold/30 to-transparent" />

          <div className="relative z-10 max-w-2xl mx-auto text-center">
            <p className="text-eyebrow text-accent-gold mb-6">
              Take the First Step
            </p>
            <h2 className="text-h2 text-text-inverse mb-6">
              Your Legal Matter
              <br />
              <span className="italic">Deserves Attention</span>
            </h2>
            <span className="gold-line mx-auto" />
            <p className="text-body text-text-inverse/60 mt-6 mb-10 leading-relaxed">
              Every complex legal challenge begins with a conversation.
              Schedule a confidential consultation to discuss your matter
              and explore how we can help protect your interests.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/consultation"
                className="btn btn-primary bg-accent-wine hover:bg-accent-wine-hover"
              >
                Schedule a Consultation
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
              <Link
                href="/contact"
                className="btn border border-accent-gold/40 text-text-inverse hover:border-accent-gold hover:bg-accent-gold/5"
              >
                Contact Us
              </Link>
            </div>
            <p className="text-[11px] text-text-inverse/30 mt-8">
              We respond within one business day. Submitting a form does
              not create an attorney-client relationship.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
