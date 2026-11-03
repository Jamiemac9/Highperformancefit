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
import { fileURLToPath, pathToFileURL } from "url";
import areas from "../src/data/areas.json" with { type: "json" };

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
          "Real coaching in Kings Heath for people who've tried everything else. 1-2-1, small group, outdoor and online personal training across South Birmingham.",
        publisher: { "@id": `${BASE_URL}/#organization` },
      },
      {
        "@type": "Organization",
        "@id": `${BASE_URL}/#organization`,
        name: "High Performance Fit",
        url: BASE_URL + "/",
        logo: {
          "@type": "ImageObject",
          url: `${BASE_URL}/images/site/hpf-logo-192.png`,
          width: 189,
          height: 192,
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
          { "@type": "EducationalOrganization", name: "Level 4 Advanced Personal Trainer · Level 4 Strength & Conditioning Coach · REPs member" },
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
        image: `${BASE_URL}/og-coaching.jpg`,
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
              text: "Fill in the enquiry form below or book a free consultation. We'll have a 30-minute chat about your goals and figure out the right plan for you.",
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
          name: "Keep the results",
          text: "Stronger, fitter, leaner — and the habits to hold it long after we're done. That's the whole point.",
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
      },
      {
        "@type": "LocalBusiness",
        "@id": `${BASE_URL}/#localbusiness`,
        "name": "High Performance Fit",
        "image": `${BASE_URL}/og-coaching.jpg`,
        "url": BASE_URL + "/",
        "telephone": "+447753226214",
        "email": "hello@highperformancefit.co.uk",
        "priceRange": "£25–£50 per session",
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
          { "@type": "Question", "name": "How much does personal training cost in Birmingham?", "acceptedAnswer": { "@type": "Answer", "text": "Fresh Start is £250 for five 1-2-1 sessions (£50 a session). 1-2-1 Monthly is £280 a month for eight sessions (£35 a session) on direct debit, with no contract." } },
          
          { "@type": "Question", "name": "How many sessions per week do I need?", "acceptedAnswer": { "@type": "Answer", "text": "Two a week is a good starting point for most people, and 1-2-1 Monthly is built around that. The right rhythm is agreed on the free chat." } },
          { "@type": "Question", "name": "What if I have an injury or medical condition?", "acceptedAnswer": { "@type": "Answer", "text": "Rehab-aware programming is a big part of the coaching, backed by Level 4 qualifications in weight management through exercise and in obesity and diabetes. Happy to work alongside your physio or GP." } },
          { "@type": "Question", "name": "How long until I see results?", "acceptedAnswer": { "@type": "Answer", "text": "It depends on your starting point and consistency. As a guide, Amy lost three stone in 14 weeks of 1-2-1 training." } },
          { "@type": "Question", "name": "Can I train with a partner or friend?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Danny and Jen trained together as a couple and lost six stone between them. Ask about partner sessions on the free chat." } },
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
        "description": "Custom training programmes, weekly video check-ins, form reviews and direct WhatsApp access. Online personal training with Jay.",
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
          { "@type": "Question", "name": "How much does online coaching cost?", "acceptedAnswer": { "@type": "Answer", "text": "£120 a month, rolling monthly. No contract." } },
          { "@type": "Question", "name": "Do you coach people outside the UK?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Jay is based in Birmingham (UK time) and has coached online clients in five countries." } },
          { "@type": "Question", "name": "How do video form reviews work?", "acceptedAnswer": { "@type": "Answer", "text": "Record your key lifts on your phone and send them over WhatsApp or the app. Jay comes back with corrections and cues." } },
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
        "description": "Train in a small group of up to four people with PT-level programming. Based at Foundry Gym in Kings Heath, Birmingham. £25 a session in a block of eight.",
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
          { "@type": "Question", "name": "How many people are in a group training session?", "acceptedAnswer": { "@type": "Answer", "text": "A maximum of four people, so everyone gets coached properly." } },
          { "@type": "Question", "name": "Do I need to be at the same fitness level as everyone else?", "acceptedAnswer": { "@type": "Answer", "text": "No. Every exercise has progressions and regressions. Beginners and intermediates can train side by side." } },
          { "@type": "Question", "name": "How much does group training cost?", "acceptedAnswer": { "@type": "Answer", "text": "A Small Group Block is £200 for eight sessions (£25 a session). 1-2-1 starts from £35 a session." } },
          { "@type": "Question", "name": "When do group sessions run?", "acceptedAnswer": { "@type": "Answer", "text": "Sessions are programmed weekly. Ask on the free chat for current times and space." } },
          
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
          { "@type": "Question", "name": "What happens if it rains during an outdoor session?", "acceptedAnswer": { "@type": "Answer", "text": "Light rain, we train. For anything worse we agree a backup plan, and you will always know in advance if the location changes." } },
          { "@type": "Question", "name": "What equipment do I need to bring?", "acceptedAnswer": { "@type": "Answer", "text": "Comfortable kit, trainers with grip and a water bottle. Jay brings the equipment." } },
          { "@type": "Question", "name": "Where exactly do outdoor sessions take place?", "acceptedAnswer": { "@type": "Answer", "text": "Kings Heath Park, Cannon Hill Park or a green space near you. The meeting point is confirmed before each session." } },
          { "@type": "Question", "name": "How much does outdoor training cost?", "acceptedAnswer": { "@type": "Answer", "text": "Outdoor sessions are priced on the free chat, depending on whether you train 1-2-1 or in a small group." } },
          { "@type": "Question", "name": "Is outdoor training as effective as gym training?", "acceptedAnswer": { "@type": "Answer", "text": "For most goals, yes. Hills, steps and open space make a proper workout without machines." } },
          { "@type": "Question", "name": "What should I wear for outdoor training?", "acceptedAnswer": { "@type": "Answer", "text": "Layer up. Winter: base layer, mid-layer, waterproof jacket, hat and gloves. Summer: breathable top, shorts, sunscreen and cap." } },
        ],
      },
    ],
  });
}

