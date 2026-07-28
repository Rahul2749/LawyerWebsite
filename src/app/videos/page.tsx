import type { Metadata } from "next";
import Link from "next/link";
import { videos, videoCategories } from "@/data/videos";

export const metadata: Metadata = {
  title: "Legal Talks",
  description:
    "Watch legal commentary, client education videos, and industry analysis from Raja Agrawal.",
};

export default function VideosPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-12 lg:pt-36 lg:pb-16 bg-bg-secondary relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1517520287167-4bbf64a00d66?q=80&w=2000&auto=format&fit=crop"
            alt="Videos background"
            className="w-full h-full object-cover opacity-10 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-secondary via-transparent to-transparent" />
        </div>
        <div className="container relative z-10 text-center lg:text-left">
          <p className="text-eyebrow text-accent-gold mb-4">Legal Talks</p>
          <h1 className="text-hero max-w-3xl mx-auto lg:mx-0">
            Video
            <br className="hidden sm:block" />
            <span className="italic"> Commentary</span>
          </h1>
          <p className="text-body text-text-secondary mt-6 max-w-xl mx-auto lg:mx-0">
            In-depth legal analysis, client education, and expert commentary on
            the issues shaping today&apos;s legal landscape.
          </p>
        </div>
      </section>

      {/* Category Filters */}
      <section className="py-8 border-b border-border-subtle">
        <div className="container">
          <div className="flex flex-wrap gap-3">
            {videoCategories.map((cat) => (
              <span
                key={cat}
                className={`text-xs uppercase tracking-[0.1em] font-medium px-4 py-2 cursor-pointer transition-colors border ${
                  cat === "All"
                    ? "bg-accent-wine text-text-inverse border-accent-wine"
                    : "border-border-subtle text-text-secondary hover:border-accent-gold hover:text-text-primary"
                }`}
              >
                {cat}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Videos Grid */}
      <section className="section">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {videos.map((video) => (
              <Link
                key={video.id}
                href={`/videos/${video.slug}`}
                className="group"
              >
                <div className="relative aspect-video bg-bg-dark overflow-hidden mb-4">
                  <div className="absolute inset-0 bg-gradient-to-t from-bg-dark/60 to-transparent z-10" />
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    <div className="w-16 h-16 rounded-full border border-text-inverse/40 flex items-center justify-center group-hover:scale-110 group-hover:border-accent-gold transition-all duration-300">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="text-text-inverse ml-1"
                        aria-hidden="true"
                      >
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    </div>
                  </div>
                  <span className="absolute bottom-3 right-3 z-20 bg-bg-dark/80 text-text-inverse text-xs px-2 py-1 font-mono">
                    {video.duration}
                  </span>
                </div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-[11px] uppercase tracking-[0.12em] text-accent-gold font-medium">
                    {video.category}
                  </span>
                  <span className="text-[11px] text-text-secondary/50">·</span>
                  <span className="text-[11px] text-text-secondary/50">
                    {new Date(video.publishedAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <h2 className="font-serif text-xl group-hover:text-accent-wine transition-colors">
                  {video.title}
                </h2>
                <p className="text-sm text-text-secondary mt-2 line-clamp-2">
                  {video.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
