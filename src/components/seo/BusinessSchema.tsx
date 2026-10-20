import { siteSettings } from "@/data/siteSettings";
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
      url: absoluteUrl(),
      logo: absoluteUrl("/nyaysaathi_logo.png"),
      email: siteSettings.email,
      description: "Advocates and legal consultants for individuals, families and businesses in India.",
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
