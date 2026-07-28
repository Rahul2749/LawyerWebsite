"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { practiceAreas } from "@/data/practiceAreas";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function PracticeAreasSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useScrollReveal<HTMLElement>();

  return (
    <section
      ref={sectionRef}
      className="section bg-bg-secondary reveal-up overflow-hidden"
      aria-label="Practice areas"
    >
      <div className="container relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        
        {/* Left Column: Image with floating icons */}
        <div className="w-full lg:w-1/2 relative h-[320px] sm:h-[400px] lg:h-[700px] flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-[85%] h-[85%] lg:w-[75%] lg:h-[75%] rounded-[100px] lg:rounded-[150px] overflow-hidden shadow-2xl relative"
          >
            <img
              src="/lawyer_logo.png"
              alt="Lawyer Logo"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-accent-wine/5" />
          </motion.div>

          {/* Floating Icon 1 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="absolute top-[10%] left-[5%] lg:left-[10%] w-14 h-14 lg:w-24 lg:h-24 bg-white rounded-full shadow-xl flex items-center justify-center border border-border-subtle z-20"
          >
            <div className="w-8 h-8 lg:w-12 lg:h-12 bg-accent-wine/10 rounded-full flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-wine lg:w-6 lg:h-6">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
          </motion.div>

          {/* Floating Icon 2 */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="absolute top-[40%] -right-2 lg:-right-4 w-16 h-16 lg:w-32 lg:h-32 bg-white rounded-full shadow-2xl flex items-center justify-center border border-border-subtle z-20"
          >
            <div className="w-10 h-10 lg:w-16 lg:h-16 bg-accent-gold/10 rounded-full flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent-gold lg:w-8 lg:h-8">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                <path d="M2 12h20" />
              </svg>
            </div>
          </motion.div>

          {/* Floating Icon 3 */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="absolute bottom-[10%] left-[10%] lg:left-[20%] w-12 h-12 lg:w-20 lg:h-20 bg-white rounded-full shadow-xl flex items-center justify-center border border-border-subtle z-20"
          >
            <div className="w-6 h-6 lg:w-10 lg:h-10 bg-[#786D5F]/10 rounded-full flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#786D5F] lg:w-5 lg:h-5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
          </motion.div>
        </div>

        {/* Right Column: List */}
        <div className="w-full lg:w-1/2 flex flex-col lg:pl-8">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-h2 text-text-primary mb-4">
              Our Practice Areas
            </h2>
            <p className="text-body text-text-secondary max-w-lg mx-auto lg:mx-0">
              Our experienced team offers expert legal solutions across fields.
            </p>
          </div>

          <div className="flex flex-col gap-2 lg:gap-3">
            {practiceAreas.map((area, index) => (
              <motion.div
                key={area.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Link
                  href={`/practice-areas/${area.slug}`}
                  className="group flex items-center gap-4 py-3 lg:py-4 px-4 hover:bg-bg-primary rounded-xl transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-full bg-bg-primary group-hover:bg-accent-wine border border-border-subtle group-hover:border-accent-wine flex items-center justify-center text-accent-wine group-hover:text-white transition-colors duration-300 shadow-sm shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </div>
                  <span className="font-serif text-lg lg:text-xl text-text-primary group-hover:text-accent-wine transition-colors duration-300 font-medium">
                    {area.title}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
