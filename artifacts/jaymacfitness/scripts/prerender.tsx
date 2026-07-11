/**
 * Prerender script: renders the React app server-side and injects the result
 * into index.html so Google and social crawlers see full HTML content.
 *
 * Run: pnpm exec tsx scripts/prerender.ts
 *
 * Output: dist/public/index.html (complete with rendered markup)
 */
import { JSDOM } from "jsdom";
import fs from "fs";
import path from "path";

// --------------------------------------------------------------------------
// 1. Bootstrap JSDOM — provide window / document / matchMedia for SSR
// --------------------------------------------------------------------------
const dom = new JSDOM('<!DOCTYPE html><html><body><div id="root"></div></body></html>', {
  url: "https://highperformancefit.co.uk/",
});
(globalThis as any).window = dom.window;
(globalThis as any).document = dom.window.document;
(globalThis as any).navigator = dom.window.navigator;
(globalThis as any).location = dom.window.location;
(globalThis as any).requestAnimationFrame = () => 0;
(globalThis as any).cancelAnimationFrame = () => {};

// matchMedia is used by scroll-reveal and hero animation
(globalThis as any).window.matchMedia = (query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: () => {},
  removeListener: () => {},
  addEventListener: () => {},
  removeEventListener: () => {},
  dispatchEvent: () => false,
} as any);

// IntersectionObserver is used by scroll-reveal and Counter (SSR = no viewport)
(globalThis as any).window.IntersectionObserver = class IntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
} as any;

// --------------------------------------------------------------------------
// 2. Polyfill import.meta.env so BrowserRouter doesn't explode during SSR
// --------------------------------------------------------------------------
(globalThis as any).import = { meta: { env: { BASE_URL: "/", DEV: false, PROD: true } } };

// --------------------------------------------------------------------------
// 3. Import React SSR renderer and route renderer
// --------------------------------------------------------------------------
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { QueryClient, QueryClientProvider, dehydrate } from "@tanstack/react-query";

// --------------------------------------------------------------------------
// 4. Import the app pages we want to prerender
// --------------------------------------------------------------------------
import Landing from "../src/pages/landing";
import Login from "../src/pages/login";
import Register from "../src/pages/register";

// --------------------------------------------------------------------------
// 5. Prerender a single route
// --------------------------------------------------------------------------
function prerenderRoute({
  route,
  title,
  description,
}: {
  route: string;
  title: string;
  description: string;
}): { html: string; helmet: { title: string; description: string } } {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, refetchOnWindowFocus: false },
    },
  });

  // Pre-populate the public packages query so the landing page renders cards
  const packages = [
    {
      id: "prerender-starter",
      name: "Starter",
      type: "IN_PERSON",
      sessions: 5,
      price: "250",
      pricePerSession: "50",
      description: "5 sessions — perfect to kick-start your fitness journey.",
      highlights: ["5 1-on-1 sessions", "Initial assessment & goal setting", "Custom workout plan", "Nutrition guidance"],
      isActive: true,
      featured: false,
      stripeLink: null,
    },
    {
      id: "prerender-commitment",
      name: "Commitment",
      type: "IN_PERSON",
      sessions: 10,
      price: "350",
      pricePerSession: "35",
      description: "10 sessions — the sweet spot for real momentum.",
      highlights: ["10 1-on-1 sessions", "Full body composition tracking", "Weekly check-ins", "Nutrition coaching"],
      isActive: true,
      featured: false,
      stripeLink: null,
    },
    {
      id: "prerender-group",
      name: "Group",
      type: "GROUP",
      sessions: 8,
      price: "200",
      pricePerSession: "25",
      description: "8 small-group sessions — train with friends, split the cost.",
      highlights: ["8 group sessions", "Up to 4 people", "Shared programming", "Team accountability"],
      isActive: true,
      featured: false,
      stripeLink: null,
    },
    {
      id: "prerender-transformation",
      name: "Transformation",
      type: "IN_PERSON",
      sessions: 24,
      price: "840",
      pricePerSession: "35",
      description: "24 sessions — complete body transformation over 12 weeks.",
      highlights: ["24 1-on-1 sessions", "Weekly progress photos", "Full meal plan", "Unlimited WhatsApp support"],
      isActive: true,
      featured: true,
      stripeLink: null,
    },
  ];

  queryClient.setQueryData(["packages", "public"], packages);

  let PageComponent: any;
  if (route === "/") PageComponent = Landing;
  else if (route === "/login") PageComponent = Login;
  else if (route === "/register") PageComponent = Register;
  else PageComponent = () => null;

  const markup = renderToString(
    <QueryClientProvider client={queryClient}>
      <StaticRouter location={route}>
        <PageComponent />
      </StaticRouter>
    </QueryClientProvider>
  );

  return {
    html: markup,
    helmet: { title, description },
  };
}

// --------------------------------------------------------------------------
// 6. Build the final HTML files
// --------------------------------------------------------------------------
const OUT_DIR = path.resolve(import.meta.dirname, "../dist/public");

function buildHtml(route: string, rendered: { html: string; helmet: { title: string; description: string } }) {
  const baseHtml = fs.readFileSync(
    path.resolve(import.meta.dirname, "../index.html"),
    "utf-8"
  );

  // Inject the prerendered markup into <div id="root"></div>
  const rootPattern = /<div id="root"><\/div>/;
  const injected = baseHtml.replace(
    rootPattern,
    `<div id="root">${rendered.html}</div>`
  );

  // Replace generic <title> with route-specific one
  const titled = injected.replace(
    /<title>[^<]*<\/title>/,
    `<title>${rendered.helmet.title}</title>`
  );

  // Replace generic meta description with route-specific one
  const described = titled.replace(
    /<meta name="description" content="[^"]*" \/>/,
    `<meta name="description" content="${rendered.helmet.description}" />`
  );

  // Add <noscript> fallback with core CTA after the root div
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

  // Write to the output directory
  const outputPath = path.join(OUT_DIR, route === "/" ? "index.html" : route + "/index.html");
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, finalHtml, "utf-8");
  console.log(`[prerender] ✓ ${route} → ${path.relative(OUT_DIR, outputPath)}`);
}

// --------------------------------------------------------------------------
// 7. Run
// --------------------------------------------------------------------------
const routes = [
  {
    route: "/",
    title: "High Performance Fit — Personal Training Birmingham & Online",
    description:
      "High Performance Fit — Personal training in Birmingham and worldwide. 13 years experience, 200+ transformations. 1-to-1 in-person and online coaching. Book your free consultation.",
  },
  {
    route: "/login",
    title: "Sign In — High Performance Fit",
    description:
      "Sign in to your High Performance Fit client portal to book sessions, track progress, and manage your training packages.",
  },
  {
    route: "/register",
    title: "Create Account — High Performance Fit",
    description:
      "Create your free High Performance Fit account to start booking personal training sessions and tracking your fitness progress.",
  },
];

for (const r of routes) {
  const rendered = prerenderRoute(r);
  buildHtml(r.route, rendered);
}

console.log("[prerender] Done. All static HTML files written to dist/public/");
