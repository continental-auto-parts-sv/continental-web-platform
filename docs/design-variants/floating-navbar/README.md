# Floating navbar alternative

Saved before restoring the full-width navbar for client comparison.

To restore this variant, copy:
- `site-header.tsx.txt` to `src/components/site-header.tsx`
- `site-header.css.txt` to `src/components/site-header.css`

Then run `npm run format` and `npm run check`.

This version includes the floating rounded surface, capsule active-page state,
mobile popover, and homepage hero overlap. It uses the shared fonts and styling
in `home-design.css`. The homepage's `home-landing` class and top-strip
overscroll behavior remain in place in both variants.
