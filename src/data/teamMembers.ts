import type { StaticImageData } from "next/image";
import rajaAgrawalPortrait from "../../public/images/raja-agrawal-portrait.webp";
import yatharthBadwaikPortrait from "../../public/images/yatharth-badwaik-portrait.webp";
import prashantDahiwalePortrait from "../../public/images/prashant-dahiwale-portrait.webp";

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  portrait: StaticImageData;
  caption?: string;
  biography?: string;
}

// Add future members here; the wrapping team grid and profile dialog use this list.
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
    name: "Adv. Yatharth Badwaik",
    role: "Advocate · High Court & District Court Practice",
    portrait: yatharthBadwaikPortrait,
    caption:
      "5+ years in High Court, Criminal Law, Civil Litigation & DRT matters.",
    biography:
      "Advocate Yatharth Badwaik is a practicing Advocate with over *5 years of professional experience in legal practice*, appearing before the High Court and the District and Sessions Courts. The practice is dedicated to providing comprehensive legal consultancy, strategic legal advice, professional representation, and effective litigation support to individuals, families, and businesses.\n\nWith a primary focus on *Criminal Law, Civil Litigation, High Court Matters, Debt Recovery Tribunal (DRT) Matters, and Family Court Proceedings*, the practice offers legal assistance tailored to the specific facts, circumstances, and legal requirements of each case.",
  },
  {
    id: "prashant-shankar-dahiwale",
    name: "Adv. Prashant Shankar Dahiwale",
    role: "Advocate · Legal Research & Drafting",
    portrait: prashantDahiwalePortrait,
    caption: "Careful case analysis, legal drafting, and practical legal assistance.",
    biography:
      "Advocate Prashant Shankar Dahiwale is a dedicated and diligent legal professional committed to providing effective legal assistance, protecting clients' rights, and upholding the principles of justice and fairness. He possesses a keen interest in legal research, case analysis, drafting of legal documents, and court proceedings.\n\nWith a professional approach and a strong commitment to ethical legal practice, he strives to deliver practical and result-oriented legal solutions. His objective is to serve clients with integrity, sincerity, and professionalism while continuously enhancing his legal knowledge and expertise.",
  },
];
