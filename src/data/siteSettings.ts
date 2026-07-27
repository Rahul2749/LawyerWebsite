export const siteSettings = {
  firmName: "Alexander Mitchell",
  firmTagline: "Attorney at Law",
  firmDescription:
    "Trusted counsel for complex legal matters. Over two decades of dedicated practice delivering strategic solutions with unwavering integrity.",
  phone: "+1 (212) 555-0147",
  email: "contact@alexandermitchell.law",
  address: {
    street: "450 Park Avenue, Suite 2800",
    city: "New York",
    state: "NY",
    zip: "10022",
    full: "450 Park Avenue, Suite 2800, New York, NY 10022",
  },
  officeHours: {
    weekday: "Monday – Friday: 9:00 AM – 6:00 PM",
    weekend: "Saturday – Sunday: By Appointment Only",
  },
  social: {
    linkedin: "https://linkedin.com/in/alexandermitchell",
    twitter: "https://twitter.com/alexmitchelllaw",
  },
  trustStats: [
    { label: "Years of Experience", value: 24, suffix: "+" },
    { label: "Clients Represented", value: 1500, suffix: "+" },
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
