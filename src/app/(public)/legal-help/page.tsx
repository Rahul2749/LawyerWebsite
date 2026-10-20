import Link from "next/link";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";

export const metadata = pageMetadata("Online Legal Help & Lawyer Consultation in India", "Arrange online legal help with Nyaysaathi across India. Prepare for your lawyer consultation, explore services and understand consultation fees.", "/legal-help");

export default function LegalHelpPage() {
  return <>
    <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Legal Help", path: "/legal-help" }])} />
    <section className="pt-32 pb-12 lg:pt-40 bg-bg-secondary"><div className="container max-w-4xl">
      <p className="text-eyebrow text-accent-gold mb-4">Your consultation guide</p>
      <h1 className="text-hero mb-6">Online legal help across India</h1>
      <p className="text-body text-text-secondary leading-relaxed">Nyaysaathi helps individuals, families and businesses arrange legal consultations across India. Start with an online discussion, explain your concern and confirm the assistance you need with our team.</p>
    </div></section>
    <section className="section"><div className="container max-w-4xl space-y-10">
      <div><h2 className="text-h2 mb-5">Finding the right legal assistance</h2><p className="text-text-secondary leading-relaxed">The right advocate depends on the subject of your case and the court or authority involved. Share a brief description, any case number and your next hearing date. Nyaysaathi has no walk-in office; any in-person meeting or court representation must be arranged and confirmed individually.</p></div>
      <div><h2 className="text-h3 mb-4">What kind of legal help do you need?</h2><div className="grid sm:grid-cols-2 gap-4">
        {[["property-real-estate", "Property disputes and title review"], ["criminal-defence", "Criminal defence and bail enquiries"], ["civil-litigation", "Civil disputes and recovery matters"], ["family-law", "Family, maintenance and custody matters"], ["divorce-law", "Divorce and separation enquiries"], ["business-commercial", "Business agreements and disputes"]].map(([slug, label]) => <Link className="text-accent-wine underline" key={slug} href={`/legal-services/${slug}`}>{label}</Link>)}
      </div></div>
      <div><h2 className="text-h3 mb-4">Before booking a consultation</h2><ol className="list-decimal pl-6 space-y-3 text-text-secondary"><li>Write a short timeline and the outcome you want to discuss.</li><li>Identify your location and any court, police station or authority already involved.</li><li>Have notices and relevant records ready; mention deadlines at the start.</li><li>Ask whether the advocate can assist with your subject, location and preferred language.</li><li>Confirm the consultation fee and whether additional work needs a separate quote.</li></ol></div>
      <div><h2 className="text-h3 mb-4">Can I arrange a video consultation?</h2><p className="text-text-secondary leading-relaxed">Yes. You can request a video consultation from anywhere in India. Online consultation does not automatically include local filing or court appearances. Discuss those requirements with the team before making arrangements.</p></div>
      <div className="flex flex-wrap gap-5 items-center"><Link href="/consultation" className="btn btn-primary">Request a lawyer consultation</Link><Link href="/lawyer-fees" className="text-accent-wine underline">Consultation fees explained</Link><Link href="/contact" className="text-accent-wine underline">Contact the team</Link></div>
    </div></section>
  </>;
}
