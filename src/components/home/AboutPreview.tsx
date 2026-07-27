"use client";

import Link from "next/link";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function AboutPreview() {
  const sectionRef = useScrollReveal<HTMLElement>();

  return (
    <section
      ref={sectionRef}
      className="section reveal-up"
      aria-label="About the lawyer"
    >
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image placeholder */}
          <div className="relative aspect-[3/4] lg:aspect-[4/5] overflow-hidden bg-bg-secondary">
            <img
              src="https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=1000&auto=format&fit=crop"
              alt="Alexander Mitchell Portrait"
              className="w-full h-full object-cover grayscale opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg-dark/20 to-transparent" />
            {/* Gold accent corner */}
            <div className="absolute bottom-0 right-0 w-24 h-24 border-b border-r border-accent-gold/50" />
          </div>

          {/* Content */}
          <div>
            <p className="text-eyebrow text-accent-gold mb-4">
              About the Lawyer
            </p>
            <h2 className="text-h2 mb-6">
              A Legacy of
              <br />
              <span className="italic">Trusted Counsel</span>
            </h2>
            <span className="gold-line" />
            <p className="text-body text-text-secondary mt-6 mb-6 leading-relaxed">
              With over two decades of experience navigating the most
              complex legal landscapes, Alexander Mitchell has built a
              reputation for strategic insight, meticulous preparation,
              and unwavering dedication to client interests. His practice
              spans corporate transactions, high-stakes litigation, and
              regulatory compliance — always guided by a commitment to
              integrity and excellence.
            </p>
            <p className="text-body text-text-secondary mb-8 leading-relaxed">
              Recognized by peers and clients alike for his ability to
              distill complexity into clarity, Alexander approaches every
              matter with the rigor it demands and the personal attention
              it deserves.
            </p>
            <Link href="/about" className="btn btn-ghost">
              Read My Story
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="ml-2"
                aria-hidden="true"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
