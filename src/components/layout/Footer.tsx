import Link from "next/link";
import Image from "next/image";
import { siteSettings } from "@/data/siteSettings";
import { practiceAreas } from "@/data/practiceAreas";

const footerLinks = {
  quickLinks: [
    { href: "/#about", label: "About" },
    { href: "/#services", label: "Legal Services" },
    { href: "/legal-services", label: "Service Guides" },
    { href: "/legal-help", label: "Legal Help" },
    { href: "/lawyer-fees", label: "Lawyer Fees" },
    // Hidden per request (code kept for future restoration)
    // { href: "/insights", label: "Legal Insights" },
    // { href: "/videos", label: "Legal Talks" },
    { href: "/consultation", label: "Book a Consultation" },
    { href: "/contact", label: "Contact" },
  ],
  legal: [
    { href: "/privacy-policy", label: "Privacy Policy" },
    { href: "/terms-of-use", label: "Terms of Use" },
    { href: "/cookie-policy", label: "Cookie Policy" },
    { href: "/disclaimer", label: "Attorney Advertising" },
  ],
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-bg-dark text-text-inverse" role="contentinfo">
      {/* Main Footer */}
      <div className="container py-16 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Column 1: Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4 group">
              <Image
                src="/nyaysaathi_logo.png"
                alt="Nyaysaathi Logo"
                width={44}
                height={44}
                className="w-11 h-11 rounded-full object-cover ring-1 ring-accent-gold/40 shadow-sm"
              />
              <div>
                <span className="font-serif text-2xl font-medium text-text-inverse group-hover:text-accent-gold transition-colors">
                  {siteSettings.firmName}
                </span>
                <span className="block text-[10px] uppercase tracking-[0.2em] text-accent-gold mt-0.5">
                  {siteSettings.firmTagline}
                </span>
              </div>
            </Link>
            <p className="text-sm text-text-inverse/60 leading-relaxed mt-4 max-w-xs">
              Trusted counsel for complex legal matters. Dedicated to
              delivering strategic solutions with unwavering integrity.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-eyebrow text-accent-gold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-inverse/70 hover:text-accent-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Practice Areas */}
          <div>
            <h3 className="text-eyebrow text-accent-gold mb-6">Practice Areas</h3>
            <ul className="space-y-3">
              {practiceAreas.map((area) => (
                <li key={area.slug}>
                  <Link
                    href={`/practice-areas/${area.slug}`}
                    className="text-sm text-text-inverse/70 hover:text-accent-gold transition-colors"
                  >
                    {area.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3 className="text-eyebrow text-accent-gold mb-6">Contact</h3>
            <div className="space-y-4 text-sm text-text-inverse/70">
              <p>
                <a
                  href={`mailto:${siteSettings.email}`}
                  className="hover:text-accent-gold transition-colors inline-flex items-center gap-2"
                >
                  <svg className="w-4 h-4 text-accent-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {siteSettings.email}
                </a>
              </p>
              <div className="pt-2 text-xs text-text-inverse/40">
                <p className="mb-2">Online legal consultation across India</p>
                <p>{siteSettings.officeHours.weekday}</p>
                <p>{siteSettings.officeHours.weekend}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-text-inverse/10">
        <div className="container pt-8 pb-12 lg:pb-16">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 mb-8">
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs text-text-inverse/40">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="hover:text-text-inverse/70 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <p className="text-xs text-text-inverse/40 text-center md:text-right">
              © {currentYear} {siteSettings.firmName}. All rights reserved.
            </p>
          </div>

          {/* Attorney Advertising Disclaimer */}
          <div className="border-t border-text-inverse/5 pt-6">
            <p className="text-[11px] text-text-inverse/30 text-center md:text-left leading-relaxed max-w-5xl">
              Attorney Advertising. Prior results do not guarantee a similar
              outcome. This website is designed for general information only.
              The information presented at this site should not be construed to
              be formal legal advice nor the formation of a lawyer/client
              relationship.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
