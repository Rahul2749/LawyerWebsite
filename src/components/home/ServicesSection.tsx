"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { siteSettings } from "@/data/siteSettings";

// ─── Icon Map (Bold 2.0 stroke width for high contrast on gold badges) ──────
function ServiceIcon({ icon, className }: { icon: string; className?: string }) {
  const icons: Record<string, React.ReactNode> = {
    family: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    shield: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    building: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
      </svg>
    ),
    briefcase: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
      </svg>
    ),
    gavel: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
    laptop: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3" />
      </svg>
    ),
    star: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    ),
    users: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
  };

  return icons[icon] ?? icons.briefcase;
}

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("services-card--visible");
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );

    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="services"
      className="section relative overflow-hidden py-16 sm:py-20 lg:py-28"
      style={{ background: "linear-gradient(180deg, #071224 0%, #0d1e3c 50%, #071224 100%)" }}
      aria-labelledby="services-heading"
    >
      {/* Faint Architectural Line Pattern */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1.5px 1.5px, #FFD700 1px, transparent 0)`,
          backgroundSize: "36px 36px",
        }}
        aria-hidden="true"
      />

      {/* Subtle Central Glow Behind Heading */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-[#C9A84C]/15 to-transparent blur-3xl pointer-events-none" />

      <div className="container relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <p className="text-xs uppercase tracking-[0.2em] font-sans font-semibold text-[#FFD700] mb-3">
            OUR EXPERTISE
          </p>
          <h2 id="services-heading" className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#F7F4EE]">
            Legal{" "}
            <span className="italic bg-gradient-to-r from-[#FFD700] via-[#F5D061] to-[#C9A84C] bg-clip-text text-transparent">
              Services
            </span>
          </h2>
          <p className="text-sm sm:text-base text-[#F7F4EE]/75 mt-3 sm:mt-4 mx-auto max-w-xl leading-relaxed px-2">
            Comprehensive legal expertise across 18 specialized practice areas.
            Select a service below to book a confidential consultation.
          </p>

          {/* Center-origin expanding gold divider */}
          <div className="flex items-center justify-center gap-3 mt-5 sm:mt-6" aria-hidden="true">
            <div className="h-[1.5px] w-16 sm:w-20 bg-gradient-to-r from-transparent via-[#FFD700]/50 to-transparent" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#FFD700] shadow-[0_0_10px_rgba(255,215,0,0.8)]" />
            <div className="h-[1.5px] w-16 sm:w-20 bg-gradient-to-r from-transparent via-[#FFD700]/50 to-transparent" />
          </div>
        </div>

        {/* Services Grid (Responsive 3 Columns Desktop, 2 Tablet, 1 Mobile) */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8"
          role="list"
        >
          {siteSettings.services.map((service, index) => (
            <div
              key={service.id}
              ref={(el) => {
                if (el) cardsRef.current[index] = el;
              }}
              role="listitem"
              className="services-card h-full"
              style={{ "--delay": `${(index % 3) * 0.12}s` } as React.CSSProperties}
            >
              <Link
                href={`/consultation?service=${service.slug}`}
                className="services-card__inner group flex flex-col justify-between h-full p-6 sm:p-7 lg:p-9"
                aria-label={`Book ${service.name} consultation`}
              >
                <div>
                  {/* Top: Solid Metallic Gold Badge Icon Container */}
                  <div className="services-card__icon-wrap mb-5 sm:mb-6" aria-hidden="true">
                    <ServiceIcon
                      icon={service.icon}
                      className="w-6 h-6 sm:w-7 sm:h-7 services-card__icon"
                    />
                  </div>

                  {/* Title & Description */}
                  <h3 className="services-card__title text-xl sm:text-[22px] lg:text-[23px] font-serif font-semibold text-[#F7F4EE] leading-snug mb-2.5">
                    {service.name}
                  </h3>
                  <p className="services-card__desc text-xs sm:text-[14px] lg:text-[15px] text-[#F7F4EE]/75 leading-relaxed mb-5 sm:mb-6">
                    {service.description}
                  </p>

                  {/* Bulleted Focus List */}
                  {service.highlights && service.highlights.length > 0 && (
                    <ul className="services-card__list space-y-2 sm:space-y-2.5 mb-6 sm:mb-8 pt-4 sm:pt-5 border-t border-white/10">
                      {service.highlights.map((item, i) => (
                        <li
                          key={i}
                          className="group/item flex items-center gap-2.5 sm:gap-3 text-xs sm:text-[13px] lg:text-[14px] text-[#F7F4EE]/90 transition-transform duration-300 hover:translate-x-1.5 cursor-default"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#FFD700] shadow-[0_0_8px_rgba(255,215,0,0.7)] flex-shrink-0 group-hover/item:scale-125 transition-transform" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Refined Bottom CTA */}
                <div className="services-card__footer pt-4 border-t border-white/10 flex items-center justify-between mt-auto">
                  <span className="text-xs font-semibold tracking-wider uppercase text-[#FFD700] group-hover:text-white transition-colors">
                    Book Consultation
                  </span>
                  <span className="services-card__cta flex items-center" aria-hidden="true">
                    <svg
                      className="w-4 h-4 text-[#FFD700] transition-transform duration-300 group-hover:translate-x-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 lg:mt-20">
          <p className="text-base text-[#F7F4EE]/75 mb-6">
            Not sure which area applies to your situation?
          </p>
          <Link
            href="/consultation"
            className="btn btn-primary inline-flex items-center gap-2"
            style={{
              background: "linear-gradient(135deg, #FFD700 0%, #C9A84C 100%)",
              color: "#071224",
              fontWeight: 700,
              padding: "0.95rem 2.5rem",
              fontSize: "0.8125rem",
              letterSpacing: "0.08em",
              borderRadius: "10px",
              boxShadow: "0 4px 25px rgba(255, 215, 0, 0.25)",
            }}
          >
            <span>Book a General Consultation</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Scoped CSS for Luxury Component Interactions */}
      <style jsx>{`
        .services-card {
          opacity: 0;
          transform: translateY(32px);
          transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1),
            transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          transition-delay: var(--delay, 0s);
        }

        .services-card--visible {
          opacity: 1;
          transform: translateY(0);
        }

        .services-card__inner {
          background: rgba(15, 30, 58, 0.75);
          border: 1px solid rgba(201, 168, 76, 0.25);
          border-radius: 18px;
          text-decoration: none;
          color: inherit;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: pointer;
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(12px);
          box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
        }

        /* Subtle Shimmer Ray on Hover */
        .services-card__inner::after {
          content: "";
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            45deg,
            transparent 45%,
            rgba(255, 215, 0, 0.1) 50%,
            transparent 55%
          );
          transform: translateX(-100%) translateY(-100%);
          transition: transform 0.8s ease;
          pointer-events: none;
        }

        .services-card__inner:hover::after {
          transform: translateX(100%) translateY(100%);
        }

        .services-card__inner:hover {
          background: rgba(22, 42, 80, 0.88);
          border-color: rgba(255, 215, 0, 0.7);
          transform: translateY(-8px);
          box-shadow: 0 20px 45px rgba(0, 0, 0, 0.4), 0 0 30px rgba(255, 215, 0, 0.2);
        }

        /* Solid Metallic Gold Badge Container with High Contrast Dark Icon */
        .services-card__icon-wrap {
          width: 64px;
          height: 64px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #F5D061 0%, #C9A84C 60%, #9E792F 100%);
          border: 1px solid #FFE082;
          box-shadow: 0 4px 15px rgba(201, 168, 76, 0.35);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .services-card__inner:hover .services-card__icon-wrap {
          background: linear-gradient(135deg, #FFE082 0%, #F5D061 60%, #C9A84C 100%);
          border-color: #FFFFFF;
          box-shadow: 0 0 25px rgba(255, 215, 0, 0.6);
          transform: scale(1.08) rotate(2deg);
        }

        .services-card__icon {
          color: #071224;
          transition: transform 0.4s ease;
        }

        .services-card__inner:hover .services-card__icon {
          transform: scale(1.1);
        }

        .services-card__title {
          transition: color 0.3s ease;
        }

        .services-card__inner:hover .services-card__title {
          color: #FFD700;
        }
      `}</style>
    </section>
  );
}