function faqSchema() {
  const flatFaqs = [
    // Pricing
    { q: "How much does a personal trainer cost in Birmingham?", a: "Sessions start from \u00a345 per hour when bought in a block. Single sessions are \u00a355. Monthly packages with payment plans are also available. Pricing in Birmingham varies widely depending on experience, location and whether you're training in a commercial gym or independently. At High Performance Fit, you're paying for 13 years of experience and a programme that's built specifically for you\u2014not a generic template. Online coaching starts from \u00a349 per week, which includes your full training programme, weekly check-ins and unlimited WhatsApp support." },
    { q: "Is online coaching cheaper than in-person training?", a: "Yes. Online coaching starts from \u00a349 per week compared to \u00a345\u2013\u00a355 per in-person session, but the value comes from daily access and flexibility rather than just the price tag. With online coaching you get a fully custom programme, video form reviews, weekly 15-minute check-in calls and daily WhatsApp access. Many clients actually progress faster online because they're training more frequently and getting feedback between sessions. It's not \u2018cheaper and worse\u2019\u2014it's a different model that suits busy people, travellers and those who already know their way around a gym." },
    { q: "Do you offer payment plans?", a: "Yes. Monthly direct debit options are available for all block-booking packages. You can also pay upfront by bank transfer if you prefer. The most popular option is splitting a 10-session block into two monthly payments, or a 24-session transformation package across three months. There's no credit check, no interest and no contract\u2014just a simple standing order that you can cancel with 30 days notice. We set this up during your free consultation so it's one less thing to think about." },
    { q: "What's included in the price?", a: "Every session includes a fully personalised workout, real-time coaching on form and technique, programme adjustments based on your progress, and nutrition guidance. You're not just renting an hour of someone's time. I track your body composition, adjust your programme every 2\u20134 weeks, review your nutrition via WhatsApp, and provide homework exercises for the days we don't train together. Online clients get all of this plus video form reviews and a training app that updates your programme automatically." },
    { q: "Are there any hidden fees or contracts?", a: "No hidden fees and no contracts. You pay for the sessions you book and you can stop at any time. The price you see is the price you pay. There's no joining fee, no admin charge and no cancellation penalty (beyond the 24-hour notice policy for individual sessions). I don't believe in locking people in\u2014if the coaching is working, you'll want to continue. If it's not, you shouldn't be stuck." },
    { q: "Can I try a session before committing to a package?", a: "Yes. Start with a free 30-minute chat, so you know exactly what you are getting before you buy anything." },
    // Services
    { q: "What's the difference between 1-to-1 and group training?", a: "1-to-1 training is fully personalised to you\u2014every exercise, every weight, every rest period is tailored. Group training caps at 4\u20136 people with a shared programme but individual attention where needed. In 1-to-1 sessions we can work around injuries, adjust intensity minute-by-minute, and focus on specific weaknesses. Group training is great for people who thrive on energy and accountability\u2014you'll push harder surrounded by others, and it's significantly cheaper per person. I run groups for friends, couples and colleagues who want to train together." },
    { q: "Can you train me if I have an injury?", a: "Yes. I work with clients recovering from injuries and can liaise with your physio or GP to ensure your programme is safe and effective. I've trained clients post-ACL reconstruction, with chronic lower back pain, shoulder impingement and herniated discs. The key is understanding your limitations and building around them\u2014not ignoring them. I often start with movement screening and refer to a physio if needed before loading heavier weights. Recovery isn't a reason to stop training; it's a reason to train smarter." },
    { q: "Do you provide meal plans?", a: "Every package includes nutrition guidance. Full bespoke meal plans are available as an add-on if you want extra structure. Most clients don't need a rigid meal plan\u2014they need education. I teach you how to build balanced meals around your preferences, budget and schedule. If you want a fully written meal plan with recipes, macros and shopping lists, that's available as a separate add-on. The goal is sustainable habits, not a 12-week crash diet you'll abandon." },
    { q: "How long are the sessions?", a: "Standard sessions are 60 minutes. 90-minute sessions are available for advanced clients or those combining strength and conditioning work. A typical hour includes a 5-minute warm-up, 45\u201350 minutes of focused work and 5\u201310 minutes of cool-down and mobility. I don't waste time\u2014every minute has a purpose. For online clients, the \u2018session\u2019 is your workout, but the weekly check-in call is 15 minutes and form reviews are done via video message throughout the week." },
    { q: "Can I train with a partner or friend?", a: "Yes. Group training is available for 3\u20136 people. Partner training (2 people) is also popular and costs less per person than 1-to-1. Training with a partner or friend is one of the most effective ways to stay consistent. I programme sessions that work for both of you, adjusting exercises and weights individually while keeping you moving together. Small groups of 3\u20134 friends or colleagues are also common. The energy is higher, the accountability is stronger, and the cost per person drops significantly." },
    { q: "Do you help with nutrition and diet?", a: "Yes. Nutrition guidance is included in every package. I don't just tell you what to eat\u2014I teach you how to eat for your goals. Most people know roughly what they should be eating; the gap is in execution. I help you build meals around protein targets, manage portions without weighing everything, and navigate social situations and travel. For clients who want more structure, full meal plans with recipes and shopping lists are available as an add-on. The approach is always sustainable, not restrictive." },
    // Logistics
    { q: "Where do you train clients in Birmingham?", a: "I'm based at Foundry Gym in Kings Heath and primarily coach clients across South and Central Birmingham. Online coaching is available worldwide. Foundry Gym is just off the Kings Heath High Street with free parking, good equipment and a non-intimidating atmosphere. For outdoor sessions we use Kings Heath Park and Cannon Hill Park. If you're based in Edgbaston, Moseley, Harborne or Selly Oak, you're within 10\u201320 minutes by car or bus. I also have specific area pages for each neighbourhood with local travel details." },
    { q: "Do I need a gym membership?", a: "No. Your training package includes access to Foundry Gym during your sessions. You don't need a separate membership. This is one of the biggest advantages of training with an independent PT in a private facility. You show up for your session, train, and leave. No monthly gym fees, no crowded commercial gym floor, no waiting for equipment. For online clients, you can train wherever you have access to equipment\u2014home gym, commercial gym or even a hotel gym while travelling." },
    { q: "What should I bring to my first session?", a: "Comfortable training kit, indoor trainers, a water bottle and a towel. That's it\u2014everything else is provided at the gym. I'll also ask you to complete a short health questionnaire before your first session and bring any relevant medical information if you have injuries or conditions. Don't worry about being \u2018gym ready\u2019\u2014I've trained people in their work clothes when they came straight from the office. Just show up willing to work." },
    { q: "How do online sessions work?", a: "You complete an intake form, receive a custom programme via our app, and train on your own schedule. I review your form via video, check in weekly by video call, and answer questions on WhatsApp daily. The programme updates automatically as you progress\u2014no more guessing what to do at the gym. You film key exercises and send them to me for form feedback, usually within a few hours. The weekly check-in is 15 minutes where we review your week, adjust the plan and troubleshoot any issues. Many online clients say the daily WhatsApp access is the most valuable part\u2014they've never had that level of support before." },
    { q: "What if I need to cancel or reschedule?", a: "Give 24 hours notice and we'll reschedule at no charge. Cancellations within 24 hours may be charged at the coach's discretion. I understand that life happens\u2014work meetings run over, kids get ill, trains get cancelled. The 24-hour policy is fair and protects both of us. For regular clients with genuine emergencies, I'm flexible. I also offer a \u2018session bank\u2019 option where you can roll unused sessions into the following month if you're going on holiday or have a busy period at work." },
    { q: "How do I book sessions?", a: "Once you've had your consultation and chosen a package, you book sessions through the client portal or directly with me via WhatsApp. The portal shows my real-time availability and lets you book recurring slots\u2014same day and time each week, which is what most clients prefer. You can also book ad-hoc if your schedule is unpredictable. I send reminder texts the day before and confirm any location changes if we're training outdoors." },
    // Results
    { q: "How quickly will I see results?", a: "Most clients notice changes in energy and strength within 2\u20133 weeks. Visible body composition changes typically show within 6\u20138 weeks with consistent training and nutrition. The timeline depends on your starting point, consistency and how closely you follow the nutrition guidance. Someone training 3x per week and eating well will see faster results than someone training once and winging their diet. I track progress photos and body composition every 4 weeks so you can see changes that the mirror might miss day-to-day. The first result is usually sleeping better and feeling less sluggish\u2014that's your body adapting." },
    { q: "What if I've never trained before?", a: "Absolutely no problem. Most of my clients started as complete beginners. The only requirement is a willingness to show up and work. I teach every exercise from scratch\u2014proper form, breathing, tempo and why we're doing it. Beginners often progress fastest because everything is new stimulus. I start with fundamental movement patterns (squat, hinge, push, pull, carry) and build from there. There's no expectation that you already know how to use gym equipment. In fact, I'd rather teach you correctly from the start than unteach bad habits." },
    { q: "Can you help me lose weight?", a: "Yes. Weight loss is one of the most common goals I work with, and I take a sustainable approach that prioritises fat loss while preserving muscle. I don't do crash diets or \u20186-week transformations\u2019 that leave you heavier than when you started. The focus is on creating a moderate calorie deficit through nutrition education and increasing your daily energy expenditure through structured training. Most clients lose 0.5\u20131kg per week, which is the safe, sustainable rate that doesn't trigger metabolic adaptation or rebound weight gain. I've helped clients lose anywhere from 5kg to 40kg." },
    { q: "Do you work with clients outside Birmingham?", a: "Yes. Through online coaching I work with clients across the UK and in five other countries. All you need is a gym or some basic home equipment. Current online clients are in London, Manchester, Edinburgh, Dubai, New York and Sydney. The timezone difference is rarely an issue\u2014most communication is asynchronous via WhatsApp and the training app, and weekly check-ins are scheduled to suit both of us. The programming, nutrition guidance and accountability are identical to in-person coaching; the only difference is I'm not physically standing next to you during the session." },
    { q: "What happens after I reach my goal?", a: "We transition to maintenance coaching. This is typically 1\u20132 sessions per month to keep you accountable, tweak your programme and prevent regression. The biggest mistake people make is stopping completely once they hit their target. Maintenance is where the real work happens\u2014keeping the habits you've built while adding new challenges. Many clients who started for weight loss transition to strength goals, running programmes or simply \u2018stay fit and feel good\u2019 maintenance. The goal is that you never need to \u2018start again\u2019 because you never truly stopped." },
    { q: "How many times a week should I train with a personal trainer?", a: "Most clients train with me 2\u20133 times per week and do 1\u20132 additional sessions on their own. Beginners often start with once per week and build up. The sweet spot for most people is two coached sessions plus one or two self-directed workouts. This gives you enough face-to-face time to learn proper form and stay accountable, while building the independence to train confidently on your own. For online clients, the programme typically prescribes 3\u20134 workouts per week with the check-in call keeping you on track. More isn't always better\u2014consistency beats intensity every time." },
  ];
  return wrapSchema({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        "@id": `${BASE_URL}/faq/#faqpage`,
        "mainEntity": flatFaqs.map((f) => ({
          "@type": "Question",
          "name": f.q,
          "acceptedAnswer": { "@type": "Answer", "text": f.a },
        })),
      },
    ],
  });
}

