"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ScrollReveal from "@/components/ui/ScrollReveal";

const testimonials = [
  {
    quote: "Adv. Raja Agrawal's meticulous preparation and strategic thinking delivered outstanding results for our corporate dispute.",
    attribution: "A Satisfied Client"
  },
  {
    quote: "His dedication to my case went far beyond expectations. A true advocate who fights for his clients with integrity.",
    attribution: "Corporate Client"
  },
  {
    quote: "Exceptional legal expertise combined with a genuinely personal approach. I felt heard and supported throughout the entire process.",
    attribution: "Private Client"
  }
];

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  return (
    <section className="section bg-bg-primary relative overflow-hidden" aria-label="Testimonials">
      {/* Background Decorative Rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border-[0.5px] border-accent-gold/20 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] rounded-full border-[0.5px] border-accent-gold/10 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1600px] h-[1600px] rounded-full border-[0.5px] border-accent-gold/5 pointer-events-none" />

      <div className="container relative z-10 text-center">
        <ScrollReveal animation="fade-up">
          <h2
            className="font-serif text-5xl lg:text-6xl text-text-primary mb-4"
          >
            Testimonials
          </h2>
          <p
            className="text-lg text-text-secondary mb-16 font-light"
          >
            What our clients have to say about us
          </p>
        </ScrollReveal>

        <div className="relative max-w-4xl mx-auto flex items-center justify-center">
          {/* Prev Button */}
          <button
            onClick={prevTestimonial}
            className="absolute left-0 lg:-left-16 w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-[#B39352] hover:bg-[#9B7D42] text-white hidden lg:flex items-center justify-center transition-colors z-20 shadow-md"
            aria-label="Previous Testimonial"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {/* Testimonial Card */}
          <div className="w-full px-6 lg:px-0">
            <div className="bg-[#786D5F] rounded-3xl p-6 lg:p-16 relative shadow-2xl overflow-hidden border border-accent-gold/30">
              {/* Outer Glow */}
              <div className="absolute inset-0 ring-2 ring-accent-gold/20 rounded-3xl pointer-events-none" />
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                  className="relative z-10 flex flex-col items-center justify-center text-center"
                >
                  <h3 className="text-xl lg:text-3xl font-sans font-bold text-white mb-6 lg:mb-8 tracking-wide">
                    {testimonials[currentIndex].attribution}
                  </h3>
                  
                  <div className="relative w-full flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-6 lg:gap-8 px-2 sm:px-6">
                    <span className="text-white/40 sm:text-white/60 font-serif text-2xl sm:text-6xl lg:text-8xl italic leading-none shrink-0" style={{ transform: 'translateY(4px)' }}>//</span>
                    
                    <p className="text-sm sm:text-base lg:text-2xl text-white/90 font-light max-w-2xl leading-relaxed text-center">
                      {testimonials[currentIndex].quote}
                    </p>
                    
                    <span className="text-white/40 sm:text-white/60 font-serif text-2xl sm:text-6xl lg:text-8xl italic leading-none shrink-0" style={{ transform: 'translateY(4px)' }}>//</span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Next Button */}
          <button
            onClick={nextTestimonial}
            className="absolute right-0 lg:-right-16 w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-[#B39352] hover:bg-[#9B7D42] text-white hidden lg:flex items-center justify-center transition-colors z-20 shadow-md"
            aria-label="Next Testimonial"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-3 mt-12">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-3 h-3 rounded-full transition-colors ${
                idx === currentIndex ? "bg-[#B39352]" : "bg-[#B39352]/30 hover:bg-[#B39352]/50"
              }`}
              aria-label={`Go to testimonial ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
