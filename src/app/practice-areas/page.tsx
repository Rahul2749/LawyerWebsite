import type { Metadata } from "next";
import Link from "next/link";
import { practiceAreas } from "@/data/practiceAreas";

export const metadata: Metadata = {
  title: "Practice Areas",
  description:
    "Explore our areas of legal expertise: Corporate Law, Litigation, Real Estate, Intellectual Property, Family Law, and Regulatory Compliance.",
};

export default function PracticeAreasPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-12 lg:pt-36 lg:pb-16 bg-bg-secondary relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1589391886645-d51941baf7fb?q=80&w=2000&auto=format&fit=crop"
            alt="Practice areas background"
            className="w-full h-full object-cover opacity-10 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-secondary via-transparent to-transparent" />
        </div>
        <div className="container relative z-10 text-center lg:text-left">
          <p className="text-eyebrow text-accent-gold mb-4">Expertise</p>
          <h1 className="text-hero max-w-3xl mx-auto lg:mx-0">
            Areas of
            <br className="hidden sm:block" />
            <span className="italic"> Practice</span>
          </h1>
          <p className="text-body text-text-secondary mt-6 max-w-xl mx-auto lg:mx-0">
            Comprehensive legal services across six core disciplines,
            each backed by decades of experience and a commitment to
            client-centered excellence.
          </p>
        </div>
      </section>

      {/* Practice Areas Grid */}
      <section className="section">
        <div className="container">
          <div className="space-y-0">
            {practiceAreas.map((area, index) => (
              <Link
                key={area.id}
                href={`/practice-areas/${area.slug}`}
                className="group flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-12 py-10 border-b border-border-subtle hover:border-accent-gold transition-colors"
              >
                <span className="text-accent-gold font-serif text-2xl font-light w-16 flex-shrink-0">
                  {area.number}
                </span>
                <div className="flex-1">
                  <h2 className="font-serif text-3xl lg:text-4xl group-hover:text-accent-wine transition-colors mb-2">
                    {area.title}
                  </h2>
                  <p className="text-body text-text-secondary max-w-xl">
                    {area.shortDescription}
                  </p>
                </div>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-text-secondary group-hover:text-accent-wine group-hover:translate-x-2 transition-all duration-300 flex-shrink-0"
                  aria-hidden="true"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
