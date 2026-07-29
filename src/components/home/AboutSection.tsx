"use client";

import ScrollReveal from "@/components/ui/ScrollReveal";

export default function AboutSection() {
  return (
    <section id="about" className="section bg-bg-primary">
      <div className="container">
        <ScrollReveal animation="fade-up" className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Portrait */}
          <div className="relative aspect-[3/4] bg-bg-secondary overflow-hidden rounded-2xl">
            <img
              src="/advocate_portrait.png"
              alt="Raja Agrawal"
              className="w-full h-full object-cover grayscale-[20%] opacity-95"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg-dark/10 to-transparent" />
            <div className="absolute bottom-0 right-0 w-32 h-32 border-b border-r border-accent-gold/50" />
          </div>

          {/* Content */}
          <div>
            <p className="text-eyebrow text-accent-gold mb-4">About Me</p>
            <h2 className="text-h2 mb-8">Raja Agrawal</h2>

            <div className="prose">
              <p>
                For over 5 years, I have dedicated my practice to
                serving clients who face their most complex and
                consequential legal challenges. From corporate
                transactions that shape businesses to litigation that
                protects rights and interests, my approach has always
                been rooted in three principles: meticulous
                preparation, strategic thinking, and unwavering
                advocacy.
              </p>
              <p>
                I founded my independent practice to combine
                institutional rigor with something more personal —
                the ability to give every client direct attention,
                honest counsel, and creative problem-solving that
                complex matters demand. I believe the advocate-client
                relationship is built on trust, transparency, and
                genuine commitment to the client&apos;s objectives.
              </p>
              <p>
                My practice spans corporate law, litigation and
                dispute resolution, real estate, intellectual
                property, family law, and regulatory compliance. This
                breadth allows me to serve clients holistically,
                understanding how different legal issues intersect and
                developing comprehensive strategies that account for
                the full picture.
              </p>
            </div>

            {/* Philosophy */}
            <div className="mt-12">
              <h3 className="text-h3 mb-4">Philosophy</h3>
              <span className="gold-line" />
              <p className="text-body text-text-secondary mt-4 leading-relaxed">
                I believe in the power of preparation. Every case,
                every transaction, every negotiation benefits from a
                lawyer who has done the work — who understands the
                law, the facts, the stakeholders, and the
                consequences. I bring that level of preparation to
                every matter I handle.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
