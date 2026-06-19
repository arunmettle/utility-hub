# Cobalt

Cobalt is a privacy-first React and Vite app with browser-based developer utilities for formatting data, reviewing diffs, inspecting delivery configs, and transforming payloads without server round-trips.

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

Cobalt is designed so pasted payloads, headers, tokens, diffs, and config snippets stay in the browser. The tools do not require a backend for normal use.
