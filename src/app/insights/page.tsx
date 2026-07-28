import type { Metadata } from "next";
import Link from "next/link";
import { blogPosts, blogCategories } from "@/data/blogPosts";

export const metadata: Metadata = {
  title: "Legal Insights",
  description:
    "Legal insights and thought leadership from Raja Agrawal. Articles on corporate law, litigation, real estate, intellectual property, and regulatory compliance.",
};

function getReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export default function InsightsPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-40 pb-20 lg:pt-48 lg:pb-32 bg-bg-secondary relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=2000&auto=format&fit=crop"
            alt="Insights background"
            className="w-full h-full object-cover opacity-10 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-secondary via-transparent to-transparent" />
        </div>
        <div className="container relative z-10 text-center lg:text-left">
          <p className="text-eyebrow text-accent-gold mb-4">Insights</p>
          <h1 className="text-hero max-w-3xl mx-auto lg:mx-0">
            Legal
            <br className="hidden sm:block" />
            <span className="italic"> Insights</span>
          </h1>
          <p className="text-body text-text-secondary mt-6 max-w-xl mx-auto lg:mx-0">
            Thought leadership and practical guidance on the legal issues that
            matter most to businesses and individuals.
          </p>
        </div>
      </section>

      {/* Category Filters */}
      <section className="py-8 border-b border-border-subtle">
        <div className="container">
          <div className="flex flex-wrap gap-3">
            {blogCategories.map((cat) => (
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

      {/* Articles Grid */}
      <section className="section">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {blogPosts.map((post) => (
              <Link
                key={post.id}
                href={`/insights/${post.slug}`}
                className="group"
              >
                <div className="relative aspect-[3/2] bg-bg-secondary overflow-hidden mb-5">
                  <div className="absolute inset-0 bg-gradient-to-t from-bg-dark/10 to-transparent" />
                  <div className="absolute inset-0 group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[11px] uppercase tracking-[0.12em] text-accent-gold font-medium">
                    {post.category}
                  </span>
                  <span className="text-[11px] text-text-secondary/50">·</span>
                  <span className="text-[11px] text-text-secondary/50">
                    {getReadingTime(post.content)} min read
                  </span>
                </div>
                <h2 className="font-serif text-xl mb-2 group-hover:text-accent-wine transition-colors line-clamp-2">
                  {post.title}
                </h2>
                <p className="text-sm text-text-secondary line-clamp-2">
                  {post.excerpt}
                </p>
                <span className="text-caption text-text-secondary/50 mt-3 block">
                  {new Date(post.publishedAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
