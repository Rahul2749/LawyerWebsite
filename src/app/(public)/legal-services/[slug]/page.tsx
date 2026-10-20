import Link from "next/link";
import { notFound } from "next/navigation";
import { siteSettings } from "@/data/siteSettings";
import { serviceGuides } from "@/data/serviceGuides";
import { absoluteUrl, breadcrumbSchema, pageMetadata } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";

export function generateStaticParams() {
  return siteSettings.services.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = siteSettings.services.find((item) => item.slug === slug);
  if (!service) notFound();
  return pageMetadata(`${service.name} Lawyer Consultation`, `${service.description} Speak with Nyaysaathi about your matter, documents, next steps and consultation fees in India.`, `/legal-services/${slug}`);
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = siteSettings.services.find((item) => item.slug === slug);
  const guide = serviceGuides[slug];
  if (!service || !guide) notFound();
  return <>
    <JsonLd data={[
      breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Legal Services", path: "/legal-services" }, { name: service.name, path: `/legal-services/${slug}` }]),
      { "@context": "https://schema.org", "@type": "Service", name: `${service.name} consultation`, description: service.description, serviceType: service.name, url: absoluteUrl(`/legal-services/${slug}`), areaServed: { "@type": "Country", name: "India" }, provider: { "@id": absoluteUrl("/#organization") } },
    ]} />
    <section className="pt-32 pb-12 lg:pt-40 bg-bg-secondary"><div className="container max-w-4xl">
      <nav aria-label="Breadcrumb" className="text-sm text-text-secondary mb-6"><Link href="/">Home</Link> / <Link href="/legal-services">Legal Services</Link> / <span aria-current="page">{service.name}</span></nav>
      <h1 className="text-hero mb-6">{service.name} lawyer consultation</h1><p className="text-body text-text-secondary leading-relaxed">{service.description}</p>
    </div></section>
    <section className="section"><div className="container max-w-4xl space-y-10">
      <div><h2 className="text-h2 mb-5">Discuss your legal concern</h2><p className="text-body text-text-secondary leading-relaxed">{guide.introduction}</p></div>
      <div><h2 className="text-h3 mb-4">Matters you can discuss</h2><ul className="list-disc pl-6 space-y-2 text-text-secondary">{service.highlights.map((item) => <li key={item}>{item}</li>)}</ul></div>
      <div><h2 className="text-h3 mb-4">Documents to have ready</h2><ul className="list-disc pl-6 space-y-2 text-text-secondary">{guide.documents.map((item) => <li key={item}>{item}</li>)}</ul><p className="text-sm text-text-secondary mt-4">Have relevant records ready for your discussion. Ask how to share sensitive documents securely; the booking form only needs a brief description of your concern.</p></div>
      <div><h2 className="text-h3 mb-4">Questions to ask your advocate</h2><ul className="list-disc pl-6 space-y-2 text-text-secondary">{guide.questions.map((item) => <li key={item}>{item}</li>)}</ul></div>
      <div className="p-7 bg-bg-secondary"><h2 className="text-h3 mb-4">Fees, availability and next steps</h2><p className="text-text-secondary leading-relaxed mb-5">Nyaysaathi offers consultation across India. Review the fee shown when booking; drafting, filing and court appearances may require a separate scope and quote. Share your location and any urgent date so availability can be confirmed.</p><div className="flex flex-wrap gap-5 items-center"><Link href={`/consultation?service=${slug}`} className="btn btn-primary">Book {service.name} consultation</Link><Link href="/lawyer-fees" className="text-accent-wine underline">Read about lawyer fees</Link></div></div>
      <p className="text-text-secondary">Need help preparing for your first discussion? <Link href="/legal-help" className="text-accent-wine underline">Read our legal consultation guide</Link>.</p>
      <p className="text-sm text-text-secondary">This page explains consultation preparation. Advice and representation depend on the facts, applicable law, availability and an agreed engagement.</p>
      <Link href="/legal-services" className="text-accent-wine underline">Explore all legal services</Link>
    </div></section>
  </>;
}
