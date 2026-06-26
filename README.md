# UtilityHub

UtilityHub is a privacy-first React and Vite app with browser-based developer utilities for formatting data, reviewing diffs, inspecting delivery configs, and transforming payloads without server round-trips.

## Local development

```bash
npm install
npm run dev
```

The dev server runs on `http://localhost:5173`.

## Quality checks

```bash
npm run build
npm run test
npm run test:e2e
```

## Deploying to Cloudflare Pages

UtilityHub is configured for Cloudflare Pages with Pages Functions and D1-backed feedback/wishlist submissions.

- Build command: `npm run build`
- Build output directory: `dist`
- Pages project name: `utilityhub`
- Pages URL: `https://utilityhub-bpp.pages.dev`
- Latest deployment: `1274ba50-d051-4217-8995-3d764b4095b4`
- D1 database name: `utilityhub-submissions`
- D1 binding name: `DB`
- D1 database ID: `63cefa6c-93dd-40be-859c-239a254e20a7`
- Compatibility date: `2026-05-03` (newest date supported by the Node 20-compatible Wrangler version pinned in this repo)

Local Pages runtime with Functions and local D1:

```bash
npm run d1:migrate:local
npm run dev:pages
```

This Cloudflare account already has the Pages project, D1 database, `DB` binding, and a production deployment provisioned. To recreate the database in another account:

```bash
npm run cloudflare:whoami
npx wrangler d1 create utilityhub-submissions
```

Copy the returned D1 `database_id` into [wrangler.jsonc](/C:/Dev/Utility/utility-hub/wrangler.jsonc). For future production deployments from a local shell with Cloudflare auth configured, run:

```bash
npm run d1:migrate:remote
npm run deploy:cloudflare
```

Feedback and wishlist forms post to same-origin Pages Function routes at `/api/feedback` and `/api/wishlist`. The optional `VITE_FEEDBACK_ENDPOINT` and `VITE_WISHLIST_ENDPOINT` environment variables can override those paths.

## Deploying to Vercel

This project is already configured for Vercel static deployment:

- Framework: `vite`
- Build command: `npm run build`
- Output directory: `dist`
- SPA rewrites: enabled in [vercel.json](/C:/Dev/Utility/utility-hub/vercel.json)

Deployment flow:

1. Push the repo to GitHub, GitLab, or Bitbucket.
2. Import the repository into Vercel.
3. Keep the detected build settings or point Vercel to:
   - Build command: `npm run build`
   - Output directory: `dist`
4. Deploy.

## SEO and LLM discovery

The app includes:

- route-level runtime metadata via [src/components/SeoManager.tsx](/C:/Dev/Utility/utility-hub/src/components/SeoManager.tsx)
- crawl files in [public/robots.txt](/C:/Dev/Utility/utility-hub/public/robots.txt) and [public/sitemap.xml](/C:/Dev/Utility/utility-hub/public/sitemap.xml)
- an LLM-readable index in [public/llms.txt](/C:/Dev/Utility/utility-hub/public/llms.txt)
- a machine-readable tool catalog in [public/tool-catalog.json](/C:/Dev/Utility/utility-hub/public/tool-catalog.json)

## Privacy model

UtilityHub is designed so pasted payloads, headers, tokens, diffs, and config snippets stay in the browser. The tools do not require a backend for normal use.
