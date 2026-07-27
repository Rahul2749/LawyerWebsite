"use client";

import AnimatedCounter from "@/components/ui/AnimatedCounter";
import { siteSettings } from "@/data/siteSettings";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function TrustSection() {
  const sectionRef = useScrollReveal<HTMLElement>();

  return (
    <section
      ref={sectionRef}
      className="section bg-bg-secondary reveal-up"
      aria-label="Trust & credentials"
    >
      <div className="container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {siteSettings.trustStats.map((stat) => (
            <div
              key={stat.label}
              className="text-center lg:text-left"
            >
              <div className="font-serif text-5xl lg:text-6xl font-light text-text-primary mb-2">
                <AnimatedCounter
                  target={stat.value}
                  suffix={stat.suffix}
                />
              </div>
              <div className="gold-line mx-auto lg:mx-0" />
              <p className="text-caption text-text-secondary mt-2">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Disclaimer for stats */}
        <p className="text-[10px] text-text-secondary/50 text-center mt-12">
          Statistics are approximate and reflect cumulative practice
          experience. Individual case results vary.
        </p>
      </div>
    </section>
  );
}
