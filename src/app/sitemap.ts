import type { MetadataRoute } from "next";
import { practiceAreas } from "@/data/practiceAreas";
import { siteSettings } from "@/data/siteSettings";
import { absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/", "/practice-areas", "/legal-services", "/legal-help",
    "/lawyer-fees", "/consultation", "/contact", "/privacy-policy",
    "/terms-of-use", "/cookie-policy", "/disclaimer",
    ...practiceAreas.map((area) => `/practice-areas/${area.slug}`),
    ...siteSettings.services.map((service) => `/legal-services/${service.slug}`),
  ];
  // No fabricated modification dates. Add real editorial dates when available.
  // Hidden sample articles and placeholder videos stay out until reviewed/published.
  return paths.map((path) => ({ url: absoluteUrl(path) }));
}
