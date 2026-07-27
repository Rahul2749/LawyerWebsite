export interface FAQ {
  question: string;
  answer: string;
}

export interface PracticeArea {
  id: string;
  slug: string;
  number: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  services: string[];
  approach: string;
  faqs: FAQ[];
  imageUrl: string;
}

export const practiceAreas: PracticeArea[] = [
  {
    id: "1",
    slug: "corporate-law",
    number: "01",
    title: "Corporate Law",
    shortDescription:
      "Strategic counsel for mergers, acquisitions, governance, and complex corporate transactions.",
    fullDescription:
      "Our corporate law practice provides comprehensive legal guidance to businesses of all sizes — from emerging startups to established multinational corporations. We navigate the intricate landscape of corporate governance, mergers and acquisitions, joint ventures, and restructuring with precision and foresight. Every transaction is approached with a commitment to protecting your interests while advancing your strategic objectives.",
    services: [
      "Mergers & Acquisitions",
      "Corporate Governance",
      "Joint Ventures & Strategic Alliances",
      "Corporate Restructuring",
      "Due Diligence",
      "Shareholder Agreements",
      "Board Advisory",
    ],
    approach:
      "We take a holistic approach to corporate law, understanding that every business decision carries legal implications. Our team works alongside your leadership to anticipate challenges, identify opportunities, and structure transactions that align with your long-term vision.",
    faqs: [
      {
        question: "What is involved in a merger or acquisition?",
        answer:
          "An M&A transaction typically involves due diligence, valuation, negotiation, regulatory compliance review, drafting of definitive agreements, and post-closing integration support. We guide clients through every stage.",
      },
      {
        question: "How can corporate governance protect my business?",
        answer:
          "Strong governance structures — including well-drafted bylaws, clear officer/director duties, and robust compliance policies — reduce risk, improve decision-making, and enhance investor confidence.",
      },
      {
        question: "When should I seek legal counsel for a business transaction?",
        answer:
          "Ideally, legal counsel should be engaged at the earliest stages of any significant transaction. Early involvement helps identify potential issues and structure deals to minimize risk.",
      },
    ],
    imageUrl: "/images/practice-areas/corporate-law.jpg",
  },
  {
    id: "2",
    slug: "litigation-dispute-resolution",
    number: "02",
    title: "Litigation & Dispute Resolution",
    shortDescription:
      "Vigorous advocacy in courtroom proceedings and sophisticated alternative dispute resolution.",
    fullDescription:
      "When disputes arise, our litigation practice delivers decisive, strategic advocacy. We handle complex commercial disputes, contractual claims, and high-stakes litigation across state and federal courts. Our approach combines thorough preparation, incisive legal analysis, and persuasive courtroom skills. Where appropriate, we pursue alternative dispute resolution methods including mediation and arbitration to achieve favorable outcomes efficiently.",
    services: [
      "Commercial Litigation",
      "Contract Disputes",
      "Class Action Defense",
      "Appellate Advocacy",
      "Mediation & Arbitration",
      "Injunctive Relief",
      "Pre-Litigation Strategy",
    ],
    approach:
      "Our litigation philosophy balances aggressive advocacy with pragmatic strategy. We evaluate every case through the lens of our client's business objectives, pursuing the path — whether trial, settlement, or ADR — that delivers the optimal outcome.",
    faqs: [
      {
        question: "What is the difference between litigation and arbitration?",
        answer:
          "Litigation takes place in public courts with formal procedures and potential jury trials. Arbitration is a private process where a neutral arbitrator renders a binding or non-binding decision, often faster and more confidential.",
      },
      {
        question: "How long does a typical commercial lawsuit take?",
        answer:
          "Timelines vary significantly based on complexity, jurisdiction, and the parties involved. Simple disputes may resolve in months; complex commercial cases can extend over several years. We work to resolve matters as efficiently as possible.",
      },
      {
        question: "What should I do if I receive a demand letter or lawsuit?",
        answer:
          "Contact legal counsel immediately. Early assessment allows us to preserve evidence, evaluate defenses, explore early resolution, and develop a comprehensive litigation strategy.",
      },
    ],
    imageUrl: "/images/practice-areas/litigation.jpg",
  },
  {
    id: "3",
    slug: "real-estate-law",
    number: "03",
    title: "Real Estate Law",
    shortDescription:
      "Comprehensive legal services for commercial and residential real estate transactions.",
    fullDescription:
      "Our real estate practice serves developers, investors, landlords, tenants, and homeowners across the full spectrum of property transactions. From high-value commercial acquisitions to residential closings, we provide meticulous attention to detail, thorough title review, and strategic negotiation. We understand that real estate transactions represent significant financial commitments, and we protect those investments at every turn.",
    services: [
      "Commercial & Residential Acquisitions",
      "Real Estate Finance & Lending",
      "Lease Negotiation & Review",
      "Land Use & Zoning",
      "Title Examination & Insurance",
      "Construction Contracts",
      "Property Tax Appeals",
    ],
    approach:
      "Real estate law demands precision. We combine deep market knowledge with meticulous legal analysis to ensure every transaction is structured to protect your investment and achieve your objectives.",
    faqs: [
      {
        question: "What is title insurance and why do I need it?",
        answer:
          "Title insurance protects you against losses arising from defects in the title to your property — such as unknown liens, encumbrances, or ownership disputes — that existed before your purchase.",
      },
      {
        question: "What should I review before signing a commercial lease?",
        answer:
          "Key areas include rent structure, escalation clauses, maintenance responsibilities, permitted use, assignment/subletting rights, default provisions, and exit options. We review every clause to protect your interests.",
      },
      {
        question: "How does zoning affect my property development plans?",
        answer:
          "Zoning laws dictate what can be built on a property, including use type, density, height, and setbacks. We help navigate zoning requirements, variances, and land use approvals for your project.",
      },
    ],
    imageUrl: "/images/practice-areas/real-estate.jpg",
  },
  {
    id: "4",
    slug: "intellectual-property",
    number: "04",
    title: "Intellectual Property",
    shortDescription:
      "Protection and enforcement of patents, trademarks, copyrights, and trade secrets.",
    fullDescription:
      "Intellectual property is often a company's most valuable asset. Our IP practice helps clients identify, protect, and enforce their intellectual property rights. From trademark registration and patent prosecution to IP licensing and infringement litigation, we develop comprehensive strategies that safeguard innovation and creative works in an increasingly competitive global marketplace.",
    services: [
      "Trademark Registration & Prosecution",
      "Patent Strategy & Prosecution",
      "Copyright Protection",
      "Trade Secret Protection",
      "IP Licensing & Commercialization",
      "IP Litigation & Enforcement",
      "IP Due Diligence",
    ],
    approach:
      "We take a proactive approach to IP, helping clients build robust portfolios that create competitive advantages and generate revenue through licensing and commercialization, while vigorously defending against infringement.",
    faqs: [
      {
        question: "What is the difference between a trademark and a patent?",
        answer:
          "Trademarks protect brand identifiers (names, logos, slogans) that distinguish goods or services. Patents protect inventions — new, useful, and non-obvious processes, machines, or compositions of matter — for a limited period.",
      },
      {
        question: "How long does trademark registration take?",
        answer:
          "The USPTO registration process typically takes 8–12 months if there are no substantive objections. We help streamline the process with thorough pre-filing searches and precise applications.",
      },
      {
        question: "What steps should I take to protect a trade secret?",
        answer:
          "Implement confidentiality agreements, restrict access on a need-to-know basis, mark documents as confidential, use technical security measures, and conduct regular audits of your information security practices.",
      },
    ],
    imageUrl: "/images/practice-areas/intellectual-property.jpg",
  },
  {
    id: "5",
    slug: "family-law",
    number: "05",
    title: "Family Law",
    shortDescription:
      "Compassionate, discreet guidance through divorce, custody, and estate planning matters.",
    fullDescription:
      "Family law matters demand sensitivity, discretion, and deep legal expertise. Our practice handles divorce and separation, child custody and support, prenuptial and postnuptial agreements, adoption, and estate planning with the same rigor we bring to complex commercial matters. We understand the emotional weight these issues carry and provide steady, thoughtful counsel that protects your family's interests and future.",
    services: [
      "Divorce & Separation",
      "Child Custody & Support",
      "Prenuptial & Postnuptial Agreements",
      "Adoption Proceedings",
      "Estate Planning & Trusts",
      "Guardianship",
      "Domestic Violence Protection",
    ],
    approach:
      "We prioritize resolution over confrontation wherever possible, using mediation and collaborative law approaches to minimize the emotional and financial toll on families. When litigation is necessary, we advocate with strength and discretion.",
    faqs: [
      {
        question: "How is child custody determined?",
        answer:
          "Courts consider the best interests of the child, evaluating factors such as parental fitness, the child's wishes (depending on age), stability of home environment, and each parent's ability to foster the child's relationship with the other parent.",
      },
      {
        question: "What is a prenuptial agreement?",
        answer:
          "A prenuptial agreement is a contract entered into before marriage that outlines how assets, debts, and spousal support will be handled in the event of divorce. It provides clarity and protection for both parties.",
      },
      {
        question: "How long does the divorce process take?",
        answer:
          "Timelines depend on whether the divorce is contested or uncontested, the complexity of asset division, custody disputes, and court schedules. Uncontested divorces may resolve in a few months; contested cases can take significantly longer.",
      },
    ],
    imageUrl: "/images/practice-areas/family-law.jpg",
  },
  {
    id: "6",
    slug: "regulatory-compliance",
    number: "06",
    title: "Regulatory & Compliance",
    shortDescription:
      "Navigating complex regulatory frameworks with strategic compliance programs.",
    fullDescription:
      "In an era of increasing regulatory complexity, businesses need proactive compliance strategies. Our regulatory practice helps organizations navigate industry-specific regulations, government investigations, and enforcement actions. We design and implement compliance programs that meet legal requirements while supporting business objectives, and we represent clients in regulatory proceedings with deep knowledge of administrative law and government relations.",
    services: [
      "Compliance Program Design",
      "Government Investigations",
      "Regulatory Filings & Approvals",
      "Industry-Specific Compliance (Healthcare, Finance, Tech)",
      "Anti-Corruption & FCPA",
      "Data Privacy & GDPR/CCPA",
      "Environmental Compliance",
    ],
    approach:
      "We believe compliance should be an enabler, not an obstacle. Our team works to build programs that integrate seamlessly into your operations, reduce risk, and create a culture of compliance that protects your organization from regulatory exposure.",
    faqs: [
      {
        question: "What is a compliance program?",
        answer:
          "A compliance program is a set of internal policies, procedures, and controls designed to ensure an organization adheres to legal requirements, industry standards, and ethical practices. It typically includes training, monitoring, reporting mechanisms, and enforcement procedures.",
      },
      {
        question: "What should I do if I receive a government subpoena?",
        answer:
          "Contact legal counsel immediately before responding. We assess the scope, preserve relevant documents, communicate with the issuing authority, and develop a response strategy that protects your rights.",
      },
      {
        question:
          "How does data privacy regulation affect my business?",
        answer:
          "Regulations like GDPR and CCPA impose obligations around data collection, processing, storage, and sharing. Non-compliance can result in significant fines. We help businesses understand their obligations and implement compliant data practices.",
      },
    ],
    imageUrl: "/images/practice-areas/regulatory-compliance.jpg",
  },
];