function areaSchema(area) {
  const slug = area.slug;
  return wrapSchema({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": `${BASE_URL}/#localbusiness`,
        "name": "High Performance Fit",
        "image": `${BASE_URL}/og-coaching.jpg`,
        "url": BASE_URL + "/",
        "telephone": "+447753226214",
        "email": "hello@highperformancefit.co.uk",
        "priceRange": "£25–£50 per session",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Foundry Gym, Kings Heath",
          "addressLocality": "Birmingham",
          "addressRegion": "West Midlands",
          "postalCode": "B14 7JZ",
          "addressCountry": "GB",
        },
        "geo": { "@type": "GeoCoordinates", "latitude": 52.436, "longitude": -1.892 },
        "openingHoursSpecification": [
          { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"], "opens": "06:00", "closes": "21:00" },
          { "@type": "OpeningHoursSpecification", "dayOfWeek": "Saturday", "opens": "08:00", "closes": "18:00" },
          { "@type": "OpeningHoursSpecification", "dayOfWeek": "Sunday", "opens": "09:00", "closes": "16:00" },
        ],
        "areaServed": area.serviceAreaList.map((name) => ({ "@type": "Place", "name": `${name}, Birmingham` })),
      },
      {
        "@type": "Service",
        "@id": `${BASE_URL}/personal-trainer-${slug}/#service`,
        "name": `Personal Training in ${area.name}, Birmingham`,
        "description": area.directAnswer,
        "provider": { "@type": "LocalBusiness", "@id": `${BASE_URL}/#localbusiness` },
        "areaServed": { "@type": "Place", "name": `${area.name}, Birmingham` },
        "serviceType": "Personal Training",
        "offers": {
          "@type": "Offer",
          "price": "45.00",
          "priceCurrency": "GBP",
          "priceValidUntil": "2027-12-31",
          "availability": "https://schema.org/InStock",
          "url": `${BASE_URL}/personal-trainer-${slug}`,
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${BASE_URL}/personal-trainer-${slug}/#faqpage`,
        "mainEntity": area.faqs.map((f) => ({
          "@type": "Question",
          "name": f.q,
          "acceptedAnswer": { "@type": "Answer", "text": f.a },
        })),
      },
    ],
  });
}

