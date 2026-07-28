"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section
      className="relative min-h-[90vh] flex items-center overflow-hidden bg-bg-primary pt-32 pb-20 lg:pt-40 lg:pb-32"
      aria-label="Hero"
    >
      <div className="container relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        
        {/* Left Column: Content */}
        <div className="w-full lg:w-1/2 text-center lg:text-left order-2 lg:order-1">
          {/* Eyebrow */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-eyebrow text-accent-wine font-semibold mb-6 flex items-center justify-center lg:justify-start gap-3"
          >
            <span className="text-xl">R</span>AJA <span className="text-xl">A</span>GRAWAL — ADVOCATE
          </motion.p>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-hero text-text-primary mb-6 lg:mb-8"
          >
            With You In Every <br className="hidden lg:block" /> Challenge
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-body text-text-secondary max-w-xl mx-auto lg:mx-0 mb-8 lg:mb-10 text-lg lg:pr-8"
          >
            I believe in empowering you through dedicated, personalized legal services tailored to your unique needs.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
          >
            <Link
              href="/consultation"
              className="btn btn-primary bg-accent-wine hover:bg-accent-wine-hover w-full sm:w-auto"
            >
              Book a Consultation
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
              href="/practice-areas"
              className="btn btn-secondary w-full sm:w-auto"
            >
              Explore Expertise
            </Link>
          </motion.div>
        </div>
        
        {/* Right Column: Visuals */}
        <div className="w-full lg:w-1/2 order-1 lg:order-2 relative h-[50vh] lg:h-[70vh]">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl"
          >
            <img
              src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=1200&auto=format&fit=crop"
              alt="Law Library"
              className="w-full h-full object-cover"
            />
            {/* Subtle overlay */}
            <div className="absolute inset-0 bg-accent-wine/5" />
          </motion.div>

          {/* Floating badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="absolute -bottom-6 -left-6 lg:bottom-12 lg:-left-12 bg-bg-secondary p-4 rounded-full shadow-xl border border-border-subtle flex flex-col items-center justify-center w-32 h-32 lg:w-40 lg:h-40 z-20"
          >
             <span className="text-3xl lg:text-4xl font-serif text-accent-wine mb-1">60+</span>
             <span className="text-xs uppercase tracking-widest text-text-secondary text-center leading-tight">Years of<br/>Excellence</span>
          </motion.div>

          {/* Decorative floating dots (representing icons) */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            className="absolute top-12 -right-4 lg:-right-8 w-16 h-16 bg-bg-primary rounded-full shadow-lg border border-border-subtle flex items-center justify-center z-20"
          >
            <div className="w-8 h-8 rounded-full bg-accent-gold/20" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 1.4 }}
            className="absolute top-1/2 -right-6 lg:-right-10 w-20 h-20 bg-bg-primary rounded-full shadow-lg border border-border-subtle flex items-center justify-center z-20"
          >
            <div className="w-10 h-10 rounded-full bg-accent-wine/20" />
          </motion.div>
        </div>

      </div>
    </section>
  );
}
