---
name: SSR/Prerender Pipeline for Vite React
description: How to prerender a Vite React app with JSDOM-based SSR, avoiding Puppeteer/Chromium entirely.
---

## Problem
Vite-plugin-prerender requires Puppeteer which needs Chromium binary approval in sandboxed environments. Alternative: use `react-dom/server` + JSDOM for pure Node.js SSR.

## Pipeline
1. **Client build**: `vite build --config vite.config.ts` → `dist/public/` (JS bundles + base index.html)
2. **SSR bundle build**: `vite build --config vite.ssr.config.ts` (SSR: true, input: src/ssr.tsx) → `dist/ssr/ssr.js`
3. **Prerender script**: `node prerender/run.mjs`
   - Bootstraps JSDOM with window/document/matchMedia/IntersectionObserver/ResizeObserver polyfills
   - Polyfills `import.meta.env` for SSR context
   - Imports the SSR bundle, calls `render(url)` for each route
   - Injects rendered HTML into `<div id="root">` in index.html
   - Replaces `<title>`, `<meta name="description">`, `<link rel="canonical">` per route
   - Adds `<noscript>` fallback with CTA
   - **Must call `dom.window.close()` + `process.exit(0)` to prevent JSDOM handle leaks**

## SSR Entry (src/ssr.tsx)
- Wraps pages in `QueryClientProvider`, `AuthProvider`, `TooltipProvider`, `StaticRouter`
- Pre-populates `queryClient.setQueryData(["packages", "public"], [...])` so landing page renders cards
- Uses `React.createElement()` (no JSX) to avoid esbuild JSX transpilation issues in the prerender script itself

## SSR-Safe Guards in Page Code
- `typeof window !== "undefined"` before accessing `window.location`, `window.matchMedia`, etc.
- `typeof document !== "undefined"` before DOM access
- Event handlers don't need guards (only run client-side)
- React fragments `<>` `</>` for adjacent elements at root level

## Production Rewrites (artifact.toml)
Put specific routes BEFORE the catch-all:
```toml
[[services.production.rewrites]]
from = "/login"
to = "/login/index.html"

[[services.production.rewrites]]
from = "/register"
to = "/register/index.html"

[[services.production.rewrites]]
from = "/*"
to = "/index.html"
```

## Why
- Googlebot sees full HTML instead of empty `<div id="root">`
- Social crawlers get Open Graph tags + rendered content
- `<noscript>` fallback for users without JS