// --------------------------------------------------------------------------
// Blog posts — metadata + BlogPosting schema
// (Full post content lives in src/data/blog-posts.ts. This mirror is kept in
//  sync for prerendering the <head>, structured data and route list.)
// --------------------------------------------------------------------------
const BLOG_POSTS = [
  {
    slug: "best-personal-trainer-birmingham",
    title: "How to Find the Best Personal Trainer in Birmingham",
    metaTitle: "How to Find the Best Personal Trainer in Birmingham | High Performance Fit",
    description: "Looking for the best personal trainer in Birmingham? Learn what qualifications, experience and questions actually matter before you book — from a coach with 13 years in the industry.",
    datePublished: "2026-06-20",
    dateModified: "2026-06-20",
    keywords: ["best personal trainer Birmingham", "personal trainer Birmingham", "how to choose a personal trainer"],
  },
  {
    slug: "online-personal-training-cost-uk",
    title: "How Much Does Online Personal Training Cost in the UK?",
    metaTitle: "How Much Does Online Personal Training Cost in the UK? | High Performance Fit",
    description: "A clear breakdown of online personal training cost in the UK in 2026 — typical monthly prices, what's included, and how to tell if a coach is worth it.",
    datePublished: "2026-06-10",
    dateModified: "2026-06-10",
    keywords: ["online personal training cost UK", "online coaching price", "online personal trainer cost"],
  },
  {
    slug: "benefits-of-small-group-training",
    title: "Is Group Fitness Training Worth It? The Case for Small Group PT",
    metaTitle: "Is Group Fitness Training Worth It? Small Group PT Explained | High Performance Fit",
    description: "Small group personal training in Birmingham blends affordability, accountability and expert coaching. Learn how it works, what it costs and who it suits best.",
    datePublished: "2026-05-28",
    dateModified: "2026-05-28",
    keywords: ["small group personal training Birmingham", "group fitness training", "is group training worth it"],
  },
  {
    slug: "outdoor-personal-training-birmingham-guide",
    title: "Outdoor Personal Training in Birmingham: A Complete Guide",
    metaTitle: "Outdoor Personal Training in Birmingham: Complete Guide | High Performance Fit",
    description: "A complete guide to outdoor personal training in Birmingham — the best parks, what to expect, what to wear and why training in fresh air gets results.",
    datePublished: "2026-05-14",
    dateModified: "2026-05-14",
    keywords: ["outdoor personal training Birmingham", "outdoor training Birmingham parks", "park workouts Birmingham"],
  },
  {
    slug: "personal-training-vs-online-coaching",
    title: "Personal Training vs Online Coaching: Which Is Right for You?",
    metaTitle: "Personal Training vs Online Coaching: Which Is Right for You? | High Performance Fit",
    description: "Personal training vs online coaching compared honestly — cost, accountability, flexibility and results — so you can choose the right option for your goals.",
    datePublished: "2026-04-30",
    dateModified: "2026-04-30",
    keywords: ["personal training vs online coaching", "in-person vs online personal training", "online coaching or personal trainer"],
  },
  {
    slug: "how-many-personal-training-sessions-per-week",
    title: "How Many Personal Training Sessions Do You Really Need Per Week?",
    metaTitle: "How Many Personal Training Sessions Per Week Do You Need? | High Performance Fit",
    description: "How many personal training sessions per week do you actually need? A practical guide to training frequency for beginners, weight loss and strength goals.",
    datePublished: "2026-04-16",
    dateModified: "2026-04-16",
    keywords: ["how many personal training sessions per week", "personal training frequency", "how often should I train"],
  },
];

