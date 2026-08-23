"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type AnimationType = "fade-up" | "fade-in" | "fade-left" | "fade-right" | "scale-in";

interface ScrollRevealProps {
  children: React.ReactNode;
  animation?: AnimationType;
  /** Delay in seconds */
  delay?: number;
  /** Duration in seconds */
  duration?: number;
  /** How far the element travels (px) */
  distance?: number;
  /** When the animation triggers, e.g. "top 85%" */
  triggerStart?: string;
  /** Stagger children instead of animating the wrapper */
  stagger?: number;
  /** CSS selector for stagger targets within the container */
  staggerSelector?: string;
  className?: string;
}

const animationDefaults: Record<AnimationType, gsap.TweenVars> = {
  "fade-up": { opacity: 0, y: 20 },
  "fade-in": { opacity: 0 },
  "fade-left": { opacity: 0, x: -20 },
  "fade-right": { opacity: 0, x: 20 },
  "scale-in": { opacity: 0, scale: 0.96 },
};

export default function ScrollReveal({
  children,
  animation = "fade-up",
  delay = 0,
  duration = 0.35,
  distance,
  triggerStart = "top 95%",
  stagger,
  staggerSelector,
  className,
}: ScrollRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Respect reduced motion
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const fromVars = { ...animationDefaults[animation] };

      // Override distance if provided
      if (distance !== undefined) {
        if (animation === "fade-up") fromVars.y = distance;
        if (animation === "fade-left") fromVars.x = -distance;
        if (animation === "fade-right") fromVars.x = distance;
      }

      const toVars: gsap.TweenVars = {
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
        duration,
        delay,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: triggerStart,
          once: true,
        },
      };

      if (stagger && staggerSelector && containerRef.current) {
        const targets = containerRef.current.querySelectorAll(staggerSelector);
        if (targets.length > 0) {
          gsap.set(targets, fromVars);
          gsap.to(targets, {
            ...toVars,
            stagger,
            scrollTrigger: {
              trigger: containerRef.current,
              start: triggerStart,
              once: true,
            },
          });
        }
      } else if (containerRef.current) {
        gsap.set(containerRef.current, fromVars);
        gsap.to(containerRef.current, toVars);
      }
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
