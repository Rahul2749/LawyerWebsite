"use client";

import ScrollReveal from "@/components/ui/ScrollReveal";

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
        <ScrollReveal animation="fade-up" className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: The Firm & Team Details */}
          <div className="lg:col-span-6">
            <p className="text-eyebrow text-[#FFD700] mb-3">About The Firm</p>
            <h2 className="text-h2 text-[#F7F4EE] mb-6">
              Nyaysaathi — <span className="italic text-[#FFD700]">Your Partner in Justice</span>
            </h2>
            
            <p className="text-body text-[#F7F4EE]/85 leading-relaxed mb-5">
              Nyaysaathi is a premier multi-disciplinary law firm built on unwavering integrity, 
              strategic courtroom prowess, and comprehensive legal solutions. Our practice unites a panel of 
              experienced advocates, senior litigators, and specialized legal researchers across civil, criminal, 
              corporate, property, and cyber law jurisdictions.
            </p>
            
            <p className="text-body text-[#F7F4EE]/80 leading-relaxed mb-8">
              We represent individual clients, entrepreneurs, and established enterprises before District Courts, 
              High Courts, and specialized tribunals across India. Every matter is analyzed with collaborative rigor 
              to formulate targeted, outcome-driven legal remedies.
            </p>

            {/* Member Spotlight: Advocate Raja Agrawal */}
            <div className="p-6 bg-white/[0.05] border border-[#C9A84C]/35 rounded-2xl backdrop-blur-md relative overflow-hidden mb-6">
              <div className="absolute top-0 right-0 px-3 py-1 bg-[#C9A84C]/20 border-b border-l border-[#C9A84C]/40 rounded-bl-lg text-[10px] font-mono uppercase tracking-wider text-[#FFD700]">
                Key Member of Firm
              </div>
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-full bg-[#C9A84C]/20 border border-[#FFD700]/40 flex items-center justify-center text-lg font-serif text-[#FFD700] font-bold">
                  RA
                </div>
                <div>
                  <h4 className="font-serif text-lg font-semibold text-[#F7F4EE]">Advocate Raja Agrawal</h4>
                  <p className="text-xs text-[#FFD700] tracking-wide">Litigation &amp; Dispute Resolution Counsel</p>
                </div>
              </div>
              <p className="text-xs text-[#F7F4EE]/80 leading-relaxed">
                With 5+ years of dedicated practice in Indian courts, Adv. Raja Agrawal is a core member of Nyaysaathi, 
                specializing in civil litigation, criminal defense, corporate disputes, and contract vetting. He brings 
                meticulous preparation, sharp courtroom advocacy, and high-trust counsel to every client representation.
              </p>
            </div>

            {/* Firm Trust Pillars */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/[0.03] border border-white/10 rounded-xl">
                <h5 className="font-serif text-sm font-semibold text-[#FFD700] mb-1">Experienced Legal Panel</h5>
                <p className="text-[11px] text-[#F7F4EE]/70">Specialized advocates across 18 practice areas ensuring targeted legal expertise.</p>
              </div>
              <div className="p-4 bg-white/[0.03] border border-white/10 rounded-xl">
                <h5 className="font-serif text-sm font-semibold text-[#FFD700] mb-1">Client Trust &amp; Ethics</h5>
                <p className="text-[11px] text-[#F7F4EE]/70">Complete attorney-client privilege, transparent flat fees, and honest case appraisal.</p>
              </div>
            </div>
          </div>

          {/* Right Column: How We Provide Consultancy */}
          <div className="lg:col-span-6 bg-white/[0.03] p-8 lg:p-10 rounded-2xl border border-[#C9A84C]/20 backdrop-blur-md">
            <p className="text-eyebrow text-[#FFD700] mb-2">Legal Guidance Process</p>
            <h3 className="text-h3 text-[#F7F4EE] mb-6">How Nyaysaathi Serves You</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {consultancyFeatures.map((item) => (
                <div
                  key={item.step}
                  className="p-5 bg-white/[0.04] border border-[#C9A84C]/20 rounded-xl hover:border-[#FFD700]/60 hover:bg-white/[0.07] transition-all duration-300 group"
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

            <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <p className="text-xs text-[#F7F4EE]/90 font-medium">Have an urgent legal matter?</p>
                <p className="text-[11px] text-[#F7F4EE]/60">Book a direct consultation with our panel of advocates.</p>
              </div>
              <a
                href="/consultation"
                className="btn btn-primary bg-accent-wine hover:bg-accent-wine-hover text-xs py-2.5 px-6 whitespace-nowrap"
              >
                Schedule Now
              </a>
            </div>
          </div>

        </ScrollReveal>
      </div>
    </section>
  );
}
