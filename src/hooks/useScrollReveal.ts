"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Hook that uses GSAP ScrollTrigger to animate elements on scroll.
 * Replaces the old IntersectionObserver-based approach.
 * Still adds 'is-visible' class for any CSS-based fallback animations.
 */
export function useScrollReveal<T extends HTMLElement>(
  options?: IntersectionObserverInit
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("is-visible");
      return;
    }

    gsap.set(el, { opacity: 0, y: 40 });

    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: `top ${options?.rootMargin ? "80%" : "88%"}`,
        once: true,
      },
      onComplete: () => {
        el.classList.add("is-visible");
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === el) t.kill();
      });
    };
  }, [options]);

  return ref;
}
