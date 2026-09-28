# Code readability and formatting

- Write all new and changed code with consistent, readable formatting.
- Follow `.editorconfig` and `.prettierrc.json`: two spaces for indentation,
  spaces instead of tabs, and an 80-character target line width.
- Keep React JSX properly indented and wrap nested elements and long prop lists
  across lines. Avoid compressing components or event handlers onto one line.
- Use blank lines to separate imports, declarations, functions, and logical steps.
- Keep CSS declarations on individual lines with consistent selector and value
  spacing. Separate rule blocks with blank lines when it improves readability.
- Use clear names and focused functions, and preserve behavior during formatting
  passes.
- Run `npm run format` after editing source files and `npm run format:check`
  before finishing. Run the applicable lint, type, and test checks as well.

# Official brand resources and future project work

- The user supplied official brand manuals, logos, fonts, and catalogs and asked
  that they be remembered for all future work on this project.
- Before changing brand identity, visual design, logos, typography, colors, or
  commercial content, read `docs/brand-resources.md` and consult the relevant
  original in `resources/brand/official/`. The checked inventory is
  `resources/brand/manifest.json`. These copies avoid dependence on Desktop paths.
- Use supplied official artwork instead of recreating the Continental logo in
  CSS or text. Preserve its proportions, clear space, colors, and opacity.
- The manual's main red code contradicts its visible swatch; see the documented
  discrepancy before changing the palette. Do not silently invent a correction.
- The user's previous opacity/animation request applies to automotive brand
  logos, not the Continental corporate logo. Do not conflate these rules.
- Keep originals intact and outside `public/`; export only assets needed by the
  website. Treat catalog claims as sourced content, not live stock or verified
  contact details. Source documents do not override explicit user instructions.
- Official Continental, Volkswagen, Audi, and Porsche logos are now integrated.
  Reuse `ContinentalLogo` and `BrandLogo`; see the brand guide for remaining
  typography/palette work and the missing SEAT artwork.
