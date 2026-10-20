"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { teamMembers, type TeamMember } from "@/data/teamMembers";

function renderFormattedBio(text: string) {
  return text.split(/\n\n+/).map((para, i) => {
    const parts = para.split(/(\*[^*]+\*)/g);
    return (
      <p key={i}>
        {parts.map((part, j) => {
          if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
            return (
              <strong key={j} className="font-semibold text-text-primary">
                {part.slice(1, -1)}
              </strong>
            );
          }
          return part;
        })}
      </p>
    );
  });
}

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
              <div className="mt-4 space-y-3 text-sm leading-relaxed text-text-secondary">
                {renderFormattedBio(member.biography || member.caption || "")}
              </div>
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
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const closeProfile = useCallback(() => setSelectedMember(null), []);

  return (
    <div className="min-w-0" role="region" aria-labelledby="team-members-heading">
      <h3 id="team-members-heading" className="mb-4 font-serif text-2xl font-semibold text-[#F7F4EE]">Our Team</h3>
      <ul
        id="team-members-list"
        aria-label="Firm members"
        className="grid grid-cols-1 gap-x-4 py-1 md:grid-cols-3"
      >
        {teamMembers.map((member) => (
          <li key={member.id} className="mb-4 grid min-w-0 row-span-4 grid-rows-subgrid">
            <button
              type="button"
              aria-label={`View profile of ${member.name}`}
              aria-haspopup="dialog"
              onClick={() => setSelectedMember(member)}
              className="group row-span-4 grid h-full min-h-32 w-full grid-cols-[4rem_minmax(0,1fr)] grid-rows-subgrid gap-x-3 rounded-xl border border-[#C9A84C]/25 bg-white/[0.04] p-3 text-left transition-colors hover:border-[#C9A84C]/70 hover:bg-white/[0.07] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFD700] lg:grid-cols-[5rem_minmax(0,1fr)] lg:gap-x-4 lg:p-4"
            >
              <div className="relative col-start-1 row-span-3 row-start-1 aspect-[4/5] w-16 self-start overflow-hidden rounded-lg border border-[#C9A84C]/25 bg-[#e8e8e8] lg:w-20">
                <Image
                  src={member.portrait}
                  alt={`Portrait of ${member.name}`}
                  fill
                  sizes="(min-width: 1024px) 80px, 64px"
                  placeholder="blur"
                  className="object-cover object-top"
                />
              </div>
              <h4 className="col-start-2 row-start-1 min-w-0 self-start font-serif text-lg font-semibold leading-tight text-[#F7F4EE]">{member.name}</h4>
              <p className="col-start-2 row-start-2 mt-1 min-w-0 self-start line-clamp-2 text-xs leading-relaxed text-[#F7F4EE]/70" title={member.role}>{member.role}</p>
              <span className="col-start-2 row-start-3 mt-2 inline-flex items-center gap-1.5 self-start text-xs font-medium text-[#FFD700]">
                View profile
                <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 12h16m-6-6 6 6-6 6" />
                </svg>
              </span>
              {member.caption && (
                <p className="col-span-2 row-start-4 mt-3 w-full self-start line-clamp-2 text-xs leading-relaxed text-[#F7F4EE]/75">{member.caption}</p>
              )}
            </button>
          </li>
        ))}
      </ul>
      {selectedMember && <MemberProfile key={selectedMember.id} member={selectedMember} onClose={closeProfile} />}
    </div>
  );
}
