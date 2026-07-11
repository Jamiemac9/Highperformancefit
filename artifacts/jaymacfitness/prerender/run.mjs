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
// Per-page JSON-LD schema generators
// --------------------------------------------------------------------------
function wrapSchema(data) {
  return `<script type="application/ld+json">\n${JSON.stringify(data, null, 2)}\n</script>`;
}

function ptSchema() {
  const now = new Date().toISOString().split("T")[0];
  return wrapSchema({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${BASE_URL}/personal-training-birmingham/#service`,
        "name": "1-to-1 Personal Training Birmingham",
        "description": "One-to-one personal training at Foundry Gym in Kings Heath, Birmingham. Custom programmes, nutrition support, progress tracking and flexible scheduling.",
        "provider": { "@type": "LocalBusiness", "@id": `${BASE_URL}/#localbusiness` },
        "areaServed": { "@type": "City", "name": "Birmingham" },
        "serviceType": "Personal Training",
        "offers": {
          "@type": "Offer",
          "price": "45.00",
          "priceCurrency": "GBP",
          "priceValidUntil": "2027-12-31",
          "availability": "https://schema.org/InStock",
          "url": `${BASE_URL}/personal-training-birmingham`,
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "reviewCount": "127",
        },
      },
      {
        "@type": "LocalBusiness",
        "@id": `${BASE_URL}/#localbusiness`,
        "name": "High Performance Fit",
        "image": `${BASE_URL}/opengraph.jpg`,
        "url": BASE_URL + "/",
        "telephone": "+447753226214",
        "email": "hello@highperformancefit.co.uk",
        "priceRange": "£45–£60 per session",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Foundry Gym, Kings Heath",
          "addressLocality": "Birmingham",
          "postalCode": "B14 7JZ",
          "addressCountry": "GB",
        },
        "geo": { "@type": "GeoCoordinates", "latitude": 52.436, "longitude": -1.892 },
        "openingHoursSpecification": [
          { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"], "opens": "06:00", "closes": "21:00" },
          { "@type": "OpeningHoursSpecification", "dayOfWeek": "Saturday", "opens": "08:00", "closes": "18:00" },
          { "@type": "OpeningHoursSpecification", "dayOfWeek": "Sunday", "opens": "09:00", "closes": "16:00" },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${BASE_URL}/personal-training-birmingham/#faqpage`,
        "mainEntity": [
          { "@type": "Question", "name": "How much does personal training cost in Birmingham?", "acceptedAnswer": { "@type": "Answer", "text": "Sessions start from £45 per hour when bought in a block. Single sessions are £55. Monthly packages with payment plans available. No contract." } },
          { "@type": "Question", "name": "Do I need a gym membership at Foundry Gym?", "acceptedAnswer": { "@type": "Answer", "text": "No. Your training fee covers gym access during our sessions. Discounted day passes available for independent training." } },
          { "@type": "Question", "name": "How many sessions per week do I need?", "acceptedAnswer": { "@type": "Answer", "text": "Most clients train 2–3 times per week with the coach and do 1–2 independent sessions. Beginners often start with 2 sessions." } },
          { "@type": "Question", "name": "What if I have an injury or medical condition?", "acceptedAnswer": { "@type": "Answer", "text": "Every exercise is modified to your body. I work with clients post-injury and with conditions like diabetes, hypertension and arthritis." } },
          { "@type": "Question", "name": "How long until I see results?", "acceptedAnswer": { "@type": "Answer", "text": "Most clients feel stronger within 2–3 weeks. Visible body composition changes typically show within 6–8 weeks with consistency." } },
          { "@type": "Question", "name": "Can I train with a partner or friend?", "acceptedAnswer": { "@type": "Answer", "text": "Yes — partner training (2 people) is £70 per session total (£35 each). Great for accountability without the group dynamic." } },
        ],
      },
    ],
  });
}

