"use client";

import ScrollReveal from "@/components/ui/ScrollReveal";

const galleryImages = [
  {
    src: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=1200&auto=format&fit=crop",
    alt: "Law firm interior",
    className: "col-span-1 row-span-2 aspect-[2/3]",
  },
  {
    src: "https://images.unsplash.com/photo-1505664177941-11b068284560?q=80&w=1200&auto=format&fit=crop",
    alt: "Legal consultation",
    className: "col-span-1 row-span-1 aspect-square",
  },
  {
    src: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1200&auto=format&fit=crop",
    alt: "Legal documents and pen",
    className: "col-span-1 row-span-1 aspect-[4/3] sm:aspect-square",
  },
  {
    src: "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1200&auto=format&fit=crop",
    alt: "Team meeting",
    className: "col-span-1 sm:col-span-2 row-span-1 aspect-video",
  },
];

export default function PhotoGallerySection() {
  return (
    <section className="section bg-bg-primary overflow-hidden">
      <div className="container">
        <ScrollReveal animation="fade-up" className="text-center mb-12 lg:mb-16">
          <p className="text-eyebrow text-accent-gold mb-4">
            Gallery
          </p>
          <h2 className="text-h2">
            Inside Our <span className="italic">Practice</span>
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6 max-w-6xl mx-auto">
          {galleryImages.map((image, index) => (
            <ScrollReveal
              key={index}
              animation="fade-up"
              delay={index * 0.1}
              className={`relative group overflow-hidden rounded-xl bg-bg-secondary ${image.className}`}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-bg-dark/10 group-hover:bg-transparent transition-colors duration-500" />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
