# Continental Auto Parts Web

Official website for Continental Auto Parts SV, built with Next.js, TypeScript, Sanity CMS, and deployed on Vercel.

> Proprietary software developed for Continental Auto Parts. All rights reserved.

## Requirements

- Node.js 22 LTS
- npm 10 or later

The repository pins Node 22 in `.nvmrc` and `package.json`. This version is supported by Next.js 16, the testing toolchain, GitHub Actions, and Vercel.

## Local development

```bash
nvm use
npm ci
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Commands

```bash
npm run dev        # Start the local development server
npm run typecheck  # Check TypeScript
npm run lint       # Run ESLint
npm test           # Run the test suite once
npm run test:watch # Run tests in watch mode
npm run build      # Create a production build
npm start          # Serve the production build
```

Run all quality gates before opening or merging a pull request:

```bash
npm run check
```

## Environment variables

Copy `.env.example` to `.env.local`. The starter application builds without service credentials; integrations will be added when the corresponding Sanity, Resend, and Google Analytics accounts are ready.

- `NEXT_PUBLIC_SITE_URL`: canonical production URL
- `NEXT_PUBLIC_SANITY_PROJECT_ID`: public Sanity project identifier
- `NEXT_PUBLIC_SANITY_DATASET`: public Sanity dataset name
- `SANITY_API_TOKEN`: server-only token for authenticated Sanity operations
- `RESEND_API_KEY`: server-only Resend credential
- `RESEND_FROM_EMAIL`: verified sender address
- `CONTACT_TO_EMAIL`: contact-form recipient
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`: GA4 measurement ID; analytics must remain consent-gated

Never place a secret in a variable whose name begins with `NEXT_PUBLIC_`.

## Delivery workflow

1. Create a branch such as `feature/homepage` from `main`.
2. Open a pull request into `main`.
3. Wait for CI (type checking, linting, tests, and production build) and the Vercel preview.
4. Manually verify the preview, then merge.
5. Vercel deploys `main` to production through its native GitHub integration.

GitHub Actions does not deploy the production site. Connect this repository to a
company-owned Vercel project and set `main` as its production branch.

### Development preview

Every push to `development` builds a static export and deploys it to GitHub Pages:

<https://continental-auto-parts-sv.github.io/continental-web-platform/>

In the repository settings, select **Settings → Pages → Build and deployment →
GitHub Actions** once to enable the workflow. The preview is a static snapshot:
Sanity changes appear after the next deployment, and server-only Next.js features
and response headers are not available. The production build remains configured for
Vercel.

The `Protect main` ruleset can document the intended workflow, but GitHub Free does not enforce organization rulesets on private repositories. Until that changes, the pull-request workflow must be followed manually.

## Planned architecture

- Next.js App Router with Server Components by default
- Static generation and caching for corporate content
- `next-sanity` v13+ for blog and intentionally editable content
- Resend for validated, server-side contact submissions
- GA4 loaded only after affirmative cookie consent
- Vercel native Git integration for preview and production deployments

Shopify integration is explicitly outside Phase 1.

## Ownership

Production services and accounts (GitHub, Vercel, Sanity, Resend, Search Console, and Analytics) should be owned by Continental Auto Parts or FREMARCA, with developer access granted as needed.

## Homepage design preview

The homepage uses original generated automotive imagery and the supplied official
Continental logo. Volkswagen, Audi, and Porsche also use supplied official artwork;
SEAT remains a text label until its artwork is provided. The reference
mockup informs the visual direction; its offers, phone numbers, and service claims are
not treated as verified business information.

Brand and category shortcuts prefill the inquiry builder. Set
`NEXT_PUBLIC_WHATSAPP_NUMBER` to the verified business number (international format,
digits only) to enable the WhatsApp handoff. Until configured, visitors can copy their
prepared inquiry; no message is sent and no form data is stored. Live inventory is not connected. Promotions currently use clearly labeled sample data;
Sanity account setup is deferred.

The original hero asset is stored locally at `public/images/audi-hero.webp` and
served through Next.js image optimization.

## Promotions

`/promociones` lists active promotions; `/promociones/[slug]` shows each offer and
its conditions. The homepage displays only the promotion referenced by the fixed
`promotionSettings` document. Inactive, scheduled, expired, and unpublished offers
are excluded. Clearing the reference hides the homepage promotion.

Without a Sanity project ID, three labeled examples are served from
`src/lib/promotions.ts`. Once configured, an empty CMS stays empty and a CMS error
shows an unavailable state; fictional discounts never replace live content.

Sanity setup is intentionally deferred. When ready:

1. Create the project/dataset and set the public Sanity variables in `.env.local`.
2. Set `SANITY_STUDIO_PROJECT_ID` and `SANITY_STUDIO_DATASET` to the same values
   in `sanity-studio/.env` or the shell environment used by Studio.
3. Run `npm install --prefix sanity-studio`, then `npm run dev --prefix sanity-studio`.
   Create, activate, and publish promotions.
4. Open **Promoción de portada**, select one promotion, and publish.

