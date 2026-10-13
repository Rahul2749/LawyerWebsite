export default function FloatingChat() {
  return (
    <button
      type="button"
      disabled
      className="fixed bottom-24 right-6 lg:bottom-8 lg:right-8 z-50 flex items-center gap-2 bg-[#74666A] text-white px-4 py-3 sm:w-auto sm:px-5 sm:py-3.5 rounded-full shadow-sm cursor-not-allowed"
      aria-label="Chat currently unavailable"
      title="Chat currently unavailable"
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
        aria-hidden="true"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
      <span className="hidden sm:inline-block font-medium text-sm">
        Chat unavailable
      </span>
    </button>
  );
}
