"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const COOKIE_CONSENT_KEY = "cookie-consent";

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      // Small delay so it doesn't flash on load
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "declined");
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
          className="fixed bottom-0 left-0 right-0 z-[100] p-4 lg:p-6"
          role="dialog"
          aria-label="Cookie consent"
        >
          <div className="container max-w-4xl">
            <div className="bg-bg-dark text-text-inverse p-6 lg:p-8 border border-text-inverse/10 flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-8 shadow-2xl">
              <div className="flex-1">
                <p className="text-sm leading-relaxed">
                  We use essential cookies for site functionality and, with your
                  consent, analytics cookies to improve your experience. We
                  respect your privacy — we use privacy-focused analytics only.
                  See our{" "}
                  <Link
                    href="/cookie-policy"
                    className="text-accent-gold hover:text-accent-gold-hover underline underline-offset-2"
                  >
                    Cookie Policy
                  </Link>{" "}
                  for details.
                </p>
              </div>
              <div className="flex gap-3 flex-shrink-0">
                <button
                  onClick={handleDecline}
                  className="text-xs uppercase tracking-[0.1em] font-medium px-5 py-2.5 border border-text-inverse/20 text-text-inverse/70 hover:border-text-inverse/40 hover:text-text-inverse transition-colors"
                >
                  Decline
                </button>
                <button
                  onClick={handleAccept}
                  className="text-xs uppercase tracking-[0.1em] font-medium px-5 py-2.5 bg-accent-wine text-text-inverse hover:bg-accent-wine-hover transition-colors"
                >
                  Accept
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
