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
const BASE_URL = "https://highperformancefit.co.uk";

// --------------------------------------------------------------------------
// 1. Bootstrap JSDOM — provide window / document / matchMedia for SSR
// --------------------------------------------------------------------------
const dom = new JSDOM(
  '<!DOCTYPE html><html><body><div id="root"></div></body></html>',
  { url: BASE_URL + "/" }
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
// 2. JSON-LD Schema — rich structured data for Google
// --------------------------------------------------------------------------
function jsonLdSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${BASE_URL}/#website`,
        url: BASE_URL + "/",
        name: "High Performance Fit",
        description:
          "Personal training in Birmingham and worldwide. 13 years experience, 200+ transformations. 1-to-1 in-person and online coaching.",
        publisher: { "@id": `${BASE_URL}/#organization` },
      },
      {
        "@type": "Organization",
        "@id": `${BASE_URL}/#organization`,
        name: "High Performance Fit",
        url: BASE_URL + "/",
        logo: {
          "@type": "ImageObject",
          url: `${BASE_URL}/opengraph.jpg`,
          width: 1200,
          height: 630,
        },
        sameAs: [
          "https://www.instagram.com/jaymacjm/",
          "https://www.facebook.com/jay.pt.58",
        ],
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+447753226214",
          contactType: "customer service",
          email: "hello@highperformancefit.co.uk",
          areaServed: "GB",
          availableLanguage: "English",
        },
      },
      {
        "@type": "Person",
        "@id": `${BASE_URL}/#person`,
        name: "Jay",
        jobTitle: "Personal Trainer & Founder",
        worksFor: { "@type": "Organization", name: "High Performance Fit" },
        description:
          "Personal trainer with 13 years experience and 200+ client transformations. Specialist in weight loss, strength training, online coaching and injury rehabilitation. Based at Foundry Gym, Kings Heath, Birmingham.",
        alumniOf: [
          { "@type": "EducationalOrganization", name: "REPS Level 3 Personal Trainer" },
          { "@type": "EducationalOrganization", name: "NASM Certified Personal Trainer" },
        ],
        knowsAbout: [
          "Weight loss",
          "Strength training",
          "Online coaching",
          "Injury rehabilitation",
          "Nutrition coaching",
        ],
        image: `${BASE_URL}/jay-headshot.jpg`,
      },
      {
        "@type": "LocalBusiness",
        "@id": `${BASE_URL}/#localbusiness`,
        name: "High Performance Fit",
        url: BASE_URL + "/",
        telephone: "+447753226214",
        email: "hello@highperformancefit.co.uk",
        priceRange: "\u00a3\u00a3",
        image: `${BASE_URL}/opengraph.jpg`,
        address: {
          "@type": "PostalAddress",
          streetAddress: "Foundry Gym, Kings Heath",
          addressLocality: "Birmingham",
          addressRegion: "West Midlands",
          postalCode: "B14 7JZ",
          addressCountry: "GB",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 52.436,
          longitude: -1.892,
        },
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            opens: "06:00",
            closes: "21:00",
          },
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: "Saturday",
            opens: "08:00",
            closes: "18:00",
          },
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: "Sunday",
            opens: "09:00",
            closes: "16:00",
          },
        ],
        areaServed: [
          "Birmingham",
          "Kings Heath",
          "Moseley",
          "Edgbaston",
          "Harborne",
          "Solihull",
          "Online worldwide",
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Personal Training Packages",
          url: `${BASE_URL}/#packages`,
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "5",
          reviewCount: "100",
        },
      },
      {
        "@type": "Service",
        "@id": `${BASE_URL}/#service-1to1`,
        name: "1-to-1 Personal Training Birmingham",
        provider: { "@id": `${BASE_URL}/#localbusiness` },
        areaServed: {
          "@type": "City",
          name: "Birmingham",
        },
        serviceType: "Personal Training",
        description:
          "One-to-one personal training sessions at Foundry Gym in Kings Heath, Birmingham. Fully bespoke programmes built for your goals, body and schedule.",
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "1-to-1 Training Packages",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Starter Package",
                description: "5 sessions — perfect to kick-start your fitness journey.",
              },
              price: "250",
              priceCurrency: "GBP",
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Commitment Package",
                description: "10 sessions — the sweet spot for real momentum.",
              },
              price: "350",
              priceCurrency: "GBP",
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Transformation Package",
                description: "24 sessions — complete body transformation over 12 weeks.",
              },
              price: "840",
              priceCurrency: "GBP",
            },
          ],
        },
      },
      {
        "@type": "Service",
        "@id": `${BASE_URL}/#service-group`,
        name: "Group Training Birmingham",
        provider: { "@id": `${BASE_URL}/#localbusiness` },
        areaServed: {
          "@type": "City",
          name: "Birmingham",
        },
        serviceType: "Group Training",
        description:
          "Small-group training sessions for up to 4 people. Train with friends, split the cost, and stay accountable together.",
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Group Training Packages",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Group Package",
                description: "8 group sessions — up to 4 people.",
              },
              price: "200",
              priceCurrency: "GBP",
            },
          ],
        },
      },
      {
        "@type": "Service",
        "@id": `${BASE_URL}/#service-online`,
        name: "Online Coaching Worldwide",
        provider: { "@id": `${BASE_URL}/#localbusiness` },
        areaServed: {
          "@type": "Country",
          name: "Worldwide",
        },
        serviceType: "Online Coaching",
        description:
          "Fully bespoke online training programmes with weekly check-ins, video form reviews and direct WhatsApp support. Available worldwide.",
      },
      {
        "@type": "FAQPage",
        "@id": `${BASE_URL}/#faq`,
        mainEntity: [
          {
            "@type": "Question",
            name: "What areas do you cover?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "I'm based at Foundry Gym in Kings Heath and primarily coach clients across South and Central Birmingham. Online coaching is available worldwide.",
            },
          },
          {
            "@type": "Question",
            name: "Do you offer online training?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. Online clients get a fully bespoke training programme, weekly check-ins, video form reviews and direct WhatsApp access between sessions.",
            },
          },
          {
            "@type": "Question",
            name: "How do I get started?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Fill in the enquiry form below or book a free consultation. We'll have a 20-minute chat about your goals and figure out the right plan for you.",
            },
          },
          {
            "@type": "Question",
            name: "What should I bring to a session?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Comfortable training kit, indoor trainers, a water bottle and a towel. That's it — everything else is provided at the gym.",
            },
          },
          {
            "@type": "Question",
            name: "Are nutrition plans included?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Every package includes nutrition guidance. Full bespoke meal plans are available as an add-on if you want extra structure.",
            },
          },
          {
            "@type": "Question",
            name: "How do I pay?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Packages can be paid up-front by bank transfer or split into monthly direct debits. Everything is set up after your free consultation.",
            },
          },
        ],
      },
      {
        "@type": "HowTo",
        "@id": `${BASE_URL}/#howitworks`,
        name: "How High Performance Fit Works",
        description: "4-step process from consultation to results",
        totalTime: "PT12W",
        step: [
          {
            "@type": "HowToStep",
            position: 1,
            name: "Free Consultation",
            text: "Tell me your goals, training history and what's held you back. No pressure, just a conversation.",
            image: `${BASE_URL}/jay-headshot.jpg`,
          },
          {
            "@type": "HowToStep",
            position: 2,
            name: "Personalised Plan",
            text: "Get a programme built for your body, your schedule and the result you actually want.",
          },
          {
            "@type": "HowToStep",
            position: 3,
            name: "Train & Track",
            text: "We train, we measure, we adjust. Every session has a purpose. Every week you progress.",
          },
          {
            "@type": "HowToStep",
            position: 4,
            name: "Get Results",
            text: "Stronger, fitter, leaner — and the habits to keep it that way long after we're done.",
          },
        ],
      },
    ],
  };
  return `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`;
}

