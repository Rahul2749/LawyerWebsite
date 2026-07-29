export interface Video {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  durationSeconds: number;
  thumbnailUrl: string;
  videoUrl: string;
  publishedAt: string;
  practiceAreaSlug?: string;
}

export const videoCategories = [
  "All",
  "Legal Commentary",
  "Client Education",
  "Industry Analysis",
  "Q&A",
] as const;

export const videos: Video[] = [
  {
    id: "1",
    slug: "understanding-corporate-liability",
    title: "Understanding Corporate Liability: What Every Business Owner Needs to Know",
    description:
      "In this comprehensive overview, Raja Agrawal explains the fundamentals of corporate liability, the protections offered by various business structures, and common mistakes that can expose business owners to personal liability.",
    category: "Client Education",
    duration: "18:42",
    durationSeconds: 1122,
    thumbnailUrl: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=800&auto=format&fit=crop",
    videoUrl: "https://www.youtube.com/embed/LXb3EKWsInQ",
    publishedAt: "2024-11-01",
    practiceAreaSlug: "corporate-law",
  },
  {
    id: "2",
    slug: "navigating-commercial-real-estate-transactions",
    title: "Navigating Commercial Real Estate Transactions",
    description:
      "A detailed walkthrough of the commercial real estate transaction process — from letter of intent through closing — with practical tips for buyers, sellers, and investors.",
    category: "Client Education",
    duration: "24:15",
    durationSeconds: 1455,
    thumbnailUrl: "/images/videos/real-estate-transactions-thumb.jpg",
    videoUrl: "#",
    publishedAt: "2024-10-15",
    practiceAreaSlug: "real-estate-law",
  },
  {
    id: "3",
    slug: "regulatory-landscape-2024-key-changes",
    title: "The Regulatory Landscape: Key Changes Businesses Should Watch",
    description:
      "An analysis of the most significant regulatory developments affecting businesses, including data privacy, antitrust enforcement, and industry-specific compliance requirements.",
    category: "Industry Analysis",
    duration: "31:08",
    durationSeconds: 1868,
    thumbnailUrl: "/images/videos/regulatory-landscape-thumb.jpg",
    videoUrl: "#",
    publishedAt: "2024-09-20",
    practiceAreaSlug: "regulatory-compliance",
  },
  {
    id: "4",
    slug: "legal-qa-intellectual-property-startups",
    title: "Legal Q&A: Intellectual Property Basics for Startups",
    description:
      "Answering the most common intellectual property questions from startup founders — covering trademarks, patents, copyrights, trade secrets, and the steps every new business should take to protect its IP.",
    category: "Q&A",
    duration: "22:30",
    durationSeconds: 1350,
    thumbnailUrl: "/images/videos/ip-startups-thumb.jpg",
    videoUrl: "#",
    publishedAt: "2024-08-05",
    practiceAreaSlug: "intellectual-property",
  },
];
