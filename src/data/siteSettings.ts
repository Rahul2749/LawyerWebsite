export const siteSettings = {
  firmName: "Raja Agrawal",
  firmTagline: "Advocate & Legal Consultant",
  firmDescription:
    "Trusted counsel for complex legal matters. Over two decades of dedicated practice delivering strategic solutions with unwavering integrity.",
  phone: "+91 98765 43210",
  email: "contact@rajaagrawal.in",
  address: {
    street: "Chamber No. 123, District Court Complex",
    city: "New Delhi",
    state: "Delhi",
    zip: "110001",
    full: "Chamber No. 123, District Court Complex, New Delhi — 110001",
  },
  officeHours: {
    weekday: "Monday – Friday: 10:00 AM – 6:00 PM",
    weekend: "Saturday: By Appointment Only",
  },
  social: {
    linkedin: "https://linkedin.com/in/rajaagrawal",
    twitter: "https://twitter.com/rajaagrawallaw",
  },
  trustStats: [
    { label: "Years of Experience", value: 20, suffix: "+" },
    { label: "Cases Handled", value: 1500, suffix: "+" },
    { label: "Practice Areas", value: 6, suffix: "" },
    { label: "Client Satisfaction", value: 98, suffix: "%" },
  ],
  /**
   * Compliance flags — toggle per jurisdiction
   * @see Spec Section 2: Legal & Ethical Compliance
   */
  ENABLE_TESTIMONIALS: true,
  ENABLE_COOKIE_CONSENT: true,
} as const;

export type SiteSettings = typeof siteSettings;