// --------------------------------------------------------------------------
// 3. Load the SSR bundle and render each route
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
// 4. Build the final HTML files
// --------------------------------------------------------------------------
function buildHtml(route, rendered, includeSchema = false) {
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
    `<link rel="canonical" href="${BASE_URL}${route === "/" ? "/" : route}" />`
  );

  // Inject JSON-LD schema before </head> on landing page only
  const withSchema = includeSchema
    ? described.replace("</head>", `${jsonLdSchema()}\n</head>`)
    : described;

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

  const finalHtml = withSchema.replace("</body>", `${noscript}\n</body>`);

  const outputPath = path.join(OUT_DIR, route === "/" ? "index.html" : route + "/index.html");
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, finalHtml, "utf-8");
  console.log(`[prerender] \u2713 ${route} \u2192 ${path.relative(OUT_DIR, outputPath)}`);
}

// --------------------------------------------------------------------------
// 5. Run
// --------------------------------------------------------------------------
const routes = [
  {
    route: "/",
    title: "High Performance Fit — Personal Training Birmingham & Online",
    description: "High Performance Fit — Personal training in Birmingham and worldwide. 1-to-1 in-person and online coaching. Book your free consultation.",
    schema: true,
  },
  {
    route: "/personal-training-birmingham",
    title: "1-2-1 Personal Training Birmingham — High Performance Fit",
    description: "One-to-one personal training at Foundry Gym, Kings Heath, Birmingham. Custom programmes, nutrition support and flexible scheduling. Book a free consultation.",
    schema: false,
  },
  {
    route: "/online-coaching",
    title: "Online Coaching — High Performance Fit",
    description: "Custom training programmes, weekly video check-ins, form reviews and direct WhatsApp access. Online personal training with Jay Macdonald.",
    schema: false,
  },
  {
    route: "/group-training",
    title: "Group Training Birmingham — High Performance Fit",
    description: "Small group personal training in Birmingham. Train with 3–6 people, get the energy of a team at a price that makes sense. Free trial session.",
    schema: false,
  },
  {
    route: "/outdoor-training",
    title: "Outdoor Training Birmingham — High Performance Fit",
    description: "Outdoor personal training in Birmingham parks. Bodyweight, kettlebells and resistance bands. Kings Heath Park, Cannon Hill Park and more.",
    schema: false,
  },
  {
    route: "/blog",
    title: "Fitness Blog — High Performance Fit",
    description: "Training tips, insights and advice from Birmingham personal trainer Jay Macdonald. No clickbait — just what actually works.",
    schema: false,
  },
  {
    route: "/about-jay",
    title: "About Jay Macdonald — High Performance Fit",
    description: "Meet Jay — REPS Level 3 qualified personal trainer in Birmingham. 8+ years experience, 500+ clients coached. Book a free consultation.",
    schema: false,
  },
  {
    route: "/faq",
    title: "FAQ — High Performance Fit",
    description: "Frequently asked questions about personal training, online coaching, group sessions and pricing at High Performance Fit Birmingham.",
    schema: false,
  },
  {
    route: "/contact",
    title: "Contact — High Performance Fit",
    description: "Get in touch with High Performance Fit. Call, text or email Jay Macdonald. Free consultation available. Foundry Gym, Kings Heath, Birmingham.",
    schema: false,
  },
  {
    route: "/login",
    title: "Sign In — High Performance Fit",
    description: "Sign in to your High Performance Fit client portal to book sessions, track progress, and manage your training packages.",
    schema: false,
  },
  {
    route: "/register",
    title: "Create Account — High Performance Fit",
    description: "Create your free High Performance Fit account to start booking personal training sessions and tracking your fitness progress.",
    schema: false,
  },
];

for (const r of routes) {
  const rendered = await prerenderRoute(r);
  buildHtml(r.route, rendered, r.schema);
}

console.log("[prerender] Done. All static HTML files written to dist/public/");

// Clean up JSDOM resources so the process exits cleanly
dom.window.close();
process.exit(0);
