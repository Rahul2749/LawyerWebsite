"use client";

import ScrollReveal from "@/components/ui/ScrollReveal";

const consultancyFeatures = [
  {
    step: "01",
    title: "1-on-1 Confidential Consultation",
    description: "Direct video or telephonic session with Advocate Raja Agrawal to discuss your legal matter in complete privacy.",
  },
  {
    step: "02",
    title: "Document Analysis & Review",
    description: "Detailed legal scrutiny of agreements, court notices, deeds, or case papers prior to advising.",
  },
  {
    step: "03",
    title: "Strategic Action Roadmap",
    description: "Clear, step-by-step legal guidance outlining your rights, legal options, and recommended next steps.",
  },
  {
    step: "04",
    title: "Transparent & Timely Counsel",
    description: "Prompt scheduling with clear, honest counsel and practical legal solutions without complex jargon.",
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
          
          {/* Left Column: Concise About Me */}
          <div className="lg:col-span-5">
            <p className="text-eyebrow text-[#FFD700] mb-3">About The Practice</p>
            <h2 className="text-h2 text-[#F7F4EE] mb-6">Advocate Raja Agrawal</h2>
            
            <p className="text-body text-[#F7F4EE]/80 leading-relaxed mb-5">
              With over 5 years of dedicated practice across Indian courts and corporate advisory, 
              I provide strategic, result-oriented legal counsel built on three core pillars: 
              meticulous preparation, honest advocacy, and client confidentiality.
            </p>
            
            <p className="text-body text-[#F7F4EE]/80 leading-relaxed mb-8">
              Whether navigating complex litigation, property disputes, or corporate agreements, 
              every client receives direct personal attention and practical legal strategies tailored to their objectives.
            </p>

            <div className="p-6 bg-white/[0.04] border border-[#C9A84C]/25 rounded-xl backdrop-blur-sm">
              <h4 className="font-serif text-base font-semibold text-[#FFD700] mb-2">Core Principle</h4>
              <p className="text-xs text-[#F7F4EE]/75 leading-relaxed">
                Clear communication, objective risk assessment, and unwavering representation from initial consultation to resolution.
              </p>
            </div>
          </div>

          {/* Right Column: How We Provide Consultancy */}
          <div className="lg:col-span-7 bg-white/[0.03] p-8 lg:p-10 rounded-2xl border border-[#C9A84C]/20 backdrop-blur-md">
            <p className="text-eyebrow text-[#FFD700] mb-2">Legal Guidance Process</p>
            <h3 className="text-h3 text-[#F7F4EE] mb-6">How We Provide Consultancy</h3>

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
          </div>

        </ScrollReveal>
      </div>
    </section>
  );
}
