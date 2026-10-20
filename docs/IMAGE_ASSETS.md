# Website image assets

## Raja Agrawal portrait

- Source: the actual portrait supplied by the user, `WhatsApp Image 2026-10-13 at 12.00.22 PM.jpeg`.
- Restoration: the built-in image generation tool in edit mode, using the source photograph as the edit target. The source photograph remains unchanged.
- Website asset: `public/images/raja-agrawal-portrait.webp` (1111 × 1415 pixels, approximately 59 KB). WebP encoding uses Sharp at quality 90.
- Display: compact homepage team cards, member profile dialogs, and insight article author portraits use Next.js Image for lazy loading and device-sized delivery.

### Final restoration prompt

```text
Use case: identity-preserve
Asset type: portrait photograph for Raja Agrawal's profile on a law firm website.
Input image 1: edit target, the supplied actual photograph of Raja Agrawal in advocate attire.
Primary request: conservatively restore this photographed printed portrait. Remove only the thin dark printed frame and paper edges, straighten the image slightly, correct the gray color cast and uneven exposure, gently improve clarity and reduce camera noise. Keep the backdrop a clean, natural light gray.
Composition: vertical portrait, retain the complete hair, face, shoulders, black advocate coat and white neck bands; preserve the original pose and framing as closely as possible.
Constraints: preserve the person's identity and exact facial proportions, eyes, nose, mouth, hairline, beard, glasses, expression, skin tone, body proportions and clothing. No beautification, age change, face reshaping, replacement face, invented smile, dramatic studio relighting, text, logos or watermark. Keep natural skin texture; modest restoration rather than a newly imagined headshot.
```

## Yatharth Badwaik portrait

- Source: the actual portrait supplied by the user, `DSC_6455.jpg.jpeg`.
- Website asset: `public/images/yatharth-badwaik-portrait.webp` (413 × 531 pixels, approximately 16 KB).
- Processing: WebP encoding with Sharp at quality 90; the supplied photograph's appearance and framing are preserved.
- Display: the compact homepage team grid and member profile dialog.

## Prashant Shankar Dahiwale portrait

- Source: the actual portrait supplied by the user, `codex-clipboard-944ea20c-340a-4307-9455-b39abff7ef78.jpg`.
- Enhancement: the built-in image generation tool in edit mode. Removed the printed frame, softened harsh processing, and restored a natural photographic finish while preserving identity, expression, advocate attire, and the pen. The supplied source remains unchanged.
- Website asset: `public/images/prashant-dahiwale-portrait.webp` (800 × 1001 pixels, approximately 80 KB). Resized and encoded with Sharp at quality 90.
- Display: homepage team card and full member profile dialog. The biography uses the information supplied by the user; no years of practice or additional credentials have been added.

### Final enhancement prompt

```text
Use case: identity-preserve
Asset type: professional portrait for advocate Prashant Shankar Dahiwale on a law firm's team page.
Input image 1: edit target, the real portrait supplied by the user.
Primary request: conservatively clean and enhance this existing portrait. Remove the outer black printed frame and thin white frame. Gently correct the harsh contrast, excessive sharpening and color cast, reduce visible image noise and restore a natural photographic finish. Retain a clean neutral very light gray/off-white background with even, restrained lighting. Preserve natural skin texture rather than plastic smoothing.
Composition: vertical portrait with the complete hair, face, shoulders, black advocate coat and white advocate neck bands visible. Keep a little breathing room above the hair and preserve the original pose, framing and clothing details, including the existing pen.
Invariants: preserve this exact person's identity, facial proportions, eyes, nose, mouth, hairline, expression, age, skin tone, stubble, body proportions and professional attire. No face reshaping, beautification, replacement face, invented smile, dramatic relighting, extra accessories, text, logo, watermark or decorative border. This is a restrained restoration of the supplied photograph, not a new imagined headshot.
```

## Adding team members

1. Add the portrait to `public/images/` and import it in `src/data/teamMembers.ts`.
2. Add an entry to `teamMembers` with a unique `id`, the person's `name`, confirmed `role`, and `portrait`. An optional `caption` adds a short card preview; an optional `biography` appears in the full profile.
3. The team grid and profile dialog update from this list. Members stack vertically on mobile, with three columns from tablet widths upward. Additional members wrap into new rows; there is no horizontal carousel or hidden profile.
