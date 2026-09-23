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
