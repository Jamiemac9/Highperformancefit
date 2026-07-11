---
name: JSON-LD Structured Data for Fitness Business
description: Complete @graph schema for a personal training business, covering all rich result types Google supports.
---

## Schema Types Used

1. **WebSite** — Basic site info, links to Organization publisher
2. **Organization** — Business name, logo, sameAs (social), contactPoint (phone/email)
3. **Person** — Trainer profile with jobTitle, worksFor, alumniOf (certifications), knowsAbout (specialties), image
4. **LocalBusiness** — Full address, geo coordinates, opening hours, areaServed, priceRange, aggregateRating
5. **Service** (×3) — 1-to-1 training, group training, online coaching; each with OfferCatalog pricing
6. **FAQPage** — Maps visible FAQ accordion to Question/Answer pairs (text must match page exactly)
7. **HowTo** — 4-step process from consultation to results; each step has name, text, optional image

## Injection Strategy
Inject the `<script type="application/ld+json">` tag before `</head>` during prerendering. Only inject on the landing page (`/`) — auth pages don't need rich results.

## Image Assets
Copy professional headshot and training photos to `public/` so they have stable URLs at build time:
- `/jay-headshot.jpg` — used in Person schema and HowTo steps
- `/opengraph.jpg` — used in Organization logo and OG/Twitter meta tags
- `/jay-training.jpg` — available for future use

## Validation
Test at https://search.google.com/test/rich-results after deployment.

## Why
Structured data enables Google rich results: FAQ snippets, HowTo carousels, local business panels, knowledge graph entries, and service listings in search results.
