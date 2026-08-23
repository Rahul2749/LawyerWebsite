# Premium Legal Consultancy Website — Full-Stack Development Prompt (v2, Enhanced)

Design and develop a **super-premium, modern, visually striking legal consultant / law firm platform** for a highly reputed lawyer or firm.

The site should read as a fusion of a **luxury law firm, a premium editorial magazine, and a modern legal-tech consultancy platform** — cinematic, minimal, editorial, and trustworthy.

It must communicate: Trust, Authority, Professionalism, Expertise, Privacy, Integrity, Success, Sophistication, Human Connection.

**Avoid:** generic corporate law clichés, excessive gold gradients, scales-of-justice/gavel iconography, courthouse stock photography, cluttered layouts, Bootstrap-default components, cheap animation.

> Everything below marked **[NEW]** was added in this revision to close gaps in the original brief — legal/ethical compliance, accessibility, testing, DevOps, content strategy, and technical precision that a production build actually needs.

---

## 1. TECH STACK

### Frontend
- React 18+, TypeScript, Next.js (App Router) — **recommended over plain Vite** for SEO-critical marketing pages (SSR/ISR for blog & practice area pages), while still using Vite conventions for any isolated admin SPA if desired.
- GSAP + ScrollTrigger, Lenis (smooth scroll), Framer Motion (component-level micro-interactions only)
- Tailwind CSS (with a documented design-token config) or SCSS with CSS variables
- React Hook Form + Zod
- Axios (or native `fetch` with a typed wrapper)
- **[NEW]** TanStack Query for server-state caching/mutations on the admin dashboard
- **[NEW]** `next-seo` or native Next.js Metadata API for SEO
- **[NEW]** `next-sitemap` for sitemap/robots generation

### Backend
- Node.js, Express.js (or NestJS if the team prefers structured DI — call this out as a decision point), TypeScript
- REST architecture (documented via OpenAPI/Swagger — **[NEW]**)
- PostgreSQL + Prisma ORM
- JWT auth (short-lived access token + rotating refresh token), RBAC
- **[NEW]** Zod (or class-validator) for request validation on the server, not just the client
- **[NEW]** BullMQ + Redis for background jobs (video processing callbacks, email queue, scheduled digest emails)
- **[NEW]** Winston or Pino for structured logging; Sentry for error tracking

### Storage & Media
- AWS S3 or Cloudflare R2 for images/thumbnails; video metadata in PostgreSQL only (never store binary video in the DB)
- Mux or Cloudinary for video transcoding/adaptive streaming
- **[NEW]** Sharp for server-side image resizing/format conversion (WebP/AVIF derivatives) if not using a media CDN with on-the-fly transforms
- **[NEW]** Signed, time-limited URLs for any non-public media (e.g., draft blog images, consultation attachments)

### Infra / DevOps **[NEW — entirely missing from v1]**
- Docker + docker-compose for local dev parity (Postgres, Redis, app)
- CI/CD: GitHub Actions — lint → typecheck → test → build → deploy
- Environments: `local`, `staging`, `production` with separate `.env` files and separate S3 buckets/DB instances
- Infrastructure target: Vercel (frontend) + Railway/Render/Fly.io or a VPS (backend + Postgres), or a unified Docker deployment — document as a decision point, not a hard requirement
- **[NEW]** Automated nightly PostgreSQL backups with a documented restore procedure
- **[NEW]** Health check endpoint (`/api/health`) for uptime monitoring

### Optional
- Resend or SendGrid for transactional email
- Cloudflare Turnstile (preferred over reCAPTCHA for a premium UX with no visible checkbox puzzle) on the consultation form
- **[NEW]** PostHog or Plausible for privacy-respecting analytics (avoid GA-style heavy trackers on a law firm site — clients care about privacy optics)
- **[NEW]** Algolia or Postgres full-text search for blog/insights search

---

