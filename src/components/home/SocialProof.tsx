"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";

const recognitions = [
  "New York State Bar Association",
  "American Bar Association",
  "Super Lawyers",
  "Martindale-Hubbell",
  "Best Lawyers in America",
  "Chambers & Partners",
];

export default function SocialProof() {
  const sectionRef = useScrollReveal<HTMLElement>();

  return (
    <section
      ref={sectionRef}
      className="py-12 border-y border-border-subtle reveal-fade"
      aria-label="Recognition and awards"
    >
      <div className="container">
        <p className="text-eyebrow text-text-secondary/50 text-center mb-8">
          Recognized By
        </p>
        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6">
          {recognitions.map((name) => (
            <span
              key={name}
              className="text-sm text-text-secondary/40 font-medium tracking-wide uppercase hover:text-text-secondary/70 transition-colors cursor-default"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
