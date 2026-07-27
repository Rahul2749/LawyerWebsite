"use client";

import { useEffect, useRef } from "react";

/**
 * Hook to trigger a callback when an element enters the viewport.
 * Adds 'is-visible' class for CSS-based reveal animations.
 */
export function useScrollReveal<T extends HTMLElement>(
  options?: IntersectionObserverInit
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          observer.unobserve(el);
        }
      },
      { threshold: 0.15, ...options }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [options]);

  return ref;
}
