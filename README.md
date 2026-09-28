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

GitHub Actions intentionally does not deploy the site. Connect this repository to a company-owned Vercel project and set `main` as its production branch.

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
