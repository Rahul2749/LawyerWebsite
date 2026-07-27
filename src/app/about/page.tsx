import type { Metadata } from "next";
import Link from "next/link";
import { siteSettings } from "@/data/siteSettings";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Alexander Mitchell — over two decades of legal experience in corporate law, litigation, real estate, and more. A legacy of trusted counsel.",
};

const milestones = [
  { year: "1998", event: "Juris Doctor, Columbia Law School" },
  { year: "2000", event: "Associate, Sullivan & Cromwell LLP" },
  { year: "2005", event: "Senior Associate, Complex Litigation Group" },
  { year: "2008", event: "Partner, Corporate & Transactions Practice" },
  { year: "2014", event: "Founded independent practice" },
  { year: "2020", event: "Expanded practice areas to include Regulatory & Compliance" },
  { year: "Present", event: "Continued dedication to client-centered legal excellence" },
];

const credentials = [
  "Columbia Law School, J.D., magna cum laude",
  "New York State Bar Admission",
  "U.S. District Court, Southern District of New York",
  "U.S. District Court, Eastern District of New York",
  "American Bar Association, Member",
  "New York State Bar Association, Member",
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-40 pb-20 lg:pt-48 lg:pb-32 bg-bg-secondary relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=2000&auto=format&fit=crop"
            alt="About us background"
            className="w-full h-full object-cover opacity-10 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-secondary via-transparent to-transparent" />
        </div>
        <div className="container relative z-10 text-center lg:text-left">
          <p className="text-eyebrow text-accent-gold mb-4">About</p>
          <h1 className="text-hero max-w-3xl mx-auto lg:mx-0">
            A Commitment to
            <br className="hidden sm:block" />
            <span className="italic"> Excellence</span>
          </h1>
        </div>
      </section>

      {/* Bio Section */}
      <section className="section">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Portrait */}
            <div className="relative aspect-[3/4] bg-bg-secondary overflow-hidden sticky top-32">
              <img
                src="https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=1000&auto=format&fit=crop"
                alt="Alexander Mitchell"
                className="w-full h-full object-cover grayscale opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg-dark/10 to-transparent" />
              <div className="absolute bottom-0 right-0 w-32 h-32 border-b border-r border-accent-gold/50" />
            </div>

            {/* Content */}
            <div>
              <span className="gold-line" />
              <h2 className="text-h2 mt-4 mb-8">Alexander Mitchell</h2>

              <div className="prose">
                <p>
                  For over two decades, I have dedicated my practice to
                  serving clients who face their most complex and
                  consequential legal challenges. From corporate
                  transactions that shape businesses to litigation that
                  protects rights and interests, my approach has always
                  been rooted in three principles: meticulous
                  preparation, strategic thinking, and unwavering
                  advocacy.
                </p>
                <p>
                  My career began at one of New York&apos;s most
                  prestigious law firms, where I developed the
                  foundational skills that continue to inform my
                  practice. The rigorous training, the exposure to
                  high-stakes matters, and the mentorship of exceptional
                  lawyers shaped my understanding of what true legal
                  excellence requires.
                </p>
                <p>
                  In founding my own practice, I sought to combine that
                  institutional rigor with something more personal —
                  the ability to give every client the direct attention,
                  honest counsel, and creative problem-solving that
                  complex matters demand. I believe the attorney-client
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
              <div className="mt-16">
                <h3 className="text-h3 mb-4">Philosophy</h3>
                <span className="gold-line" />
                <p className="text-body text-text-secondary mt-4 leading-relaxed">
                  I believe in the power of preparation. Every case,
                  every transaction, every negotiation benefits from a
                  lawyer who has done the work — who understands the
                  law, the facts, the stakeholders, and the
                  consequences. I bring that level of preparation to
                  every matter I handle, whether it&apos;s a
                  billion-dollar acquisition or a family&apos;s most
                  personal legal concern.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section bg-bg-secondary">
        <div className="container max-w-3xl">
          <p className="text-eyebrow text-accent-gold mb-4 text-center">
            Career
          </p>
          <h2 className="text-h2 text-center mb-16">
            Professional <span className="italic">Timeline</span>
          </h2>

          <div className="space-y-0">
            {milestones.map((m, i) => (
              <div
                key={i}
                className="flex gap-8 py-6 border-b border-border-subtle last:border-b-0"
              >
                <span className="text-accent-gold font-serif text-xl font-light w-24 flex-shrink-0">
                  {m.year}
                </span>
                <span className="text-body text-text-secondary">
                  {m.event}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Credentials */}
      <section className="section">
        <div className="container max-w-3xl">
          <p className="text-eyebrow text-accent-gold mb-4 text-center">
            Credentials
          </p>
          <h2 className="text-h2 text-center mb-12">
            Education &{" "}
            <span className="italic">Admissions</span>
          </h2>

          <ul className="space-y-4">
            {credentials.map((c, i) => (
              <li
                key={i}
                className="flex items-center gap-4 py-3 border-b border-border-subtle last:border-b-0"
              >
                <div className="w-2 h-2 bg-accent-gold flex-shrink-0" />
                <span className="text-body text-text-primary">{c}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-bg-dark text-text-inverse">
        <div className="container text-center max-w-2xl">
          <h2 className="text-h2 text-text-inverse mb-6">
            Let&apos;s Discuss{" "}
            <span className="italic">Your Matter</span>
          </h2>
          <p className="text-body text-text-inverse/60 mb-8">
            Every case begins with a conversation. Reach out to discuss
            how I can help.
          </p>
          <Link
            href="/consultation"
            className="btn btn-primary bg-accent-wine hover:bg-accent-wine-hover"
          >
            Book a Consultation
          </Link>
        </div>
      </section>
    </>
  );
}
