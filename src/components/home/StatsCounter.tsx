"use client";

import { useEffect, useRef, useState } from "react";
import ScrollReveal from "@/components/ui/ScrollReveal";

const stats = [
  { value: 150, suffix: "+", label: "Cases Won" },
  { value: 5, suffix: "+", label: "Years Experience" },
  { value: 98, suffix: "%", label: "Success Rate" },
  { value: 300, suffix: "+", label: "Clients Served" },
];

function AnimatedNumber({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 2000;
          const steps = 60;
          const increment = value / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
              setCount(value);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

export default function StatsCounter() {
  return (
    <section className="py-12 lg:py-16 bg-bg-dark" aria-label="Statistics">
      <div className="container">
        <ScrollReveal
          animation="fade-up"
          stagger={0.1}
          staggerSelector=".stat-item"
        >
          <div className="grid grid-cols-4 gap-2 lg:gap-12">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="stat-item text-center"
              >
                <p className="text-xl sm:text-3xl lg:text-5xl font-serif text-accent-gold mb-1 lg:mb-2">
                  <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-[9px] sm:text-[10px] lg:text-sm uppercase tracking-widest text-text-inverse/60 leading-tight">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
