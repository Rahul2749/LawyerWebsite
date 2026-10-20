"use client";

import ScrollReveal from "@/components/ui/ScrollReveal";
import TeamMembers from "@/components/home/TeamMembers";

const consultancyFeatures = [
  {
    step: "01",
    title: "1-on-1 Confidential Legal Session",
    description: "Direct video or telephonic session with experienced advocates tailored to your practice area in complete privacy.",
  },
  {
    step: "02",
    title: "Document Analysis & Scrutiny",
    description: "Rigorous legal review of contracts, court notices, property deeds, or case records by our specialized team prior to advising.",
  },
  {
    step: "03",
    title: "Strategic Action Roadmap",
    description: "Clear, step-by-step legal guidance outlining your rights, statutory options, risk assessment, and recommended next steps.",
  },
  {
    step: "04",
    title: "Transparent & Timely Counsel",
    description: "Clear flat pricing, honest advice without legal jargon, and end-to-end follow-up for every client.",
  },
];

export default function AboutSection() {
  return (
    <section
      id="about"
      className="section relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0e1c38 0%, #162a52 100%)" }}
    >
      {/* Decorative background grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #FFD700 1px, transparent 0)`,
          backgroundSize: "36px 36px",
        }}
        aria-hidden="true"
      />

      <div className="container relative z-10">
        <ScrollReveal animation="fade-up" className="space-y-8 lg:space-y-10">
          <div className="grid items-start gap-5 lg:grid-cols-12 lg:gap-12">
            <div className="min-w-0 lg:col-span-5">
              <p className="text-eyebrow text-[#FFD700] mb-3">About The Firm</p>
              <h2 className="text-h2 text-[#F7F4EE]">
                Nyaysaathi — <span className="italic text-[#FFD700]">Your Partner in Justice</span>
              </h2>
            </div>
            <div className="min-w-0 lg:col-span-7">
              <p className="text-body text-[#F7F4EE]/85 leading-relaxed mb-4">
                Nyaysaathi is a premier multi-disciplinary law firm built on unwavering integrity,
                strategic courtroom prowess, and comprehensive legal solutions. Our practice unites a panel of
                experienced advocates, senior litigators, and specialized legal researchers across civil, criminal,
                corporate, property, and cyber law jurisdictions.
              </p>

              <p className="text-body text-[#F7F4EE]/80 leading-relaxed">
                We represent individual clients, entrepreneurs, and established enterprises before District Courts,
                High Courts, and specialized tribunals across India. Every matter is analyzed with collaborative rigor
                to formulate targeted, outcome-driven legal remedies.
              </p>
            </div>
          </div>

          <div className="grid gap-6 border-y border-[#C9A84C]/20 py-6 md:grid-cols-12 md:gap-8 lg:py-7">
            <div className="min-w-0 md:col-span-7">
              <h3 className="mb-3 font-serif text-2xl font-semibold text-[#F7F4EE]">Our Approach</h3>
              <div className="space-y-3 text-sm leading-relaxed text-[#F7F4EE]/80">
                <p>
                  Every legal matter requires careful consideration, sound legal research, and a strategy
                  suited to its specific circumstances. Our practice emphasizes detailed case analysis,
                  precise drafting, procedural compliance, and effective advocacy to help clients understand
                  their legal rights, obligations, and available remedies.
                </p>
                <p>
                  With a commitment to <strong className="font-medium text-[#F7F4EE]">professional integrity,
                  confidentiality, diligence, and client-focused legal service</strong>, our team strives to
                  provide practical legal guidance and pursue appropriate legal remedies in accordance with the law.
                </p>
              </div>
            </div>
            <div className="min-w-0 border-t border-white/10 pt-6 md:col-span-5 md:border-t-0 md:border-l md:pl-8 md:pt-0">
              <h3 className="mb-3 font-serif text-2xl font-semibold text-[#F7F4EE]">Our Commitment</h3>
              <p className="text-sm leading-relaxed text-[#F7F4EE]/80">
                Our objective is to make legal assistance accessible, transparent, and professionally
                delivered, while safeguarding the legal rights and interests of our clients through
                responsible legal advice and representation.
              </p>
              <p className="mt-4 font-serif text-lg italic leading-relaxed text-[#FFD700]">
                Your Rights. Our Commitment. Professional Legal Guidance.
              </p>
            </div>
          </div>

          <TeamMembers />

          <div className="rounded-2xl border border-[#C9A84C]/20 bg-white/[0.03] p-5 sm:p-6">
            <div className="mb-5 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <p className="text-eyebrow text-[#FFD700] mb-2">Legal Guidance Process</p>
                <h3 className="text-h3 text-[#F7F4EE]">How Nyaysaathi Serves You</h3>
              </div>
              <a href="/consultation" className="btn btn-primary whitespace-nowrap text-xs">
                Schedule Now
              </a>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {consultancyFeatures.map((item) => (
                <div
                  key={item.step}
                  className="group rounded-xl border border-[#C9A84C]/20 bg-white/[0.04] p-4 transition-colors hover:border-[#FFD700]/60 hover:bg-white/[0.07]"
                >
                  <span className="text-xs font-mono font-semibold text-[#FFD700] mb-2 block">{item.step}</span>
                  <h4 className="font-serif text-sm font-semibold text-[#F7F4EE] group-hover:text-[#FFD700] transition-colors mb-2 leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-xs text-[#F7F4EE]/75 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 grid gap-4 border-t border-white/10 pt-5 sm:grid-cols-2">
              <div>
                <h4 className="mb-1 font-serif text-sm font-semibold text-[#FFD700]">Experienced Legal Panel</h4>
                <p className="text-xs leading-relaxed text-[#F7F4EE]/70">Specialized advocates across 18 practice areas ensuring targeted legal expertise.</p>
              </div>
              <div>
                <h4 className="mb-1 font-serif text-sm font-semibold text-[#FFD700]">Client Trust &amp; Ethics</h4>
                <p className="text-xs leading-relaxed text-[#F7F4EE]/70">Complete attorney-client privilege, transparent flat fees, and honest case appraisal.</p>
              </div>
            </div>
          </div>

        </ScrollReveal>
      </div>
    </section>
  );
}
