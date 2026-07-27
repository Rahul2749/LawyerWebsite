"use client";

import Link from "next/link";
import { videos } from "@/data/videos";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function VideosPreview() {
  const sectionRef = useScrollReveal<HTMLElement>();

  return (
    <section
      ref={sectionRef}
      className="section bg-bg-secondary reveal-up"
      aria-label="Legal talks preview"
    >
      <div className="container">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-12">
          <div>
            <p className="text-eyebrow text-accent-gold mb-4">
              Legal Talks
            </p>
            <h2 className="text-h2">
              Video
              <br />
              <span className="italic">Commentary</span>
            </h2>
          </div>
          <Link href="/videos" className="btn btn-ghost mt-6 lg:mt-0">
            View All Videos
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {videos.map((video) => (
            <Link
              key={video.id}
              href={`/videos/${video.slug}`}
              className="group"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video bg-bg-dark overflow-hidden mb-4">
                <img src="https://images.unsplash.com/photo-1517520287167-4bbf64a00d66?q=80&w=600&auto=format&fit=crop" alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-dark/60 to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <div className="w-12 h-12 rounded-full border border-text-inverse/40 flex items-center justify-center group-hover:scale-110 group-hover:border-accent-gold transition-all duration-300">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="text-text-inverse ml-0.5"
                      aria-hidden="true"
                    >
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </div>
                </div>
                {/* Duration badge */}
                <span className="absolute bottom-2 right-2 z-20 bg-bg-dark/80 text-text-inverse text-[11px] px-2 py-0.5 font-mono">
                  {video.duration}
                </span>
              </div>

              {/* Info */}
              <span className="text-[11px] uppercase tracking-[0.12em] text-accent-gold font-medium">
                {video.category}
              </span>
              <h3 className="font-serif text-lg mt-1 group-hover:text-accent-wine transition-colors line-clamp-2">
                {video.title}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
