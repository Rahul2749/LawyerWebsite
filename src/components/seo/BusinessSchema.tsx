import { siteSettings } from "@/data/siteSettings";
import { teamMembers } from "@/data/teamMembers";
import { absoluteUrl } from "@/lib/seo";
import JsonLd from "./JsonLd";

export default function BusinessSchema() {
  // Use Organization until a real office address is confirmed. No invented branches,
  // ratings, registration numbers, or opening hours for an unverified location.
  return <JsonLd data={[
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": absoluteUrl("/#organization"),
      name: siteSettings.firmName,
      alternateName: "Nyaysathi",
      url: absoluteUrl(),
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/brand-logo.png"),
        width: 192,
        height: 192,
      },
      email: siteSettings.email,
      description: "Advocates and legal consultants for individuals, families and businesses in India.",
      areaServed: { "@type": "Country", name: "India" },
      employee: teamMembers.map((member) => ({
        "@type": "Person",
        "@id": absoluteUrl(`/advocates/${member.id}#person`),
        name: member.name,
        jobTitle: "Advocate",
        url: absoluteUrl(`/advocates/${member.id}`),
      })),
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Legal services and consultations",
        itemListElement: siteSettings.services.map((service) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: service.name,
            description: service.description,
            url: absoluteUrl(`/legal-services/${service.slug}`),
          },
        })),
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": absoluteUrl("/#website"),
      url: absoluteUrl(),
      name: siteSettings.firmName,
      alternateName: "Nyaysathi",
      inLanguage: "en-IN",
      publisher: { "@id": absoluteUrl("/#organization") },
    },
  ]} />;
}
