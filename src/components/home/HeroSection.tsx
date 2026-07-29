"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section
      className="relative min-h-0 lg:min-h-[85vh] flex items-center overflow-hidden bg-bg-primary pt-32 pb-10 lg:pt-40 lg:pb-16"
      aria-label="Hero"
    >
      {/* Premium Background Effects */}
      <div className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: "radial-gradient(#5A1824 1px, transparent 1px)", backgroundSize: "32px 32px" }}></div>
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-bg-secondary/50 to-transparent z-0 pointer-events-none" />
      {/* Subtle gold accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-gold/20 to-transparent z-0" />

      <div className="container relative z-10">
        {/* Mobile Layout: Image first, then content stacked */}
        <div className="flex flex-col items-center gap-6 lg:gap-10">
        
          {/* Content */}
          <div className="w-full max-w-4xl text-center flex flex-col items-center">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex items-center justify-center gap-3 mb-5"
            >
              <span className="w-8 h-px bg-accent-wine hidden sm:block" />
              <p className="text-eyebrow text-accent-wine font-semibold tracking-widest uppercase">
                Raja Agrawal — Advocate
              </p>
              <span className="w-8 h-px bg-accent-wine hidden sm:block" />
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="text-hero text-text-primary mb-4 lg:mb-5 leading-[1.1]"
            >
              Fierce Advocacy & Strategic Solutions
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="text-body text-text-secondary max-w-2xl mx-auto mb-6 lg:mb-8 leading-relaxed"
            >
              As an independent advocate with 5+ years of dedicated experience, I provide personalized, high-caliber legal counsel. From navigating complex corporate disputes to securing victories in litigation, I fight fiercely to protect your interests and achieve the best possible outcomes.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                href="/#about"
                className="btn btn-primary bg-accent-wine hover:bg-accent-wine-hover w-full sm:w-auto"
              >
                Read My Story
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ml-2"
                  aria-hidden="true"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </motion.div>

            {/* Trust indicators — adds premium feel */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.2 }}
              className="hidden md:flex items-center justify-center gap-6 mt-12 pt-8 border-t border-border-subtle w-full max-w-2xl"
            >
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent-gold"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                <span className="text-xs text-text-secondary uppercase tracking-wider">150+ Cases Won</span>
              </div>
              <div className="w-px h-4 bg-border-subtle" />
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent-gold"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                <span className="text-xs text-text-secondary uppercase tracking-wider">98% Success Rate</span>
              </div>
              <div className="w-px h-4 bg-border-subtle" />
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent-gold"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                <span className="text-xs text-text-secondary uppercase tracking-wider">300+ Clients</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
