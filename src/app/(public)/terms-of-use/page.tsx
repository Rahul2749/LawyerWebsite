import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms of Use for the Raja Agrawal website.",
};

export default function TermsOfUsePage() {
  return (
    <>
      <section className="pt-32 pb-12 lg:pt-36 lg:pb-16 bg-bg-secondary">
        <div className="container max-w-3xl">
          <p className="text-eyebrow text-accent-gold mb-4">Legal</p>
          <h1 className="text-h2">Terms of Use</h1>
          <p className="text-caption text-text-secondary mt-4">
            Last updated: January 1, 2024
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container max-w-3xl prose">
          <h2>Acceptance of Terms</h2>
          <p>
            By accessing and using this website, you accept and agree to be
            bound by these Terms of Use. If you do not agree, please do not
            use this website.
          </p>

          <h2>No Attorney-Client Relationship</h2>
          <p>
            The information provided on this website is for general
            informational purposes only and does not constitute legal advice.
            Use of this website or submission of a consultation request does
            not create an attorney-client relationship. An attorney-client
            relationship is only formed through a signed engagement letter.
          </p>

          <h2>No Guarantee of Results</h2>
          <p>
            Any case results or testimonials presented on this website are not
            a guarantee of future results. Every legal matter is unique, and
            past outcomes do not predict or guarantee similar results in your
            case.
          </p>

          <h2>Intellectual Property</h2>
          <p>
            All content on this website — including text, graphics, logos,
            and images — is the property of Raja Agrawal, Attorney at
            Law, and is protected by applicable intellectual property laws.
            You may not reproduce, distribute, or use any content without
            prior written permission.
          </p>

          <h2>Limitation of Liability</h2>
          <p>
            This website and its content are provided &quot;as is&quot; without
            warranties of any kind. We shall not be liable for any damages
            arising from your use of or inability to use this website.
          </p>

          <h2>Governing Law</h2>
          <p>
            These terms shall be governed by and construed in accordance with
            the laws of the State of New York, without regard to its conflict
            of law provisions.
          </p>

          <h2>Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. Changes
            will be effective immediately upon posting. Your continued use of
            the website constitutes acceptance of the updated terms.
          </p>
        </div>
      </section>
    </>
  );
}
