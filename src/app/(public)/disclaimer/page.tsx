import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Attorney Advertising Disclaimer",
  description:
    "Attorney Advertising and Disclaimer for Raja Agrawal, Advocate & Legal Consultant.",
};

export default function DisclaimerPage() {
  return (
    <>
      <section className="pt-32 pb-12 lg:pt-36 lg:pb-16 bg-bg-secondary">
        <div className="container max-w-3xl">
          <p className="text-eyebrow text-accent-gold mb-4">Legal</p>
          <h1 className="text-h2">Attorney Advertising &amp; Disclaimer</h1>
        </div>
      </section>

      <section className="section">
        <div className="container max-w-3xl prose">
          <h2>Attorney Advertising</h2>
          <p>
            This website is designed for general information only. The
            information presented at this site should not be construed to be
            formal legal advice nor the formation of a lawyer/client
            relationship.
          </p>
          <p>
            The content of this website contains general information and may
            not reflect current legal developments, verdicts, or settlements.
            Prior results do not guarantee a similar outcome.
          </p>

          <h2>No Attorney-Client Relationship</h2>
          <p>
            Viewing this website, using information from this website, or
            communicating with Raja Agrawal through this website does not
            create an attorney-client relationship. An attorney-client
            relationship is only formed through the execution of a written
            engagement agreement.
          </p>

          <h2>No Guarantee of Results</h2>
          <p>
            Any testimonials or case results described on this website are not
            intended as a guarantee, warranty, or prediction regarding the
            outcome of your legal matter. Each case is different, and the
            results obtained in prior matters do not guarantee similar
            outcomes.
          </p>

          <h2>Jurisdictional Limitations</h2>
          <p>
            Raja Agrawal is admitted to practice law in the State of New
            York. This website may be considered advertising in some
            jurisdictions. The hiring of a lawyer is an important decision that
            should not be based solely on advertisements.
          </p>

          <h2>Confidentiality</h2>
          <p>
            Do not send confidential information through this website. Any
            information sent through this website before an attorney-client
            relationship is established may not be treated as confidential or
            privileged.
          </p>

          <h2>External Links</h2>
          <p>
            This website may contain links to third-party websites. We are not
            responsible for the content or privacy practices of those websites.
          </p>
        </div>
      </section>
    </>
  );
}
