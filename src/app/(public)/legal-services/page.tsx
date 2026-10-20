import Link from "next/link";
import { siteSettings } from "@/data/siteSettings";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Legal Services & Lawyer Consultancy in India", "Explore Nyaysaathi legal services: criminal defence, property, civil disputes, family and divorce law, business advice and online lawyer consultations across India.", "/legal-services");

export default function LegalServicesPage() {
  return <>
    <section className="pt-32 pb-12 lg:pt-40 bg-bg-secondary"><div className="container max-w-5xl">
      <p className="text-eyebrow text-accent-gold mb-4">Legal help across India</p>
      <h1 className="text-hero mb-6">Legal services &amp; lawyer consultancy</h1>
      <p className="text-body text-text-secondary max-w-3xl">Choose the subject closest to your concern to see how to prepare for a consultation. Nyaysaathi provides legal consultancy across India. Court representation, specialist availability and any in-person meeting are confirmed for your individual matter.</p>
    </div></section>
    <section className="section"><div className="container max-w-5xl grid md:grid-cols-2 gap-6">
      {siteSettings.services.map((service) => <Link key={service.slug} href={`/legal-services/${service.slug}`} className="p-7 border border-border-subtle hover:border-accent-gold transition-colors">
        <h2 className="text-h3 mb-3">{service.name}</h2><p className="text-text-secondary leading-relaxed mb-4">{service.description}</p><span className="text-accent-wine">Read consultation guide →</span>
      </Link>)}
    </div></section>
    <section className="pb-16"><div className="container max-w-5xl flex flex-wrap gap-6"><Link href="/lawyer-fees" className="text-accent-wine underline">Understand lawyer fees</Link><Link href="/legal-help" className="text-accent-wine underline">How to arrange legal help</Link><Link href="/consultation" className="btn btn-primary">Book a consultation</Link></div></section>
  </>;
}
