import Link from "next/link";
import { siteSettings } from "@/data/siteSettings";
import { practiceAreas } from "@/data/practiceAreas";

const footerLinks = {
  quickLinks: [
    { href: "/about", label: "About" },
    { href: "/practice-areas", label: "Practice Areas" },
    { href: "/insights", label: "Legal Insights" },
    { href: "/videos", label: "Legal Talks" },
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
            <Link href="/" className="inline-block mb-4">
              <span className="font-serif text-2xl font-medium">
                {siteSettings.firmName}
              </span>
              <span className="block text-[10px] uppercase tracking-[0.2em] text-accent-gold mt-0.5">
                {siteSettings.firmTagline}
              </span>
            </Link>
            <p className="text-sm text-text-inverse/60 leading-relaxed mt-4 max-w-xs">
              Trusted counsel for complex legal matters. Dedicated to
              delivering strategic solutions with unwavering integrity.
            </p>
            {/* Social Links */}
            <div className="flex gap-4 mt-6">
              <a
                href={siteSettings.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 border border-text-inverse/20 flex items-center justify-center hover:border-accent-gold hover:text-accent-gold transition-colors"
                aria-label="LinkedIn"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href={siteSettings.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 border border-text-inverse/20 flex items-center justify-center hover:border-accent-gold hover:text-accent-gold transition-colors"
                aria-label="Twitter / X"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
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
              <p>{siteSettings.address.full}</p>
              <p>
                <a
                  href={`tel:${siteSettings.phone.replace(/\s/g, "")}`}
                  className="hover:text-accent-gold transition-colors"
                >
                  {siteSettings.phone}
                </a>
              </p>
              <p>
                <a
                  href={`mailto:${siteSettings.email}`}
                  className="hover:text-accent-gold transition-colors"
                >
                  {siteSettings.email}
                </a>
              </p>
              <div className="pt-2 text-xs text-text-inverse/40">
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
