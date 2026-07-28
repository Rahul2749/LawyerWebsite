"use client";

import Link from "next/link";
import { blogPosts } from "@/data/blogPosts";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function InsightsPreview() {
  const sectionRef = useScrollReveal<HTMLElement>();
  const featured = blogPosts.filter((p) => p.featured).slice(0, 1);
  const rest = blogPosts.filter((p) => !p.featured).slice(0, 2);

  return (
    <section
      ref={sectionRef}
      className="section reveal-up"
      aria-label="Legal insights preview"
    >
      <div className="container">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-12">
          <div>
            <p className="text-eyebrow text-accent-gold mb-4">
              Blogs & Articles
            </p>
            <h2 className="text-h2">
              Thought
              <br />
              <span className="italic">Leadership</span>
            </h2>
          </div>
          <Link href="/insights" className="btn btn-ghost mt-6 lg:mt-0">
            View All Blogs & Articles
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Featured article — larger */}
          {featured.map((post) => (
            <Link
              key={post.id}
              href={`/insights/${post.slug}`}
              className="group"
            >
              <div className="relative aspect-[4/3] bg-bg-secondary overflow-hidden mb-6">
                <img src="https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=1000&auto=format&fit=crop" alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-dark/30 to-transparent z-10 pointer-events-none" />
              </div>
              <span className="text-eyebrow text-accent-gold">
                {post.category}
              </span>
              <h3 className="text-h3 mt-2 mb-3 group-hover:text-accent-wine transition-colors">
                {post.title}
              </h3>
              <p className="text-body text-text-secondary line-clamp-3">
                {post.excerpt}
              </p>
              <span className="text-caption text-text-secondary/60 mt-3 block">
                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </Link>
          ))}

          {/* Remaining articles — stacked */}
          <div className="space-y-8">
            {rest.map((post) => (
              <Link
                key={post.id}
                href={`/insights/${post.slug}`}
                className="group flex gap-6 items-start"
              >
                <div className="flex-shrink-0 w-28 h-20 bg-bg-secondary relative overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=400&auto=format&fit=crop" alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] uppercase tracking-[0.12em] text-accent-gold font-medium">
                    {post.category}
                  </span>
                  <h3 className="font-serif text-lg mt-1 mb-1 group-hover:text-accent-wine transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <span className="text-caption text-text-secondary/60">
                    {new Date(post.publishedAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
