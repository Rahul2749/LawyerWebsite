"use client";

import { motion } from "framer-motion";

export default function FloatingChat() {
  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => alert("Chat functionality will be integrated here.")}
      className="fixed bottom-24 right-6 lg:bottom-8 lg:right-8 z-50 flex items-center gap-2 bg-[#5A1824] text-white px-4 py-3 sm:w-auto sm:px-5 sm:py-3.5 rounded-full shadow-lg shadow-[#5A1824]/30 hover:bg-[#4A141E] hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
      aria-label="Chat with us"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="flex-shrink-0"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
      <span className="hidden sm:inline-block font-medium text-sm">
        Chat with us
      </span>
    </motion.button>
  );
}
