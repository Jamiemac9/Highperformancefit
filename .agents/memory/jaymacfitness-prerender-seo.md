---
name: jaymacfitness prerender SEO pages
description: How to add a new prerendered/SEO route to the jaymacfitness artifact without breaking SSR, canonicals, or rich results.
---

Adding a new public marketing/SEO route to `artifacts/jaymacfitness` requires edits in **five** places that must stay in sync, or the page will 404 in production, render blank to crawlers, or ship broken structured data:

1. `src/App.tsx` — client `<Route>` (wrap marketing pages in `<MarketingLayout>`).
2. `src/ssr.tsx` — the `render()` URL→component `if/else` chain (used by the prerender step). If a URL is missing here it renders empty HTML.
3. `prerender/run.mjs` — add a `routes[]` entry with `title`, `description`, and per-page JSON-LD `schema`.
4. `.replit-artifact/artifact.toml` — a production rewrite `from = "/route"` → `to = "/route/index.html"` BEFORE the `/*` catch-all. Never edit artifact.toml directly; write to a sibling temp `.toml` and call `verifyAndReplaceArtifactToml`.
5. `public/sitemap.xml` — add the `<url>`.

**Why:** SSR/prerender is hand-wired (no file-based routing). App.tsx and ssr.tsx are independent route tables; forgetting ssr.tsx yields a blank prerender. Missing toml rewrite = 404 on hard nav/refresh in prod.

**FAQPage rule:** any on-page FAQ accordion text MUST match the FAQPage JSON-LD `acceptedAnswer.text` exactly, or Google flags mismatched structured data. For the area pages this is enforced by a single source of truth `src/data/areas.json`, imported by the React component AND by `prerender/run.mjs` via `import ... with { type: "json" }` (Node 24 import attributes; tsconfig has resolveJsonModule). Prefer this shared-JSON approach over duplicating FAQ strings.

**Build/verify:** `pnpm --filter @workspace/jaymacfitness run typecheck`, then `cd artifacts/jaymacfitness && PORT=20026 BASE_PATH=/ pnpm run build`. Build order: vite client → vite ssr → node prerender/run.mjs. Verify output HTML under `dist/public/<route>/index.html` for title, canonical, h1, and schema.
