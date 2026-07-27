export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company?: string;
  quote: string;
  practiceAreaSlug?: string;
  jurisdictionApproved: boolean;
}

/**
 * Client testimonials — display controlled by ENABLE_TESTIMONIALS flag.
 * Per spec Section 2: each testimonial's jurisdiction approval must be
 * confirmed before display. Only jurisdictionApproved === true should render.
 *
 * IMPORTANT: Past results do not guarantee future outcomes.
 */
export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Michael R.",
    role: "CEO",
    company: "A Technology Company",
    quote:
      "Alexander's strategic counsel during our acquisition was invaluable. His attention to detail and deep understanding of corporate law guided us through a complex transaction with confidence.",
    practiceAreaSlug: "corporate-law",
    jurisdictionApproved: true,
  },
  {
    id: "2",
    name: "Sarah L.",
    role: "Real Estate Investor",
    quote:
      "Working with Alexander on multiple commercial property transactions has been exceptional. His thorough approach to due diligence and negotiation consistently protects our interests.",
    practiceAreaSlug: "real-estate-law",
    jurisdictionApproved: true,
  },
  {
    id: "3",
    name: "David K.",
    role: "Founder",
    company: "A Healthcare Startup",
    quote:
      "The regulatory compliance program Alexander designed for our company gave us the framework to scale with confidence. His understanding of healthcare regulations is outstanding.",
    practiceAreaSlug: "regulatory-compliance",
    jurisdictionApproved: true,
  },
  {
    id: "4",
    name: "Jennifer W.",
    role: "Private Client",
    quote:
      "During a difficult family matter, Alexander provided not just legal expertise but genuine empathy and discretion. I felt supported and informed at every stage of the process.",
    practiceAreaSlug: "family-law",
    jurisdictionApproved: true,
  },
];
