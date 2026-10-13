import type { StaticImageData } from "next/image";
import rajaAgrawalPortrait from "../../public/images/raja-agrawal-portrait.webp";
import yatharthBadwaikPortrait from "../../public/images/yatharth-badwaik-portrait.webp";

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  portrait: StaticImageData;
  caption?: string;
  biography?: string;
}

// Add future members here; the member row and profile dialog use this list.
export const teamMembers: TeamMember[] = [
  {
    id: "raja-agrawal",
    name: "Adv. Raja Agrawal",
    role: "Advocate · Litigation & Dispute Resolution",
    portrait: rajaAgrawalPortrait,
    caption: "5+ years in civil, criminal, and corporate matters.",
    biography:
      "With 5+ years of dedicated practice in Indian courts, Adv. Raja Agrawal is a core member of Nyaysaathi, specializing in civil litigation, criminal defense, corporate disputes, and contract vetting. He brings meticulous preparation, sharp courtroom advocacy, and high-trust counsel to every client representation.",
  },
  {
    id: "yatharth-badwaik",
    name: "Yatharth Badwaik",
    role: "Firm member",
    portrait: yatharthBadwaikPortrait,
    caption: "A member of Nyaysaathi’s collaborative legal team.",
  },
];
