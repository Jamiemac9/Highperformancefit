/**
 * Prerender script — renders the React app server-side and writes static HTML.
 *
 * Steps:
 *   1. Build client:  pnpm exec vite build
 *   2. Build SSR:     pnpm exec vite build --config vite.ssr.config.ts
 *   3. Run prerender: node prerender/run.mjs
 *
 * Output: dist/public/index.html (landing) + login/index.html + register/index.html
 */
import { JSDOM } from "jsdom";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, "../dist/public");

// --------------------------------------------------------------------------
// 1. Bootstrap JSDOM — provide window / document / matchMedia for SSR
// --------------------------------------------------------------------------
const dom = new JSDOM(
  '<!DOCTYPE html><html><body><div id="root"></div></body></html>',
  { url: "https://highperformancefit.co.uk/" }
);
globalThis.window = dom.window;
globalThis.document = dom.window.document;
Object.defineProperty(globalThis, "navigator", {
  value: dom.window.navigator, writable: true, configurable: true,
});
Object.defineProperty(globalThis, "location", {
  value: dom.window.location, writable: true, configurable: true,
});
globalThis.requestAnimationFrame = () => 0;
globalThis.cancelAnimationFrame = () => {};
globalThis.window.matchMedia = (query) => ({
  matches: false, media: query, onchange: null,
  addListener() {}, removeListener() {},
  addEventListener() {}, removeEventListener() {}, dispatchEvent() { return false; },
});
globalThis.window.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} };
globalThis.window.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };

// Polyfill import.meta.env (SSR context)
globalThis.import = {
  meta: { env: { BASE_URL: "/", DEV: false, PROD: true, MODE: "production", SSR: true } },
};

// --------------------------------------------------------------------------
// 2. Load the SSR bundle and render each route
// --------------------------------------------------------------------------
const ssrBundle = path.resolve(__dirname, "../dist/ssr/ssr.js");

async function prerenderRoute({ route, title, description }) {
  let render;
  try {
    const mod = await import(ssrBundle);
    render = mod.render;
  } catch (e) {
    console.error(`[prerender] Cannot load SSR bundle: ${e.message}`);
    process.exit(1);
  }

  const markup = render(route);
  return { html: markup, helmet: { title, description } };
}

// --------------------------------------------------------------------------
// 3. Build the final HTML files
// --------------------------------------------------------------------------
function buildHtml(route, rendered) {
  const baseHtml = fs.readFileSync(path.resolve(__dirname, "../index.html"), "utf-8");

  const injected = baseHtml.replace(
    /<div id="root"><\/div>/,
    `<div id="root">${rendered.html}</div>`
  );

  const titled = injected.replace(
    /<title>[^<]*<\/title>/,
    `<title>${rendered.helmet.title}</title>`
  );

  const described = titled.replace(
    /<meta name="description" content="[^"]*" \/>/,
    `<meta name="description" content="${rendered.helmet.description}" />`
  ).replace(
    /<link rel="canonical" href="[^"]*" \/>/,
    `<link rel="canonical" href="https://highperformancefit.co.uk${route === "/" ? "/" : route}" />`
  );

  const noscript = `
<noscript>
  <div style="background:#0D1B2A;color:#fff;padding:48px 24px;text-align:center;font-family:Arial,sans-serif;">
    <h1 style="font-size:32px;margin:0 0 16px;">High Performance Fit</h1>
    <p style="font-size:18px;margin:0 0 24px;max-width:600px;margin-left:auto;margin-right:auto;">
      Personal training in Birmingham and worldwide. 13 years, 200+ transformations.
      JavaScript is required to use the booking system, but you can still contact us directly.
    </p>
    <a href="tel:+447753226214" style="display:inline-block;background:#1E90FF;color:#fff;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:bold;margin:8px;">
      Call 07753 226 214
    </a>
    <a href="mailto:hello@highperformancefit.co.uk" style="display:inline-block;background:transparent;color:#1E90FF;border:2px solid #1E90FF;padding:12px 26px;border-radius:8px;text-decoration:none;font-weight:bold;margin:8px;">
      Email hello@highperformancefit.co.uk
    </a>
  </div>
</noscript>`;

  const finalHtml = described.replace("</body>", `${noscript}\n</body>`);

  // Preserve existing asset references — rewrite them to match BASE_PATH if needed
  const outputPath = path.join(OUT_DIR, route === "/" ? "index.html" : route + "/index.html");
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, finalHtml, "utf-8");
  console.log(`[prerender] ✓ ${route} → ${path.relative(OUT_DIR, outputPath)}`);
}

// --------------------------------------------------------------------------
// 4. Run
// --------------------------------------------------------------------------
const routes = [
  {
    route: "/",
    title: "High Performance Fit — Personal Training Birmingham & Online",
    description: "High Performance Fit — Personal training in Birmingham and worldwide. 13 years experience, 200+ transformations. 1-to-1 in-person and online coaching. Book your free consultation.",
  },
  {
    route: "/login",
    title: "Sign In — High Performance Fit",
    description: "Sign in to your High Performance Fit client portal to book sessions, track progress, and manage your training packages.",
  },
  {
    route: "/register",
    title: "Create Account — High Performance Fit",
    description: "Create your free High Performance Fit account to start booking personal training sessions and tracking your fitness progress.",
  },
];

for (const r of routes) {
  const rendered = await prerenderRoute(r);
  buildHtml(r.route, rendered);
}

console.log("[prerender] Done. All static HTML files written to dist/public/");
