"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Hook that uses GSAP ScrollTrigger to animate elements on scroll.
 * Uses snappy 0.35s duration and clears inline props on complete to prevent stuck offsets.
 */
export function useScrollReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("is-visible");
      gsap.set(el, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(el, { opacity: 0, y: 20 });

      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.35,
        ease: "power2.out",
        clearProps: "transform,opacity",
        scrollTrigger: {
          trigger: el,
          start: "top 95%",
          once: true,
        },
        onComplete: () => {
          el.classList.add("is-visible");
        },
      });
    }, el);

    return () => {
      ctx.revert();
    };
  }, []);

  return ref;
}
