/**
 * Single source of truth for public HPFIT contact and conversion links.
 *
 * Replace BOOKING_URL and GOOGLE_PLACE_ID when Jay's live booking page and
 * Google Business Profile place ID are available. Keeping the booking URL on
 * #contact prevents a dead external link in the meantime.
 */
export const SITE_CONFIG = {
  BOOKING_URL: "#contact",
  WHATSAPP_URL: "https://wa.me/447753226214",
  EMAIL: "hello@highperformancefit.co.uk",
  PHONE: "07753 226 214",
  PHONE_TEL: "+447753226214",
  ADDRESS: "Foundry Gym, Kings Heath, Birmingham",
  MARVEL_URL: "https://marvelthestudio.co.uk",
  GOOGLE_REVIEWS_URL: "https://maps.app.goo.gl/nHyUxxnLaPp1FoME8",
  GOOGLE_PLACE_ID: import.meta.env.VITE_GOOGLE_PLACE_ID || "",
  // What the Google profile actually shows today. Only used until the live
  // /api/reviews call answers — never inflate these.
  GOOGLE_RATING_FALLBACK: 5.0,
  GOOGLE_REVIEW_COUNT_FALLBACK: 3,
} as const;

export type BookingClickEvent = {
  location: string;
  label: string;
};