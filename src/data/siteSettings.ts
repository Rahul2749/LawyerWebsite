export const siteSettings = {
  firmName: "Raja Agrawal",
  firmTagline: "Advocate & Legal Consultant",
  firmDescription:
    "Trusted counsel for complex legal matters. Over two decades of dedicated practice delivering strategic solutions with unwavering integrity.",
  phone: "+91 86053 99330",
  whatsapp: "918605399330", // Phone with country code, no + or spaces — used for wa.me links
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
    { label: "Practice Areas", value: 8, suffix: "" },
    { label: "Client Satisfaction", value: 98, suffix: "%" },
  ],

  // Legal services offered — synced with backend seed data
  services: [
    {
      id: "property-real-estate",
      slug: "property-real-estate",
      name: "Property & Real Estate",
      description: "Real estate transactions, property disputes, land records, and title verification.",
      icon: "building",
      price: 1000,
      duration: 60,
      highlights: ["Property Documentation", "Title Verification", "Real Estate Transactions", "Land & Tenant Disputes"]
    },
    {
      id: "criminal-defence",
      slug: "criminal-defence",
      name: "Criminal Defence",
      description: "Expert defence in criminal cases, bail applications, FIR quashing, and trial representation.",
      icon: "shield",
      price: 1000,
      duration: 60,
      highlights: ["Anticipatory & Regular Bail", "Trial Representation", "FIR Quashing", "Criminal Appeals"]
    },
    {
      id: "civil-litigation",
      slug: "civil-litigation",
      name: "Civil Litigation",
      description: "Representation in civil disputes, injunctions, contract breaches, and enforcement of rights.",
      icon: "gavel",
      price: 1000,
      duration: 60,
      highlights: ["Breach of Contract", "Property Partition Suits", "Injunctions & Recovery", "Civil Appeals"]
    },
    {
      id: "family-law",
      slug: "family-law",
      name: "Family Law",
      description: "Child custody, alimony, adoption, marriage matters, and family dispute resolution.",
      icon: "family",
      price: 1000,
      duration: 60,
      highlights: ["Child Custody & Support", "Alimony & Maintenance", "Family Partition", "Domestic Disputes"]
    },
    {
      id: "divorce-law",
      slug: "divorce-law",
      name: "Divorce Law",
      description: "Mutual consent and contested divorce proceedings, annulments, and legal separation.",
      icon: "family",
      price: 1000,
      duration: 60,
      highlights: ["Mutual Consent Divorce", "Contested Divorce", "Annulment of Marriage", "Settlement Agreements"]
    },
    {
      id: "corporate-business",
      slug: "corporate-business",
      name: "Corporate & Business",
      description: "Company registration, statutory compliance, contract drafting, and business legal support.",
      icon: "briefcase",
      price: 1000,
      duration: 60,
      highlights: ["Company Incorporation", "Corporate Compliance", "M&A Advisory", "Directors Liability"]
    },
    {
      id: "cyber-law",
      slug: "cyber-law",
      name: "Cyber Law",
      description: "Cybercrime complaints, online fraud, data privacy violations, and IT Act offences.",
      icon: "laptop",
      price: 1000,
      duration: 60,
      highlights: ["Cybercrime Complaints", "Online Financial Fraud", "Data Privacy & Security", "IT Act Compliance"]
    },
    {
      id: "intellectual-property",
      slug: "intellectual-property",
      name: "Intellectual Property",
      description: "Trademark, copyright, and patent registrations, brand protection, and infringement litigation.",
      icon: "star",
      price: 1000,
      duration: 60,
      highlights: ["Trademark Filing", "Copyright Protection", "Patent Registration", "Infringement Suits"]
    },
    {
      id: "labour-employment",
      slug: "labour-employment",
      name: "Labour & Employment",
      description: "Wrongful termination, workplace disputes, ESIC/PF compliance, and employment contracts.",
      icon: "users",
      price: 1000,
      duration: 60,
      highlights: ["Wrongful Termination", "Workplace Harassment", "PF & ESIC Compliance", "Employment Contracts"]
    },
    {
      id: "administrative-law",
      slug: "administrative-law",
      name: "Administrative Law",
      description: "Challenging government actions, regulatory body hearings, and administrative writ petitions.",
      icon: "building",
      price: 1000,
      duration: 60,
      highlights: ["Government Action Review", "Regulatory Hearings", "Public Tender Disputes", "Statutory Appeals"]
    },
    {
      id: "taxation-law",
      slug: "taxation-law",
      name: "Taxation Law",
      description: "Income tax disputes, GST assessments, tax planning, and corporate tax litigation.",
      icon: "briefcase",
      price: 1000,
      duration: 60,
      highlights: ["Income Tax Appeals", "GST Assessment & Audit", "Tax Structuring", "Corporate Tax Disputes"]
    },
    {
      id: "consumer-protection",
      slug: "consumer-protection",
      name: "Consumer Protection",
      description: "Defective products, service deficiencies, insurance claims, and consumer forum suits.",
      icon: "star",
      price: 1000,
      duration: 60,
      highlights: ["Defective Products", "Service Deficiencies", "Consumer Court Suits", "Unfair Trade Practices"]
    },
    {
      id: "environmental-law",
      slug: "environmental-law",
      name: "Environmental Law",
      description: "Pollution control board clearances, NGT litigation, and environmental compliance.",
      icon: "building",
      price: 1000,
      duration: 60,
      highlights: ["NGT Representation", "Pollution Clearances", "Regulatory Audits", "Environmental Notices"]
    },
    {
      id: "immigration-law",
      slug: "immigration-law",
      name: "Immigration Law",
      description: "Visa rejections, citizenship applications, cross-border documentation, and appeals.",
      icon: "users",
      price: 1000,
      duration: 60,
      highlights: ["Visa Rejection Appeals", "Citizenship & PR", "Overseas Document Verification", "Deportation Relief"]
    },
    {
      id: "insurance-law",
      slug: "insurance-law",
      name: "Insurance Law",
      description: "Claim rejection appeals, policy dispute settlements, and motor accident claims.",
      icon: "shield",
      price: 1000,
      duration: 60,
      highlights: ["Claim Rejection Appeals", "MACT Claims", "Policy Dispute Settlements", "Life & Health Disputes"]
    },
    {
      id: "startup-law",
      slug: "startup-law",
      name: "Startup Law",
      description: "Founders agreements, ESOP structuring, seed funding documentation, and IP protection.",
      icon: "laptop",
      price: 1000,
      duration: 60,
      highlights: ["Founders Agreements", "ESOP Structuring", "Term Sheets & Funding", "IP Assignment"]
    },
    {
      id: "business-commercial",
      slug: "business-commercial",
      name: "Business & Commercial Law",
      description: "Commercial contract drafting, vendor NDAs, partnership deeds, and dispute arbitration.",
      icon: "briefcase",
      price: 1000,
      duration: 60,
      highlights: ["Commercial Contracts", "NDAs & Vendor Terms", "Partnership & JV Deeds", "Commercial Arbitration"]
    },
    {
      id: "nri-legal-services",
      slug: "nri-legal-services",
      name: "NRI Legal Services",
      description: "India property management, Special Power of Attorney (POA), and overseas inheritance.",
      icon: "users",
      price: 1000,
      duration: 60,
      highlights: ["Power of Attorney (POA)", "India Property Management", "Inheritance Claims", "OCI Legal Matters"]
    }
  ],

  // Backend API URL — update for production
  BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000",

  /**
   * Compliance flags — toggle per jurisdiction
   * @see Spec Section 2: Legal & Ethical Compliance
   */
  ENABLE_TESTIMONIALS: true,
  ENABLE_COOKIE_CONSENT: true,
} as const;

export type SiteSettings = typeof siteSettings;
export type LegalService = (typeof siteSettings.services)[number];