## 2. LEGAL & ETHICAL COMPLIANCE **[NEW — critical, entirely missing from v1]**

This is a law firm website; it is subject to attorney-advertising and data-privacy rules that a generic business site is not. Build these in from day one rather than bolting them on later:

- **Attorney advertising disclaimer**: Many jurisdictions (e.g., US state bars) require "Attorney Advertising" labeling and prohibit claims like "best lawyer," "guaranteed results," or unqualified superlatives. Do not hard-code result guarantees anywhere in copy or testimonials.
- **No case results without disclaimers**: Any "case results" or "past outcomes" content must carry a visible disclaimer that past results do not guarantee future outcomes.
- **Testimonials**: Confirm the relevant jurisdiction's bar rules on client testimonials before enabling them (some bars restrict or heavily regulate this) — include a config flag (`ENABLE_TESTIMONIALS`) so it can be toggled off per-jurisdiction.
- **Attorney-client relationship disclaimer**: Already present in the footer in v1 — extend it to also appear as an explicit checkbox/acknowledgment on the Consultation form itself ("I understand that submitting this form does not create an attorney-client relationship").
- **Conflict-of-interest screening [NEW]**: Add an internal-only admin field to flag potential conflicts before a consultation is accepted (name of opposing party, matter description) — this is standard practice for intake at law firms.
- **Data privacy**: Cookie consent banner (GDPR/CCPA-aware depending on target jurisdiction), a real Privacy Policy page describing what's collected (form data, analytics, cookies), retention periods, and a data-deletion request process.
- **Confidentiality messaging**: Reinforce "this form is not a secure channel for highly sensitive details" on the consultation form — don't let users submit privileged information they'd regret sending over a web form before an engagement exists.

---

## 3. BRAND DIRECTION

Premium light theme, primary palette:

| Token | Hex | Use |
|---|---|---|
| `--bg-primary` | `#F7F4EE` | Warm ivory background |
| `--text-primary` | `#171717` | Deep charcoal / near-black type |
| `--text-secondary` | `#68645E` | Muted body/secondary copy |
| `--accent-gold` | `#B89B5E` | Borders, icons, micro-interactions only |
| `--accent-wine` | `#5A1824` | Secondary accent, CTAs, emphasis |
| `--bg-dark` | `#151515` | Dark sections, footer |

**[NEW] Extended token set** (v1 only defined 6 colors — a real design system needs states and neutrals too):

| Token | Hex/Value | Use |
|---|---|---|
| `--bg-secondary` | `#EFEAE0` | Alternating section background |
| `--border-subtle` | `#E2DCD0` | Hairline dividers |
| `--text-inverse` | `#F7F4EE` | Text on dark sections |
| `--state-success` | `#4A6741` | Form success states (muted, not neon green) |
| `--state-error` | `#8C3A3A` | Form error states (muted wine-adjacent red) |
| `--accent-gold-hover` | `#C9AF75` | Hover state for gold elements |
| `--overlay-scrim` | `rgba(21,21,21,0.55)` | Image overlays for text legibility |

Gold is a **trim color**, not a fill color — use it at ≤10% of any given viewport.

---

## 4. TYPOGRAPHY

- **Display/Headings (serif)**: Cormorant Garamond, Playfair Display, or Instrument Serif
- **Body (sans-serif)**: Inter, Manrope, or DM Sans

**[NEW] Concrete type scale** (v1 gave no sizing system, which leads to inconsistent implementation):

| Role | Font | Size (desktop / mobile) | Line-height | Tracking |
|---|---|---|---|---|
| Hero H1 | Serif | 96px / 44px | 1.05 | -0.02em |
| Section H2 | Serif | 56px / 32px | 1.1 | -0.01em |
| Card H3 | Serif | 28px / 22px | 1.2 | 0 |
| Eyebrow/Label | Sans, uppercase | 13px / 12px | 1.4 | 0.14em |
| Body | Sans | 17px / 16px | 1.6 | 0 |
| Caption | Sans | 13px / 13px | 1.5 | 0.02em |

