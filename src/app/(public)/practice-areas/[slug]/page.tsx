import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { practiceAreas } from "@/data/practiceAreas";
import { blogPosts } from "@/data/blogPosts";
import { videos } from "@/data/videos";

export async function generateStaticParams() {
  return practiceAreas.map((area) => ({ slug: area.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const area = practiceAreas.find((a) => a.slug === slug);
  if (!area) return { title: "Practice Area Not Found" };

  return {
    title: area.title,
    description: area.shortDescription,
  };
}

export default async function PracticeAreaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const area = practiceAreas.find((a) => a.slug === slug);
  if (!area) notFound();

  const relatedInsights = blogPosts
    .filter((p) => p.practiceAreaSlug === slug)
    .slice(0, 3);
  const relatedVideos = videos
    .filter((v) => v.practiceAreaSlug === slug)
    .slice(0, 2);
  const otherAreas = practiceAreas.filter((a) => a.slug !== slug);

  // FAQPage schema markup
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: area.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  // BreadcrumbList schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Practice Areas",
        item: "/practice-areas",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: area.title,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      {/* Breadcrumb */}
      <section className="pt-32 lg:pt-36">
        <div className="container">
          <nav aria-label="Breadcrumb" className="text-caption text-text-secondary">
            <Link href="/" className="hover:text-accent-wine transition-colors">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link
              href="/practice-areas"
              className="hover:text-accent-wine transition-colors"
            >
              Practice Areas
            </Link>
            <span className="mx-2">/</span>
            <span className="text-text-primary">{area.title}</span>
          </nav>
        </div>
      </section>

      {/* Hero */}
      <section className="pt-8 pb-16 lg:pb-24">
        <div className="container">
          <p className="text-eyebrow text-accent-gold mb-4">{area.number}</p>
          <h1 className="text-hero max-w-3xl">{area.title}</h1>
          <span className="gold-line mt-6" />
        </div>
      </section>

      {/* Overview */}
      <section className="section pt-0">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2">
              <div className="prose">
                <p className="text-lg leading-relaxed">{area.fullDescription}</p>
              </div>

              {/* Approach */}
              <div className="mt-16">
                <h2 className="text-h3 mb-4">Our Approach</h2>
                <span className="gold-line" />
                <p className="text-body text-text-secondary mt-4 leading-relaxed">
                  {area.approach}
                </p>
              </div>
            </div>

            {/* Sidebar: Services */}
            <div>
              <div className="bg-bg-secondary p-8 sticky top-32">
                <h3 className="text-eyebrow text-accent-gold mb-6">
                  Services
                </h3>
                <ul className="space-y-3">
                  {area.services.map((service, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-sm text-text-primary"
                    >
                      <div className="w-1.5 h-1.5 bg-accent-gold mt-2 flex-shrink-0" />
                      {service}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/consultation"
                  className="btn btn-primary w-full mt-8 text-xs"
                >
                  Discuss This Area
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="section bg-bg-secondary">
        <div className="container max-w-3xl">
          <p className="text-eyebrow text-accent-gold mb-4 text-center">
            Common Questions
          </p>
          <h2 className="text-h2 text-center mb-12">
            Frequently <span className="italic">Asked</span>
          </h2>

          <div className="space-y-0">
            {area.faqs.map((faq, i) => (
              <details
                key={i}
                className="group border-b border-border-subtle"
              >
                <summary className="flex items-center justify-between py-6 cursor-pointer list-none">
                  <span className="font-serif text-lg pr-8">
                    {faq.question}
                  </span>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="flex-shrink-0 transition-transform group-open:rotate-45"
                    aria-hidden="true"
                  >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </summary>
                <div className="pb-6 text-body text-text-secondary leading-relaxed">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Related Insights */}
      {relatedInsights.length > 0 && (
        <section className="section">
          <div className="container">
            <p className="text-eyebrow text-accent-gold mb-4">
              Related Insights
            </p>
            <h2 className="text-h3 mb-8">
              Articles on {area.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedInsights.map((post) => (
                <Link
                  key={post.id}
                  href={`/insights/${post.slug}`}
                  className="group"
                >
                  <div className="aspect-[3/2] bg-bg-secondary mb-4" />
                  <span className="text-[11px] uppercase tracking-[0.12em] text-accent-gold">
                    {post.category}
                  </span>
                  <h3 className="font-serif text-lg mt-1 group-hover:text-accent-wine transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Videos */}
      {relatedVideos.length > 0 && (
        <section className="section bg-bg-secondary">
          <div className="container">
            <p className="text-eyebrow text-accent-gold mb-4">
              Related Videos
            </p>
            <h2 className="text-h3 mb-8">
              Talks on {area.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {relatedVideos.map((video) => (
                <Link
                  key={video.id}
                  href={`/videos/${video.slug}`}
                  className="group"
                >
                  <div className="relative aspect-video bg-bg-dark mb-4">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full border border-text-inverse/40 flex items-center justify-center">
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
                    <span className="absolute bottom-2 right-2 bg-bg-dark/80 text-text-inverse text-[11px] px-2 py-0.5 font-mono">
                      {video.duration}
                    </span>
                  </div>
                  <h3 className="font-serif text-lg group-hover:text-accent-wine transition-colors">
                    {video.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Other Practice Areas */}
      <section className="section">
        <div className="container">
          <p className="text-eyebrow text-accent-gold mb-4">
            Explore More
          </p>
          <h2 className="text-h3 mb-8">Other Practice Areas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {otherAreas.map((other) => (
              <Link
                key={other.id}
                href={`/practice-areas/${other.slug}`}
                className="group p-6 border border-border-subtle hover:border-accent-gold transition-colors"
              >
                <span className="text-caption text-accent-gold">
                  {other.number}
                </span>
                <h3 className="font-serif text-xl mt-2 group-hover:text-accent-wine transition-colors">
                  {other.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
