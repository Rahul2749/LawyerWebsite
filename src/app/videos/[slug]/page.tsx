import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { videos } from "@/data/videos";

export async function generateStaticParams() {
  return videos.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const video = videos.find((v) => v.slug === slug);
  if (!video) return { title: "Video Not Found" };

  return {
    title: video.title,
    description: video.description,
  };
}

export default async function VideoDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const video = videos.find((v) => v.slug === slug);
  if (!video) notFound();

  const relatedVideos = videos.filter((v) => v.id !== video.id).slice(0, 3);

  const videoSchema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.title,
    description: video.description,
    duration: `PT${Math.floor(video.durationSeconds / 60)}M${video.durationSeconds % 60}S`,
    uploadDate: video.publishedAt,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema) }}
      />

      {/* Breadcrumb */}
      <section className="pt-32 lg:pt-40">
        <div className="container">
          <nav aria-label="Breadcrumb" className="text-caption text-text-secondary">
            <Link href="/" className="hover:text-accent-wine transition-colors">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/videos" className="hover:text-accent-wine transition-colors">
              Videos
            </Link>
            <span className="mx-2">/</span>
            <span className="text-text-primary line-clamp-1">{video.title}</span>
          </nav>
        </div>
      </section>

      {/* Video Player */}
      <section className="pt-8 pb-16">
        <div className="container max-w-4xl">
          <div className="relative aspect-video bg-bg-dark mb-8">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full border-2 border-text-inverse/30 flex items-center justify-center mx-auto mb-4 hover:border-accent-gold transition-colors cursor-pointer">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="text-text-inverse ml-1"
                    aria-hidden="true"
                  >
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </div>
                <p className="text-xs text-text-inverse/40">Video Player Placeholder</p>
              </div>
            </div>
            <span className="absolute bottom-4 right-4 bg-bg-dark/80 text-text-inverse text-sm px-3 py-1 font-mono">
              {video.duration}
            </span>
          </div>

          <div className="flex items-center gap-3 mb-3">
            <span className="text-eyebrow text-accent-gold">
              {video.category}
            </span>
            <span className="text-text-secondary/40">·</span>
            <span className="text-caption text-text-secondary">
              {new Date(video.publishedAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
          <h1 className="text-h2 mb-6">{video.title}</h1>
          <span className="gold-line" />
          <p className="text-body text-text-secondary mt-6 leading-relaxed max-w-2xl">
            {video.description}
          </p>

          {/* Transcript placeholder */}
          <div className="mt-12 p-8 bg-bg-secondary border border-border-subtle">
            <h3 className="text-eyebrow text-accent-gold mb-4">Transcript</h3>
            <p className="text-sm text-text-secondary/60 italic">
              Full transcript will be available here. Captions are auto-generated
              and may contain minor inaccuracies.
            </p>
          </div>
        </div>
      </section>

      {/* Related Videos */}
      {relatedVideos.length > 0 && (
        <section className="section bg-bg-secondary">
          <div className="container">
            <h2 className="text-h3 mb-8">More Videos</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedVideos.map((v) => (
                <Link
                  key={v.id}
                  href={`/videos/${v.slug}`}
                  className="group"
                >
                  <div className="relative aspect-video bg-bg-dark mb-4">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full border border-text-inverse/40 flex items-center justify-center">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-text-inverse ml-0.5" aria-hidden="true">
                          <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                      </div>
                    </div>
                    <span className="absolute bottom-2 right-2 bg-bg-dark/80 text-text-inverse text-[11px] px-2 py-0.5 font-mono">
                      {v.duration}
                    </span>
                  </div>
                  <h3 className="font-serif text-lg group-hover:text-accent-wine transition-colors line-clamp-2">
                    {v.title}
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
