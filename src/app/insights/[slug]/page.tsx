import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts } from "@/data/blogPosts";

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return { title: "Article Not Found" };

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      publishedTime: post.publishedAt,
      authors: [post.author.name],
    },
  };
}

function getReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

/** Extract H2 headings from markdown content for TOC */
function extractHeadings(content: string): { id: string; text: string }[] {
  const regex = /^## (.+)$/gm;
  const headings: { id: string; text: string }[] = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    const text = match[1].trim();
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    headings.push({ id, text });
  }
  return headings;
}

/** Simple markdown-to-HTML converter for blog content */
function renderContent(content: string): string {
  let html = content
    // H3
    .replace(/^### (.+)$/gm, '<h3 class="font-serif text-xl mt-8 mb-3 font-medium">$1</h3>')
    // H2 with id for TOC
    .replace(/^## (.+)$/gm, (_, text) => {
      const id = text
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      return `<h2 id="${id}" class="font-serif text-2xl mt-10 mb-4 font-medium scroll-mt-32">${text.trim()}</h2>`;
    })
    // Bold
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    // Blockquote
    .replace(
      /^> (.+)$/gm,
      '<blockquote class="border-l-2 border-accent-gold pl-6 my-6 text-text-secondary italic">$1</blockquote>'
    )
    // Unordered list items
    .replace(/^- (.+)$/gm, '<li class="mb-1">$1</li>')
    // Paragraphs (lines that aren't already wrapped)
    .replace(
      /^(?!<[a-z])((?!^$).+)$/gm,
      '<p class="mb-5 leading-relaxed">$1</p>'
    );

  // Wrap consecutive <li> in <ul>
  html = html.replace(
    /(<li.*?<\/li>\n?)+/g,
    '<ul class="list-disc pl-6 mb-5 space-y-1">$&</ul>'
  );

  return html;
}

export default async function InsightDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  const readingTime = getReadingTime(post.content);
  const headings = extractHeadings(post.content);
  const relatedPosts = blogPosts
    .filter((p) => p.category === post.category && p.id !== post.id)
    .slice(0, 3);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    author: {
      "@type": "Person",
      name: post.author.name,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* Breadcrumb */}
      <section className="pt-32 lg:pt-40">
        <div className="container">
          <nav aria-label="Breadcrumb" className="text-caption text-text-secondary">
            <Link href="/" className="hover:text-accent-wine transition-colors">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/insights" className="hover:text-accent-wine transition-colors">
              Insights
            </Link>
            <span className="mx-2">/</span>
            <span className="text-text-primary line-clamp-1">{post.title}</span>
          </nav>
        </div>
      </section>

      {/* Article Header */}
      <section className="pt-8 pb-12">
        <div className="container max-w-3xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-eyebrow text-accent-gold">
              {post.category}
            </span>
            <span className="text-text-secondary/40">·</span>
            <span className="text-caption text-text-secondary">
              {readingTime} min read
            </span>
          </div>
          <h1 className="text-h2 mb-6">{post.title}</h1>
          <span className="gold-line" />

          {/* Author & Date */}
          <div className="flex items-center gap-4 mt-6">
            <div className="w-10 h-10 rounded-full bg-bg-secondary flex items-center justify-center">
              <span className="text-xs font-medium text-text-secondary">
                {post.author.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium">{post.author.name}</p>
              <p className="text-caption text-text-secondary">
                {post.author.credential} ·{" "}
                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Article Body */}
      <section className="pb-20">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-16 max-w-5xl mx-auto">
            {/* Content */}
            <article
              className="prose"
              dangerouslySetInnerHTML={{
                __html: renderContent(post.content),
              }}
            />

            {/* Sidebar: TOC */}
            {headings.length > 0 && (
              <aside className="hidden lg:block">
                <div className="sticky top-32">
                  <h4 className="text-eyebrow text-accent-gold mb-4">
                    In This Article
                  </h4>
                  <ul className="space-y-2 border-l border-border-subtle pl-4">
                    {headings.map((h) => (
                      <li key={h.id}>
                        <a
                          href={`#${h.id}`}
                          className="text-sm text-text-secondary hover:text-accent-wine transition-colors"
                        >
                          {h.text}
                        </a>
                      </li>
                    ))}
                  </ul>

                  {/* Mid-article CTA */}
                  <div className="mt-12 p-6 bg-bg-secondary border border-border-subtle">
                    <p className="text-sm font-medium mb-2">
                      Need legal guidance?
                    </p>
                    <p className="text-caption text-text-secondary mb-4">
                      Discuss your matter in a confidential consultation.
                    </p>
                    <Link
                      href="/consultation"
                      className="btn btn-primary w-full text-xs py-2"
                    >
                      Schedule a Call
                    </Link>
                  </div>
                </div>
              </aside>
            )}
          </div>
        </div>
      </section>

      {/* Tags */}
      <section className="py-8 border-t border-border-subtle">
        <div className="container max-w-3xl">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-3 py-1 border border-border-subtle text-text-secondary"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Related Articles */}
      {relatedPosts.length > 0 && (
        <section className="section bg-bg-secondary">
          <div className="container">
            <h2 className="text-h3 mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((p) => (
                <Link
                  key={p.id}
                  href={`/insights/${p.slug}`}
                  className="group"
                >
                  <div className="aspect-[3/2] bg-bg-primary mb-4" />
                  <span className="text-[11px] uppercase tracking-[0.12em] text-accent-gold">
                    {p.category}
                  </span>
                  <h3 className="font-serif text-lg mt-1 group-hover:text-accent-wine transition-colors line-clamp-2">
                    {p.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
