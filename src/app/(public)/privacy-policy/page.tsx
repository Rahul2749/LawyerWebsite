import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Raja Agrawal, Advocate & Legal Consultant.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <section className="pt-32 pb-12 lg:pt-36 lg:pb-16 bg-bg-secondary">
        <div className="container max-w-3xl">
          <p className="text-eyebrow text-accent-gold mb-4">Legal</p>
          <h1 className="text-h2">Privacy Policy</h1>
          <p className="text-caption text-text-secondary mt-4">
            Last updated: January 1, 2024
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container max-w-3xl prose">
          <h2>Introduction</h2>
          <p>
            Raja Agrawal, Advocate & Legal Consultant (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) respects
            your privacy and is committed to protecting your personal data.
            This privacy policy explains how we collect, use, disclose, and
            safeguard your information when you visit our website.
          </p>

          <h2>Information We Collect</h2>
          <h3>Information You Provide</h3>
          <p>We may collect personal information that you voluntarily provide, including:</p>
          <ul>
            <li>Name, email address, phone number, and mailing address</li>
            <li>Information submitted through our consultation request form</li>
            <li>Communication preferences</li>
          </ul>

          <h3>Automatically Collected Information</h3>
          <p>When you visit our website, we may automatically collect:</p>
          <ul>
            <li>Browser type and version</li>
            <li>Operating system</li>
            <li>Pages visited and time spent</li>
            <li>Referring website</li>
            <li>IP address (anonymized where possible)</li>
          </ul>

          <h2>How We Use Your Information</h2>
          <p>We use collected information to:</p>
          <ul>
            <li>Respond to consultation requests and inquiries</li>
            <li>Improve our website and services</li>
            <li>Comply with legal obligations</li>
            <li>Communicate with you about your matter (with your consent)</li>
          </ul>

          <h2>Data Retention</h2>
          <p>
            We retain personal data only as long as necessary to fulfill the
            purposes for which it was collected, or as required by law.
            Consultation form data is retained for 24 months unless an
            engagement is established.
          </p>

          <h2>Your Rights</h2>
          <p>Depending on your jurisdiction, you may have the right to:</p>
          <ul>
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Object to or restrict processing</li>
            <li>Data portability</li>
          </ul>

          <h2>Data Deletion Requests</h2>
          <p>
            To request deletion of your personal data, please contact us at{" "}
            <a href="mailto:privacy@alexandermitchell.law">
              privacy@alexandermitchell.law
            </a>
            . We will respond within 30 days.
          </p>

          <h2>Cookies</h2>
          <p>
            Our website uses essential cookies for functionality and, with your
            consent, analytics cookies to improve our services. See our{" "}
            <a href="/cookie-policy">Cookie Policy</a> for details.
          </p>

          <h2>Contact</h2>
          <p>
            For privacy-related inquiries, contact us at{" "}
            <a href="mailto:privacy@alexandermitchell.law">
              privacy@alexandermitchell.law
            </a>
            .
          </p>
        </div>
      </section>
    </>
  );
}
