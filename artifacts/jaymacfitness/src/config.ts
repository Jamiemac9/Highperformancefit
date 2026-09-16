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
  ADDRESS: "Foundry Gym, Kings Heath, Birmingham",
  MARVEL_URL: "https://marvelthestudio.co.uk",
  GOOGLE_REVIEWS_URL: "https://share.google/FpcS0UmHf4KwbiH86",
  GOOGLE_PLACE_ID: import.meta.env.VITE_GOOGLE_PLACE_ID || "",
  GOOGLE_RATING_FALLBACK: 4.9,
  GOOGLE_REVIEW_COUNT_FALLBACK: 127,
} as const;

export type BookingClickEvent = {
  location: string;
  label: string;
};