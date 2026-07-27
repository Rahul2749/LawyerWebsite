import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "Cookie Policy for the Alexander Mitchell website.",
};

export default function CookiePolicyPage() {
  return (
    <>
      <section className="pt-40 pb-12 lg:pt-48 bg-bg-secondary">
        <div className="container max-w-3xl">
          <p className="text-eyebrow text-accent-gold mb-4">Legal</p>
          <h1 className="text-h2">Cookie Policy</h1>
          <p className="text-caption text-text-secondary mt-4">
            Last updated: January 1, 2024
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container max-w-3xl prose">
          <h2>What Are Cookies</h2>
          <p>
            Cookies are small text files stored on your device when you visit a
            website. They are widely used to make websites work more
            efficiently and provide information to site owners.
          </p>

          <h2>How We Use Cookies</h2>

          <h3>Essential Cookies</h3>
          <p>
            These cookies are necessary for the website to function and cannot
            be switched off. They are usually set in response to actions you
            take, such as setting privacy preferences or filling in forms.
          </p>

          <h3>Analytics Cookies</h3>
          <p>
            With your consent, we use privacy-respecting analytics to
            understand how visitors interact with our website. These cookies
            help us improve our website and your experience. We use
            privacy-focused analytics solutions that do not track you across
            websites.
          </p>

          <h3>Preference Cookies</h3>
          <p>
            These cookies remember your preferences, such as cookie consent
            choices, to provide a personalized experience.
          </p>

          <h2>Managing Cookies</h2>
          <p>
            You can manage your cookie preferences through the cookie consent
            banner that appears when you first visit our website. You can also
            control cookies through your browser settings. Note that blocking
            certain cookies may impact your experience.
          </p>

          <h2>Contact</h2>
          <p>
            For questions about our cookie practices, contact us at{" "}
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