**[NEW]** Define a fluid-type approach (`clamp()`) so headings scale smoothly between breakpoints instead of jumping at fixed widths.

---

## 5. INFORMATION ARCHITECTURE (unchanged from v1, confirmed sound)

1. Home
2. About the Lawyer
3. Practice Areas (index)
4. Practice Area Detail
5. Legal Insights / Blog (index)
6. Blog Detail
7. Videos / Legal Talks (index)
8. Video Detail
9. Consultation
10. Contact
11. Privacy Policy
12. Terms of Use
13. **[NEW]** Cookie Policy (separate from Privacy Policy for clarity/compliance)
14. **[NEW]** Attorney Advertising / Disclaimer page (some jurisdictions require this as a standalone page, not just a footer line)
15. **[NEW]** 404 / Error page (on-brand, not a default Next.js error screen)
16. **[NEW]** Search results page (if search is implemented)
17. Admin Dashboard
18. Admin Login
19. **[NEW]** Admin: Forgot Password / Reset flow (v1 spec'd JWT auth but never addressed password recovery)

---

## 6. HOMEPAGE

### Hero Section (as v1, refined)
Full-screen hero, cinematic portrait or video of the lawyer, asymmetric composition, GSAP entrance sequence (character/line reveal, clip-path image reveal, staggered CTA/nav fade-in). Respect `prefers-reduced-motion` by swapping to a simple fade.

**[NEW]** Specify fallback: if a cinematic video hero is used, it must have a poster image, load lazily/deferred, mute by default, autoplay only if the browser allows it, and degrade gracefully to a static image on slow connections (`navigator.connection.saveData` check) or mobile.

### Trust / Credentials Section
Animated counters (years of experience, clients represented, practice areas, satisfaction rate) — v1 correctly notes these must be placeholders until real data is supplied. **[NEW]**: add a CMS-editable `SiteSettings` model field for each stat so the admin can update these without a code deploy.

### About Section
Split-screen editorial layout with parallax portrait, "Read My Story" CTA to the full About page.

### Practice Areas
Interactive index with hover-driven background imagery, numbered list, animated arrow/cursor interaction; card-based fallback on mobile/touch devices (hover states don't work well on touch — **[NEW]** explicitly design a tap-to-reveal or always-visible-label mobile pattern instead of relying on hover).

### Insights (Blog) Preview
Editorial grid, featured-article-larger pattern, category filters, hover scale/arrow motion.

### Legal Talks (Video) Preview
Cinematic thumbnail grid with duration/category/title.

### Consultation CTA band
A dedicated full-width section before the footer inviting a consultation — v1 buried this only in the Contact section; give it its own homepage real estate as a conversion point.

### Footer
Dark section: logo, quick links, practice areas, insights, videos, consultation, contact, social, privacy/terms/cookie policy, attorney-advertising disclaimer line.

**[NEW] Missing homepage element: Social proof beyond raw stats.** Add a subtle press/recognition strip ("As featured in...", bar association badges, awards) if applicable — this is one of the highest-trust-building elements on real premium law firm sites and was absent from v1 entirely.

---

## 7. NAVIGATION

Floating/sticky nav (logo, About, Expertise, Insights, Videos, Consultation, Contact, "Book a Consultation" CTA). On scroll: shrink, blur-ivory background, subtle border, GSAP transition. Full-screen animated mobile menu.

**[NEW]**: Add a visible phone number / "Call Now" affordance in the nav on mobile — for legal consultations, many users convert via phone, not the web form. Don't force everyone through the form.

**[NEW]**: Keyboard navigation and visible focus states for the entire nav (see Accessibility section) — floating/blurred navs are notorious for poor focus-ring visibility if not explicitly styled.

---

## 8. PRACTICE AREAS

As v1 (numbered interactive list with hover imagery), plus:

**[NEW] Detail page additions:**
- Related insights (blog posts tagged with this practice area)
- Related videos
- "Other practice areas" cross-links at the bottom (internal linking helps SEO and user discovery)
- **[NEW]** FAQPage schema markup per practice area (v1 mentioned FAQs in content but didn't connect them to the Schema.org FAQPage type specified later — make that connection explicit)

---

## 9. LEGAL INSIGHTS / BLOG

As v1, plus:
- **[NEW]** Author bio block (name, photo, short credential line) on every article — E-E-A-T (Experience, Expertise, Authority, Trust) signals matter heavily for Google ranking on legal content (YMYL — "Your Money or Your Life" category).
- **[NEW]** Estimated reading time calculated server-side from word count, not hardcoded.
- **[NEW]** Table of contents for long-form articles (auto-generated from H2/H3 headings) with scroll-spy highlighting.
- **[NEW]** "Was this helpful?" or a soft consultation CTA embedded mid-article, not just at the end.

---

## 10. VIDEOS / LEGAL TALKS

As v1, plus:
- **[NEW]** Auto-generated captions/transcript requirement — accessibility (WCAG) and SEO both benefit; Mux and most transcoding services offer this.
- **[NEW]** Chaptering/timestamps for longer videos (Q&A, interviews).

---

## 11. CONSULTATION FLOW

As v1 (form fields, statuses, admin workflow, reference number generation), plus:

- **[NEW]** Explicit consent checkbox + confidentiality disclaimer (see Section 2)
- **[NEW]** Honeypot field + Turnstile/reCAPTCHA to prevent bot submissions (v1 mentioned the tool but never wired it into the actual submit flow)
- **[NEW]** Rate limiting specifically on `POST /api/consultations` (e.g., 5 submissions per IP per hour) to prevent spam/abuse independent of the general API rate limit
- **[NEW]** Conflict-check field (internal, admin-only — see Section 2)
- **[NEW]** SLA messaging: tell the client when to expect a response ("We respond within one business day") — reduces anxiety and repeat submissions
- **[NEW]** Calendar integration option: instead of free-text "preferred date/time," offer a real availability picker (e.g., Cal.com embed or a custom slots table) as a stretch goal

---

## 12. CONTACT

As v1 (address, phone, email, hours, map, social), plus:
- **[NEW]** Clarify Google Maps embed must not block page load — lazy-load the iframe on interaction/scroll-into-view (maps embeds are a common Lighthouse performance killer).

---

## 13. ADMIN DASHBOARD

As v1 (overview stats, nav sections: Dashboard, Blog, Video, Practice Areas, Consultations, Media Library, Profile, Site Settings, Users/Admins), plus:

- **[NEW]** Activity/Audit log view (the `AuditLog` model was listed in the DB schema in v1 but never surfaced in any UI — expose it as an admin screen: who changed what, when)
- **[NEW]** Role granularity: v1 says "role-based authorization" but defines no roles. Suggest at minimum: `SUPER_ADMIN` (full access incl. user management), `EDITOR` (blog/video/practice area content), `INTAKE` (consultations only, no content access) — reflects how a real firm splits marketing staff from case-intake staff.
- **[NEW]** Two-factor authentication for admin accounts (TOTP) — a law firm admin panel handling client intake data is a meaningful target; basic JWT+password alone is thin for this use case.
- **[NEW]** Session management screen (view/revoke active admin sessions).

---

## 14. DATABASE (Prisma / PostgreSQL)

Models from v1, confirmed: `User`, `Role`, `LawyerProfile`, `PracticeArea`, `BlogPost`, `BlogCategory`, `BlogTag`, `Video`, `VideoCategory`, `Consultation`, `ConsultationNote`, `Media`, `ContactMessage`, `SiteSettings`, `AuditLog`.

**[NEW] Additions:**
- `Testimonial` (with a `jurisdictionApproved: Boolean` flag tying back to Section 2's compliance concern)
- `FAQ` (linked to `PracticeArea`, used for FAQPage schema)
- `RefreshToken` (to support real JWT rotation/revocation rather than storing rotation state only in memory)
- `Session` (admin session tracking, supports the "revoke sessions" admin feature above)
- `NewsletterSubscriber` (if a newsletter capture is added to blog pages — optional but common on legal content sites)

All models: UUID PKs, `createdAt`/`updatedAt`, `deletedAt` (soft delete) where appropriate — as v1 specified. **[NEW]**: add explicit unique constraints and indexes called out per model (e.g., `BlogPost.slug` unique + indexed, `Consultation.referenceNumber` unique + indexed, `Video.status` indexed for admin filtering).

---

## 15. SECURITY

As v1 (JWT, Argon2/bcrypt, RBAC, validation, rate limiting, CORS, Helmet, XSS/CSRF/SQLi protection via Prisma, signed URLs, file validation), plus:

- **[NEW]** Explicit password policy (min length, breach-list check via a service like HaveIBeenPwned's k-anonymity API) for admin accounts
- **[NEW]** Content Security Policy (CSP) headers — not just "secure headers" generically; specify a real CSP that allows the video CDN, image CDN, and Turnstile/reCAPTCHA domains and nothing else
- **[NEW]** Dependency scanning in CI (`npm audit` / Dependabot / Snyk)
- **[NEW]** Secrets management: never commit `.env`; document use of a secrets manager (e.g., Doppler, AWS Secrets Manager, or platform-native env vars) in production instead of flat files
- **[NEW]** File upload hardening: verify actual file content/magic bytes server-side, not just the extension or client-declared MIME type, before accepting uploads to S3/R2

---

## 16. ACCESSIBILITY **[NEW — v1 mentioned Lighthouse Accessibility 95+ as a target but gave zero implementation guidance]**

- Semantic HTML landmarks (`<nav>`, `<main>`, `<header>`, `<footer>`) throughout
- Visible focus states on all interactive elements, including custom cursor states (custom cursors must not remove the default focus ring for keyboard users)
- Sufficient color contrast — verify the muted gold (`#B89B5E`) on ivory background meets WCAG AA for any text use (it likely does NOT for body text at that lightness; reserve gold for large text, icons, and borders only, never small body copy)
- All GSAP/Framer Motion animations gated behind `prefers-reduced-motion: reduce`
- Form fields with proper `<label>` association, error messages tied via `aria-describedby`
- Video players with captions (see Section 10) and keyboard-operable controls
- Skip-to-content link before the nav

---

## 17. GSAP / MOTION SYSTEM

As v1 (hero reveal, clip-path reveal, scroll reveals, counters, parallax, hover transitions, page transitions, magnetic buttons, custom cursor, horizontal scroll sections), plus:

**[NEW] Concrete motion tokens** (v1 gave a list of animation types with no timing spec, which is how "elegant" GSAP turns into "janky" GSAP in practice):

| Motion | Duration | Ease |
|---|---|---|
| Text/line reveal | 0.8–1.2s, staggered 0.05–0.08s per line | `power3.out` |
| Image clip-path reveal | 1.2–1.6s | `power4.inOut` |
| Scroll-triggered fade/rise | 0.6–0.9s | `power2.out` |
| Hover state transitions | 0.3–0.4s | `power2.out` |
| Page transitions | 0.5–0.7s | `power3.inOut` |
| Number counters | 1.5–2s total | `power1.out` |

Keep all reveal animations **one-shot** (don't re-trigger on every scroll pass) unless it's a counter or parallax effect.

---

## 18. RESPONSIVE / PERFORMANCE / SEO

Largely as v1. **[NEW] concrete breakpoints** to remove ambiguity:

| Name | Width |
|---|---|
| Mobile | 0–639px |
| Tablet | 640–1023px |
| Laptop | 1024–1439px |
| Desktop | 1440px+ |

Performance and SEO targets (Lighthouse 90+/95+/95+/95+) as v1. **[NEW]**: add Core Web Vitals as the actual measured targets, since Lighthouse scores alone can be gamed — target LCP < 2.5s, INP < 200ms, CLS < 0.1 on real 4G mobile conditions, not just desktop lab tests.

Schema.org types as v1 (Person, LegalService, Organization, Article, VideoObject, FAQPage) — **[NEW]** add `BreadcrumbList` schema for practice area and blog detail pages.

---

## 19. TESTING STRATEGY **[NEW — entirely absent from v1]**

- Unit tests: Vitest/Jest for utility functions, form validation schemas, API route handlers
- Integration tests: Supertest against the Express API for the consultation submission flow, auth flow, and CRUD on blog/video/practice-area endpoints
- E2E tests: Playwright covering the critical paths — homepage load, consultation form submission (including validation errors), blog reading flow, admin login + create/publish a blog post
- Visual regression (optional but valuable given the design-heavy nature of this project): Chromatic or Percy on key pages
- CI gate: PRs must pass lint + typecheck + unit + a smoke-level E2E run before merge

---

## 20. API STRUCTURE (as v1, plus additions)

All v1 endpoints retained. **[NEW] additions:**

```
POST   /api/auth/logout
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
GET    /api/health
GET    /api/faqs?practiceAreaId=
POST   /api/testimonials            (admin)
GET    /api/testimonials            (public, only jurisdictionApproved)
GET    /api/admin/audit-log
GET    /api/admin/sessions
DELETE /api/admin/sessions/:id
POST   /api/media/upload            (returns signed S3/R2 URL)
GET    /api/search?q=
```

**[NEW]**: Document standard error response shape (`{ error: { code, message, fieldErrors? } }`) and standard pagination shape (`{ data, page, pageSize, total }`) so frontend and backend stay consistent across all list endpoints — v1 never specified either.

---

## 21. CONTENT STRATEGY **[NEW]**

A premium visual system needs real content to not look empty in development and staging. Before/alongside build:

- Provide 6–10 seed blog posts across categories (even placeholder/lorem-ipsum-adjacent but realistic legal topics) so the editorial grid and filters can be properly evaluated
- Provide at least 3 seed videos with real (or stand-in) thumbnails and durations
- Provide 4–6 practice areas with full detail-page content (overview, services, FAQs) so the detail template is tested with real-length copy, not just headings
- Flag clearly in the README which content is placeholder and must be replaced before launch (especially the trust-stat numbers called out in v1's Trust section)

---

## 22. DELIVERABLES / README

As v1 (install, env config, Postgres setup, Prisma migrations, admin account creation, dev/build commands, deployment, media config), plus:

- **[NEW]** Document the CI/CD pipeline and how to add a new environment
- **[NEW]** Document the backup/restore procedure
- **[NEW]** Document the process for toggling `ENABLE_TESTIMONIALS` and other jurisdiction-dependent compliance flags
- **[NEW]** Include a short "content editor" guide (non-technical) for whoever at the firm will actually use the admin dashboard day-to-day — not everyone reading the README will be a developer

---

## BUILD ORDER

1. Design system + homepage UI (as v1 specified)
2. Core marketing pages (About, Practice Areas index + detail, Contact)
3. Blog (list, detail, admin CRUD)
4. Videos (list, detail, admin CRUD)
5. Consultation flow end-to-end (form → DB → email → admin management)
6. Admin dashboard shell + auth + roles
7. Compliance layer (disclaimers, cookie consent, testimonial gating)
8. Accessibility pass
9. Performance/SEO pass
10. Testing + CI/CD
11. Deployment

---

*This is a specification document, not code. Hand this to a development team or an AI coding agent (e.g., Claude Code) as the source of truth, starting with the homepage design system per the Build Order above.*
