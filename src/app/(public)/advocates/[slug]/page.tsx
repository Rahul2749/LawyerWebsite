import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { teamMembers } from "@/data/teamMembers";
import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl, breadcrumbSchema, pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return teamMembers.map((member) => ({ slug: member.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const member = teamMembers.find((item) => item.id === slug);
  if (!member) notFound();
  return pageMetadata(
    `${member.name} — Advocate & Legal Consultant`,
    `${member.name} at Nyaysaathi. ${member.caption ?? member.role} Read the advocate profile and arrange a legal consultation.`,
    `/advocates/${member.id}`,
  );
}

export default async function AdvocatePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const member = teamMembers.find((item) => item.id === slug);
  if (!member) notFound();
  const profileUrl = `/advocates/${member.id}`;
  const biography = (member.biography ?? member.caption ?? "").replace(/\*([^*]+)\*/g, "$1");

  return (
    <>
      <JsonLd data={[
        breadcrumbSchema([{ name: "Home", path: "/" }, { name: member.name, path: profileUrl }]),
        {
          "@context": "https://schema.org",
          "@type": "ProfilePage",
          "@id": absoluteUrl(`${profileUrl}#profile`),
          url: absoluteUrl(profileUrl),
          name: `${member.name} — Nyaysaathi`,
          mainEntity: {
            "@type": "Person",
            "@id": absoluteUrl(`${profileUrl}#person`),
            name: member.name,
            jobTitle: "Advocate",
            description: biography,
            image: absoluteUrl(member.portrait.src),
            url: absoluteUrl(profileUrl),
            worksFor: { "@id": absoluteUrl("/#organization") },
          },
        },
      ]} />

      <section className="pt-32 pb-12 lg:pt-40 bg-bg-secondary">
        <div className="container">
          <nav aria-label="Breadcrumb" className="text-sm text-text-secondary mb-6">
            <Link href="/">Home</Link> / <span aria-current="page">{member.name}</span>
          </nav>
          <p className="text-eyebrow text-accent-gold mb-4">Nyaysaathi advocates</p>
          <h1 className="text-hero mb-4">{member.name}</h1>
          <p className="text-body text-text-secondary">{member.role}</p>
        </div>
      </section>

      <section className="section">
        <div className="container grid gap-10 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-16">
          <div className="relative aspect-[4/5] w-full max-w-[260px] overflow-hidden rounded-xl border border-border-subtle bg-bg-secondary">
            <Image src={member.portrait} alt={`Portrait of ${member.name}`} fill sizes="260px" placeholder="blur" className="object-cover object-top" />
          </div>
          <div className="max-w-3xl">
            <h2 className="text-h2 mb-6">Advocate profile</h2>
            <div className="space-y-5 text-body text-text-secondary leading-relaxed">
              {biography.split(/\n\n+/).map((paragraph, index) => <p key={index}>{paragraph}</p>)}
            </div>
            <h2 className="text-h3 mt-10 mb-4">Arrange a legal consultation</h2>
            <p className="text-text-secondary leading-relaxed mb-6">
              Share a brief description of your matter and any urgent date with Nyaysaathi.
              The team will confirm the appropriate advocate, availability and consultation scope.
              Review the fee before booking; representation or additional work is agreed separately.
            </p>
            <div className="flex flex-wrap items-center gap-5">
              <Link href="/consultation" className="btn btn-primary">Book a consultation</Link>
              <Link href="/lawyer-fees" className="text-accent-wine underline">Consultation fees</Link>
              <Link href="/legal-services" className="text-accent-wine underline">Explore legal services</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="container">
          <h2 className="text-h3 mb-5">Meet the Nyaysaathi team</h2>
          <div className="flex flex-wrap gap-5">
            {teamMembers.filter((other) => other.id !== member.id).map((other) => (
              <Link key={other.id} href={`/advocates/${other.id}`} className="text-accent-wine underline">{other.name}</Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
