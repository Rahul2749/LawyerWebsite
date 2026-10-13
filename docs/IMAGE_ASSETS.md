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
- Display: the compact homepage team row and member profile dialog.

## Adding team members

1. Add the portrait to `public/images/` and import it in `src/data/teamMembers.ts`.
2. Add an entry to `teamMembers` with a unique `id`, the person's `name`, confirmed `role`, and `portrait`. An optional `caption` adds a short card preview; an optional `biography` appears in the full profile.
3. The scrolling cards, navigation controls, and profile dialog update from this list. Extra members extend the horizontal row rather than the homepage height.