function onlineSchema() {
  return wrapSchema({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${BASE_URL}/online-coaching/#service`,
        "name": "Online Personal Training UK & Worldwide",
        "description": "Custom training programmes, weekly video check-ins, form reviews and direct WhatsApp access. Online personal training with Jay Macdonald.",
        "provider": { "@type": "Organization", "@id": `${BASE_URL}/#organization` },
        "areaServed": { "@type": "Country", "name": "United Kingdom" },
        "serviceType": "Online Coaching",
        "offers": {
          "@type": "Offer",
          "price": "49.00",
          "priceCurrency": "GBP",
          "priceValidUntil": "2027-12-31",
          "availability": "https://schema.org/InStock",
          "url": `${BASE_URL}/online-coaching`,
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${BASE_URL}/online-coaching/#faqpage`,
        "mainEntity": [
          { "@type": "Question", "name": "How does online personal training actually work?", "acceptedAnswer": { "@type": "Answer", "text": "Complete an intake form, receive a custom programme via our app, weekly 15-minute video check-ins, form video reviews and daily WhatsApp access." } },
          { "@type": "Question", "name": "What equipment do I need for online coaching?", "acceptedAnswer": { "@type": "Answer", "text": "Minimum: a phone and open space. Preferred: dumbbells or resistance bands. Programmes are designed around what you have." } },
          { "@type": "Question", "name": "How much does online coaching cost?", "acceptedAnswer": { "@type": "Answer", "text": "Standard plan from £49/week (£196/month). Premium with weekly video calls and full nutrition planning is £79/week. No contract." } },
          { "@type": "Question", "name": "What time zones do you cover?", "acceptedAnswer": { "@type": "Answer", "text": "Based in Birmingham (GMT/BST) but coach clients across UK, Europe, US East Coast, Middle East and Asia." } },
          { "@type": "Question", "name": "How do video form reviews work?", "acceptedAnswer": { "@type": "Answer", "text": "Record exercises on your phone, upload via WhatsApp or app. Reviewed within 24 hours with detailed corrections and cues." } },
          { "@type": "Question", "name": "Is online coaching as effective as in-person training?", "acceptedAnswer": { "@type": "Answer", "text": "For self-motivated clients, yes — sometimes more so because you train more frequently. Accountability comes from weekly check-ins and daily access." } },
        ],
      },
    ],
  });
}

function groupSchema() {
  return wrapSchema({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${BASE_URL}/group-training/#service`,
        "name": "Small Group Personal Training Birmingham",
        "description": "Train in a small group of 4–6 people with the intensity of 1-to-1 coaching and the motivation of a team. Based at Foundry Gym in Kings Heath, Birmingham.",
        "provider": { "@type": "LocalBusiness", "@id": `${BASE_URL}/#localbusiness` },
        "areaServed": { "@type": "City", "name": "Birmingham" },
        "serviceType": "Group Training",
        "offers": {
          "@type": "Offer",
          "price": "23.60",
          "priceCurrency": "GBP",
          "priceValidUntil": "2027-12-31",
          "availability": "https://schema.org/InStock",
          "url": `${BASE_URL}/group-training`,
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${BASE_URL}/group-training/#faqpage`,
        "mainEntity": [
          { "@type": "Question", "name": "How many people are in a group training session?", "acceptedAnswer": { "@type": "Answer", "text": "Groups are capped at 4–6 people. Small enough for individual attention, large enough for real energy." } },
          { "@type": "Question", "name": "Do I need to be at the same fitness level as everyone else?", "acceptedAnswer": { "@type": "Answer", "text": "No. Every exercise has progressions and regressions. Beginners and intermediates can train side by side." } },
          { "@type": "Question", "name": "How much does group training cost compared to 1-to-1?", "acceptedAnswer": { "@type": "Answer", "text": "Group sessions are roughly 40–50% cheaper per person. 8 sessions/month is £189 (£23.60/session) vs £45/session for 1-to-1." } },
          { "@type": "Question", "name": "What times are group sessions available?", "acceptedAnswer": { "@type": "Answer", "text": "Current groups: Tuesday & Thursday 18:30, Saturday 09:00. Morning groups forming for early risers." } },
          { "@type": "Question", "name": "Can I try a session before committing?", "acceptedAnswer": { "@type": "Answer", "text": "Yes — your first group session is free. Come along, meet the group and see how sessions run. No pressure." } },
          { "@type": "Question", "name": "What if I miss a session?", "acceptedAnswer": { "@type": "Answer", "text": "You can join another group the same week (subject to space) or swap for a discounted 30-minute 1-to-1 catch-up." } },
        ],
      },
    ],
  });
}

