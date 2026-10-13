"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, type ReactNode } from "react";
import { siteSettings } from "@/data/siteSettings";

type MobileNavigationDrawerProps = {
  id: string;
  label: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
};

export default function MobileNavigationDrawer({
  id,
  label,
  subtitle = siteSettings.firmTagline,
  onClose,
  children,
}: MobileNavigationDrawerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    // Native modal behavior contains keyboard focus and makes the page inert.
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    dialog.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const desktop = window.matchMedia("(min-width: 1024px)");
    const handleResize = () => {
      if (desktop.matches) onClose();
    };
    desktop.addEventListener("change", handleResize);
    handleResize();

    return () => {
      desktop.removeEventListener("change", handleResize);
      document.body.style.overflow = previousOverflow;
      dialog.close();
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, [onClose]);

  return (
    <dialog
      ref={dialogRef}
      id={id}
      data-lenis-prevent
      aria-label={label}
      onCancel={onClose}
      className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none border-0 bg-transparent p-0 text-text-primary backdrop:bg-black/20 lg:hidden"
    >
      <div className="relative flex h-20 items-center gap-3 border-b border-border-subtle bg-white px-4 sm:px-6">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close navigation"
          className="flex size-11 shrink-0 items-center justify-center rounded-lg text-accent-wine transition-colors hover:bg-bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-wine"
        >
          <svg aria-hidden="true" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
            <path d="m6 6 12 12M18 6 6 18" />
          </svg>
        </button>
        <Link href="/" onClick={onClose} className="flex min-w-0 items-center gap-2.5" aria-label={`${siteSettings.firmName} - Home`}>
          <Image src="/nyaysaathi_logo.png" alt="" width={40} height={40} className="size-10 shrink-0 rounded-full object-cover ring-1 ring-accent-gold/40" />
          <span className="min-w-0">
            <span className="block font-serif text-2xl font-medium leading-tight">{siteSettings.firmName}</span>
            <span className="block text-[9px] font-medium uppercase tracking-[0.1em] text-accent-wine">{subtitle}</span>
          </span>
        </Link>
      </div>
      <div className="relative h-[calc(100dvh-5rem)]">
        <button type="button" aria-label="Dismiss navigation" onClick={onClose} className="absolute inset-0" tabIndex={-1} />
        <div data-lenis-prevent className="navigation-drawer-panel relative flex h-full w-[min(82vw,20rem)] flex-col overflow-y-auto overscroll-contain bg-white shadow-[8px_0_24px_rgba(0,0,0,0.08)] [padding-bottom:env(safe-area-inset-bottom)]">
          {children}
        </div>
      </div>
    </dialog>
  );
}