For a private dataset, configure a read-only `SANITY_API_TOKEN` on the Next.js
server. The token is used only for server-side requests. The website queries the
[published perspective](https://www.sanity.io/docs/http-reference/query) on each
request so activation and scheduling apply without rebuilding. No remote CMS
project or documents were created as part of the local demo.

Brand movement uses a slow, seamless CSS transform loop, pauses on hover or keyboard
focus, has a pause control, and respects reduced-motion preferences. The inquiry
builder supports visual brand/part selection, editable model suggestions, and a
year calendar with manual entry.

Studio is an isolated package in `sanity-studio/`; its dependencies are intentionally
not installed with the website. Review and update those dependencies when setting
up the CMS. The site uses the Sanity HTTP API and needs no Studio runtime.

## Official brand resources

The supplied brand manual, official logos, fonts, and heavy-transport catalog are
preserved in `resources/brand/official/`. Read [the brand reference](docs/brand-resources.md)
before future design or content work. It documents approved variants, typography,
color discrepancies, source pages, and the remaining differences from the website.
`resources/brand/manifest.json` records all 46 originals and their SHA-256 hashes.
These source files are internal project references, not public website downloads.


## Hero photographs — source and rights record

The four hero slideshow photographs were supplied by the project owner as JPEG
attachments on 2026-09-28, with the Unsplash URLs below. These URLs are preserved
as supplied for future attribution and legal review. The website uses local
WebP derivatives (maximum width 2200px, quality 85); responsive cropping and
dark overlays are applied by CSS. Original attachment hashes are recorded below.

| Photo / local derivative | Source supplied by owner | Photographer shown on source page |
| --- | --- | --- |
| Audi — `public/images/hero/audi.webp` | [Unsplash](https://unsplash.com/photos/the-interior-of-a-car-with-a-steering-wheel-and-dashboard-FS_xLSg8lKI) | Александр Бендус (@alexandr_bendus) |
| Volkswagen — `public/images/hero/volkswagen.webp` | [Unsplash](https://unsplash.com/photos/red-honda-car-on-green-grass-field-during-daytime-sk3sHkDsscI) | Muhammed Akthar (@aktharnavas) |
| SEAT — `public/images/hero/seat.webp` | [Unsplash](https://unsplash.com/photos/black-bmw-m-3-parked-near-white-building-J_Xo43mn5tY) | Marcel Strauß (@martzzl) |
| Porsche — `public/images/hero/porsche.webp` | [Unsplash](https://unsplash.com/photos/a-black-sports-car-parked-in-front-of-a-garage-JUiftQpriyo) | Nejc Soklič |

The Audi, SEAT, and Porsche source pages were checked on 2026-09-28. The corrected
Volkswagen source was supplied and checked on 2026-10-01. All four pages display
the Unsplash License. This is a provenance record, not a determination of all
usage rights or a claim of endorsement by the vehicle brands. For future review,
retain the applicable [Unsplash license](https://unsplash.com/license) and any
permission/release records with the project.

Outstanding source issues:
- **Volkswagen:** the source page title describes a “red honda car,” while its
  tags identify a Volkswagen Polo and the supplied attachment shows a Volkswagen.
  Preserve the source URL and this discrepancy in the provenance record.
- **SEAT:** the supplied page title/slug says “black bmw m 3,” while the attachment
  shows a SEAT and the page includes a SEAT tag. Preserve the supplied link;
  the title alone is not reliable vehicle identification.
- Download dates and separate permission/release records were not supplied.

### Attachment fingerprints

SHA-256 hashes identify the exact input files and the shipped derivatives.
They do not establish ownership or license permission.

- **Audi**
  - Input: `codex-clipboard-403f6493-2324-41da-8991-ec9fc493978c.jpg`
  - Input SHA-256: `2c7535cb096aa09d1ff8e7f822d542c9cbbe193f335d370cbe005b782bdf5ec9`
  - WebP SHA-256: `1fd305d60679b345bcfb6bc6128bf19ea7ff0285bea2ca8c1c6454c29271ed73`
- **Volkswagen**
  - Input: `codex-clipboard-d01cbdc9-bd41-4c75-8c89-9ad9e89b597b.jpg`
  - Input SHA-256: `03eff896ddd94766cb36015e6bc189ee881a4ee3fecab7aed0292044ee0bb1fd`
  - WebP SHA-256: `aa98fb491d945432c18c02a22e077876bf1c86ff8661e51c51045b41da720162`
- **SEAT**
  - Input: `codex-clipboard-ca332e41-a3ea-4c90-b50f-d6afb68e22f1.jpg`
  - Input SHA-256: `b42ca819e366148ef96fb1f0592bfc375b5d6ebd168d4df3a7007b3f230562da`
  - WebP SHA-256: `2a7bd5b63136e86ddbe026e1f53b33dc9f6aaab40ecd07216beb4cb1ba242384`
- **Porsche**
  - Input: `codex-clipboard-f6f1984b-d96c-47f9-8827-77bd36ad2fa9.jpg`
  - Input SHA-256: `5afde994fb82eff9c0b61c189f4cc627826c9f6f3df513a23405e1a29d878e29`
  - WebP SHA-256: `33700a067a2c9700e667b36801da3da75afc68eb1e4f2ab3882ffb3d47827f3a`