function outdoorSchema() {
  return wrapSchema({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${BASE_URL}/outdoor-training/#service`,
        "name": "Outdoor Personal Training Birmingham",
        "description": "Outdoor training sessions in Birmingham parks and open spaces. Bodyweight and environment-based workouts using hills, stairs, trees and natural terrain.",
        "provider": { "@type": "LocalBusiness", "@id": `${BASE_URL}/#localbusiness` },
        "areaServed": { "@type": "City", "name": "Birmingham" },
        "serviceType": "Outdoor Training",
        "offers": {
          "@type": "Offer",
          "price": "25.00",
          "priceCurrency": "GBP",
          "priceValidUntil": "2027-12-31",
          "availability": "https://schema.org/InStock",
          "url": `${BASE_URL}/outdoor-training`,
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${BASE_URL}/outdoor-training/#faqpage`,
        "mainEntity": [
          { "@type": "Question", "name": "What happens if it rains during an outdoor session?", "acceptedAnswer": { "@type": "Answer", "text": "Light rain — we train. Heavy rain or thunderstorms — we move to a covered area or Foundry Gym as backup. Text sent 2 hours before if location changes." } },
          { "@type": "Question", "name": "What equipment do I need to bring?", "acceptedAnswer": { "@type": "Answer", "text": "Comfortable kit, trainers with grip and a water bottle. The coach brings all equipment: kettlebells, bands, ropes, ladders." } },
          { "@type": "Question", "name": "Where exactly do outdoor sessions take place?", "acceptedAnswer": { "@type": "Answer", "text": "Kings Heath Park, Cannon Hill Park, Moseley Park and Highbury Park. Exact spot confirmed 24 hours before each session." } },
          { "@type": "Question", "name": "How much does outdoor training cost?", "acceptedAnswer": { "@type": "Answer", "text": "Group outdoor (4–6 people): £25/session or £85/month for 4 sessions. 1-to-1 outdoor: £60/session. All equipment provided." } },
          { "@type": "Question", "name": "Is outdoor training as effective as gym training?", "acceptedAnswer": { "@type": "Answer", "text": "For most goals, yes. Natural terrain challenges your body in ways gym machines can't. Builds functional strength and mental resilience." } },
          { "@type": "Question", "name": "What should I wear for outdoor training?", "acceptedAnswer": { "@type": "Answer", "text": "Layer up. Winter: base layer, mid-layer, waterproof jacket, hat and gloves. Summer: breathable top, shorts, sunscreen and cap." } },
        ],
      },
    ],
  });
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
function buildHtml(route, rendered, schema = false) {
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

  // Inject JSON-LD schema before </head>
  let withSchema = described;
  if (schema === true) {
    withSchema = described.replace("</head>", `${jsonLdSchema()}\n</head>`);
  } else if (typeof schema === "string" && schema.length > 0) {
    withSchema = described.replace("</head>", `${schema}\n</head>`);
  }

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
    title: "Personal Training Birmingham — 1-to-1 Coaching That Works | High Performance Fit",
    description: "1-to-1 personal training in Birmingham at Foundry Gym, Kings Heath. Custom programmes, nutrition support, progress tracking. Free consultation. Sessions from £45.",
    schema: ptSchema(),
  },
  {
    route: "/online-coaching",
    title: "Online Personal Training UK & Worldwide — Custom Plans, Real Results | High Performance Fit",
    description: "Online personal coaching with custom programmes, video form reviews, weekly check-ins and WhatsApp access. Clients in 5+ countries. From £49/week.",
    schema: onlineSchema(),
  },
  {
    route: "/group-training",
    title: "Small Group Personal Training Birmingham — Accountability & Energy | High Performance Fit",
    description: "Small group training in Birmingham for 4–6 people. Team energy, structured sessions, individual attention. From £23.60/session. Free trial.",
    schema: groupSchema(),
  },
  {
    route: "/outdoor-training",
    title: "Outdoor Personal Training Birmingham — Fresh Air, No Machines | High Performance Fit",
    description: "Outdoor training in Birmingham parks. Bodyweight, kettlebells, natural terrain. Kings Heath Park, Cannon Hill Park. Group £25, 1-to-1 £60. Free taster.",
    schema: outdoorSchema(),
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
