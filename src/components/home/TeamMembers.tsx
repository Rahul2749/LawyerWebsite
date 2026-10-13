"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { teamMembers, type TeamMember } from "@/data/teamMembers";

function MemberProfile({ member, onClose }: { member: TeamMember; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
      dialog.close();
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="team-member-name"
      data-lenis-prevent
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className="fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-xl overflow-y-auto overscroll-contain rounded-2xl border border-accent-gold/30 bg-bg-primary p-0 text-text-primary shadow-2xl backdrop:bg-black/65"
    >
      <div className="p-5 sm:p-7">
        <div className="mb-5 flex items-center justify-between gap-4">
          <p className="text-eyebrow text-accent-gold">Our Team</p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close member profile"
            className="flex size-11 shrink-0 items-center justify-center rounded-full border border-border-subtle transition-colors hover:bg-bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-wine"
          >
            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="m6 6 12 12M18 6 6 18" />
            </svg>
          </button>
        </div>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
          <div className="relative mx-auto aspect-[4/5] w-36 shrink-0 overflow-hidden rounded-xl border border-border-subtle bg-bg-secondary sm:mx-0 sm:w-44">
            <Image
              src={member.portrait}
              alt={`Portrait of ${member.name}`}
              fill
              sizes="(min-width: 640px) 176px, 144px"
              placeholder="blur"
              className="object-cover object-top"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h3 id="team-member-name" className="font-serif text-3xl font-medium leading-tight">{member.name}</h3>
            <p className="mt-2 text-sm text-accent-wine">{member.role}</p>
            {(member.biography || member.caption) && (
              <p className="mt-4 text-sm leading-relaxed text-text-secondary">{member.biography || member.caption}</p>
            )}
            <Link href="/consultation" onClick={onClose} className="btn btn-primary mt-5 w-full text-xs sm:w-auto">
              Book a Consultation
            </Link>
          </div>
        </div>
      </div>
    </dialog>
  );
}

export default function TeamMembers() {
  const rowRef = useRef<HTMLUListElement>(null);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [scrollState, setScrollState] = useState({ hasPrevious: false, hasNext: false });
  const closeProfile = useCallback(() => setSelectedMember(null), []);

  const updateScrollState = useCallback(() => {
    const row = rowRef.current;
    if (!row) return;

    const hasPrevious = row.scrollLeft > 2;
    const hasNext = row.scrollLeft < row.scrollWidth - row.clientWidth - 2;
    setScrollState((current) =>
      current.hasPrevious === hasPrevious && current.hasNext === hasNext
        ? current
        : { hasPrevious, hasNext }
    );
  }, []);

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;

    const observer = new ResizeObserver(updateScrollState);
    observer.observe(row);
    row.addEventListener("scroll", updateScrollState, { passive: true });
    return () => {
      observer.disconnect();
      row.removeEventListener("scroll", updateScrollState);
    };
  }, [updateScrollState]);

  function browseMember(direction: -1 | 1) {
    const row = rowRef.current;
    const card = row?.firstElementChild;
    if (!row || !card) return;

    const gap = parseFloat(getComputedStyle(row).columnGap) || 0;
    row.scrollBy({
      left: direction * (card.getBoundingClientRect().width + gap),
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  }

  return (
    <div className="mb-6 min-w-0" role="region" aria-labelledby="team-members-heading">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 id="team-members-heading" className="min-w-0 font-serif text-xl font-semibold text-[#F7F4EE]">Our Team</h3>
        <div className="hidden shrink-0 gap-2 md:flex">
          <button
            type="button"
            aria-label="Previous team member"
            aria-controls="team-members-list"
            disabled={!scrollState.hasPrevious}
            onClick={() => browseMember(-1)}
            className="flex size-11 items-center justify-center rounded-full border border-[#C9A84C]/30 text-[#F7F4EE] transition-colors hover:border-[#C9A84C] hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFD700] disabled:cursor-default disabled:opacity-30"
          >
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m14 6-6 6 6 6" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Next team member"
            aria-controls="team-members-list"
            disabled={!scrollState.hasNext}
            onClick={() => browseMember(1)}
            className="flex size-11 items-center justify-center rounded-full border border-[#C9A84C]/30 text-[#F7F4EE] transition-colors hover:border-[#C9A84C] hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFD700] disabled:cursor-default disabled:opacity-30"
          >
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m10 6 6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>
      <ul
        ref={rowRef}
        id="team-members-list"
        aria-label="Firm members"
        data-lenis-prevent-horizontal
        className="flex flex-col gap-3 py-1 md:flex-row md:snap-x md:snap-mandatory md:overflow-x-auto md:overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {teamMembers.map((member) => (
          <li key={member.id} className="w-full shrink-0 md:w-[calc((100%-0.75rem)/2)] md:snap-start">
            <button
              type="button"
              aria-label={`View profile of ${member.name}`}
              aria-haspopup="dialog"
              onClick={() => setSelectedMember(member)}
              className="group flex h-full min-h-32 w-full flex-col rounded-xl border border-[#C9A84C]/25 bg-white/[0.04] p-3 text-left transition-colors hover:border-[#C9A84C]/70 hover:bg-white/[0.07] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFD700]"
            >
              <div className="flex w-full flex-1 items-center gap-3">
                <div className="relative aspect-[4/5] w-16 shrink-0 overflow-hidden rounded-lg border border-[#C9A84C]/25 bg-[#e8e8e8]">
                  <Image
                    src={member.portrait}
                    alt={`Portrait of ${member.name}`}
                    fill
                    sizes="64px"
                    placeholder="blur"
                    className="object-cover object-top"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-serif text-lg font-semibold leading-tight text-[#F7F4EE]">{member.name}</h4>
                  <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-[#F7F4EE]/70" title={member.role}>{member.role}</p>
                  <span className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-medium text-[#FFD700]">
                    View profile
                    <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 12h16m-6-6 6 6-6 6" />
                    </svg>
                  </span>
                </div>
              </div>
              {member.caption && (
                <p className="mt-2 w-full line-clamp-2 text-[11px] leading-relaxed text-[#F7F4EE]/75">{member.caption}</p>
              )}
            </button>
          </li>
        ))}
      </ul>
      {selectedMember && <MemberProfile key={selectedMember.id} member={selectedMember} onClose={closeProfile} />}
    </div>
  );
}