function blogPostSchema(post) {
  const url = `${BASE_URL}/blog/${post.slug}`;
  return wrapSchema({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}/#blogposting`,
    "mainEntityOfPage": { "@type": "WebPage", "@id": url },
    "headline": post.title,
    "description": post.description,
    "url": url,
    "datePublished": post.datePublished,
    "dateModified": post.dateModified || post.datePublished,
    "keywords": post.keywords.join(", "),
    "image": `${BASE_URL}/og-coaching.jpg`,
    "inLanguage": "en-GB",
    "author": {
      "@type": "Person",
      "name": "Jay",
      "url": `${BASE_URL}/about-jay`,
    },
    "publisher": {
      "@type": "Organization",
      "name": "High Performance Fit",
      "@id": `${BASE_URL}/#organization`,
      "logo": {
        "@type": "ImageObject",
        "url": `${BASE_URL}/images/site/hpf-logo-192.png`,
        "width": 189,
        "height": 192,
      },
    },
  });
}

// --------------------------------------------------------------------------
// 3. Load the SSR bundle and render each route
// --------------------------------------------------------------------------
const ssrBundle = path.resolve(__dirname, "../dist/ssr/ssr.js");

async function prerenderRoute({ route, title, description }) {
  let render;
  try {
    // file:// URL so the import also works on Windows drive paths.
    const mod = await import(pathToFileURL(ssrBundle).href);
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
// Use the *built* shell (hashed JS/CSS from `vite build`), not the source
// index.html — the source one points at /src/main.tsx, which doesn't exist in
// production. Read once, before "/" overwrites dist/public/index.html.
const BUILT_SHELL = fs.readFileSync(path.join(OUT_DIR, "index.html"), "utf-8");
if (!BUILT_SHELL.includes('<div id="root"></div>') || BUILT_SHELL.includes("/src/main.tsx")) {
  console.error("[prerender] dist/public/index.html is not a fresh client build. Run `vite build` first.");
  process.exit(1);
}

function buildHtml(route, rendered, schema = false) {
  const baseHtml = BUILT_SHELL;

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

  // Link previews (WhatsApp, iMessage, socials) read og:/twitter: tags, not
  // <title>, so give every page its own — otherwise a shared link shows the homepage.
  const attr = (s) => s.replace(/"/g, "&quot;");
  const shared = route === "/" ? described : described
    .replace(/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${BASE_URL}${route}" />`)
    .replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${attr(rendered.helmet.title)}" />`)
    .replace(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${attr(rendered.helmet.description)}" />`)
    .replace(/<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${attr(rendered.helmet.title)}" />`)
    .replace(/<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${attr(rendered.helmet.description)}" />`);

  // Inject JSON-LD schema before </head>
  let withSchema = shared;
  if (schema === true) {
    withSchema = shared.replace("</head>", `${jsonLdSchema()}\n</head>`);
  } else if (typeof schema === "string" && schema.length > 0) {
    withSchema = shared.replace("</head>", `${schema}\n</head>`);
  }

  const noscript = `
<noscript>
  <div style="background:#0F0D0B;color:#F3EEE5;padding:48px 24px;text-align:center;font-family:Georgia,serif;">
    <h1 style="font-size:32px;margin:0 0 16px;">High Performance Fit</h1>
    <p style="font-size:18px;margin:0 0 24px;max-width:600px;margin-left:auto;margin-right:auto;">
      Personal training in Birmingham and worldwide. 13 years, 200+ transformations.
      JavaScript is required to use the booking system, but you can still contact us directly.
    </p>
    <a href="tel:+447753226214" style="display:inline-block;background:#C9A45C;color:#1A1610;padding:14px 28px;border-radius:2px;text-decoration:none;font-weight:bold;margin:8px;">
      Call 07753 226 214
    </a>
    <a href="mailto:hello@highperformancefit.co.uk" style="display:inline-block;background:transparent;color:#E3C88F;border:1px solid #C9A45C;padding:13px 27px;border-radius:2px;text-decoration:none;font-weight:bold;margin:8px;">
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
    description: "Real coaching in Kings Heath for people who've tried everything else. 1-2-1, small group, outdoor and online personal training across South Birmingham. 200+ clients, 5-star Google rated. Book a free chat.",
    schema: true,
  },
  {
    route: "/personal-training-birmingham",
    title: "Personal Training Birmingham — 1-to-1 Coaching That Works | High Performance Fit",
    description: "1-to-1 personal training in Birmingham at Foundry Gym, Kings Heath, with a Level 4 coach. Custom programmes and nutrition guidance. Free 30-minute chat. From £35 a session.",
    schema: ptSchema(),
  },
  {
    route: "/online-coaching",
    title: "Online Personal Training UK & Worldwide — Custom Plans, Real Results | High Performance Fit",
    description: "Online personal coaching with a bespoke programme, weekly video check-ins and WhatsApp access to Jay. Clients coached in five countries. £120 a month.",
    schema: onlineSchema(),
  },
  {
    route: "/group-training",
    title: "Small Group Personal Training Birmingham — Accountability & Energy | High Performance Fit",
    description: "Small group training in Kings Heath, Birmingham, max four people. PT-level programming, mixed abilities. £200 for eight sessions.",
    schema: groupSchema(),
  },
  {
    route: "/outdoor-training",
    title: "Outdoor Personal Training Birmingham — Fresh Air, No Machines | High Performance Fit",
    description: "Outdoor personal training in Kings Heath Park, Cannon Hill Park or your local green space. Book a free 30-minute chat.",
    schema: outdoorSchema(),
  },
  {
    route: "/blog",
    title: "Fitness Blog — High Performance Fit",
    description: "Training tips, insights and advice from Birmingham personal trainer Jay. No clickbait — just what actually works.",
    schema: false,
  },
  ...BLOG_POSTS.map((post) => ({
    route: `/blog/${post.slug}`,
    title: post.metaTitle,
    description: post.description,
    schema: blogPostSchema(post),
  })),
  {
    route: "/personal-trainer-kings-heath",
    title: areas["kings-heath"].title,
    description: areas["kings-heath"].metaDescription,
    schema: areaSchema(areas["kings-heath"]),
  },
  {
    route: "/personal-trainer-moseley",
    title: areas["moseley"].title,
    description: areas["moseley"].metaDescription,
    schema: areaSchema(areas["moseley"]),
  },
  {
    route: "/personal-trainer-edgbaston",
    title: areas["edgbaston"].title,
    description: areas["edgbaston"].metaDescription,
    schema: areaSchema(areas["edgbaston"]),
  },
  {
    route: "/personal-trainer-harborne",
    title: areas["harborne"].title,
    description: areas["harborne"].metaDescription,
    schema: areaSchema(areas["harborne"]),
  },
  {
    route: "/personal-trainer-selly-oak",
    title: areas["selly-oak"].title,
    description: areas["selly-oak"].metaDescription,
    schema: areaSchema(areas["selly-oak"]),
  },
  {
    route: "/about-jay",
    title: "About Jay — High Performance Fit",
    description: "Meet Jay: Level 4 qualified personal trainer and strength & conditioning coach in Kings Heath, Birmingham. 13 years coaching. Book a free chat.",
    schema: false,
  },
  {
    route: "/faq",
    title: "FAQ — High Performance Fit",
    description: "Frequently asked questions about personal training, online coaching, group sessions and pricing at High Performance Fit Birmingham.",
    schema: faqSchema(),
  },
  {
    route: "/contact",
    title: "Contact — High Performance Fit",
    description: "Get in touch with High Performance Fit. Call, text or email Jay. Free consultation available. Foundry Gym, Kings Heath, Birmingham.",
    schema: false,
  },
  {
    route: "/assessment",
    title: "Free Training Assessment — High Performance Fit",
    description: "Four minutes, four short sections. See your readiness score and the coaching package that fits, and your answers go straight to Jay.",
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
