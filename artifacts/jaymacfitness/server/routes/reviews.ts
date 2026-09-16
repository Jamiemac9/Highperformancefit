import { Router } from "express";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

export const reviewsRouter = Router();

type Review = {
  name: string;
  photo: string | null;
  text: string;
  relativePublishTimeDescription: string;
  rating: number;
};

type ReviewsResponse = {
  rating: number;
  userRatingCount: number;
  reviews: Review[];
  live: boolean;
};

const fallbackPath = path.join(path.dirname(fileURLToPath(import.meta.url)), "../data/fallback-reviews.json");
const fallbackReviews = JSON.parse(readFileSync(fallbackPath, "utf8")) as Review[];
const CACHE_MS = 12 * 60 * 60 * 1000;
let cache: { expiresAt: number; value: ReviewsResponse } | null = null;

function fallback(): ReviewsResponse {
  return {
    rating: 5,
    userRatingCount: fallbackReviews.length,
    reviews: fallbackReviews,
    live: false,
  };
}

reviewsRouter.get("/", async (_req, res) => {
  if (cache && cache.expiresAt > Date.now()) return res.json(cache.value);

  const apiKey = process.env.GOOGLE_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID || "";
  if (!apiKey || !placeId) return res.json(fallback());

  try {
    const response = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`, {
      headers: {
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "rating,userRatingCount,reviews",
      },
    });
    if (!response.ok) throw new Error(`Google Places returned ${response.status}`);
    const data = await response.json() as {
      rating?: number;
      userRatingCount?: number;
      reviews?: Array<{
        rating?: number;
        text?: { text?: string };
        relativePublishTimeDescription?: string;
        authorAttribution?: { displayName?: string; photoUri?: string };
      }>;
    };
    const value: ReviewsResponse = {
      rating: data.rating ?? 4.9,
      userRatingCount: data.userRatingCount ?? 127,
      reviews: (data.reviews || []).map((review) => ({
        name: review.authorAttribution?.displayName || "Google reviewer",
        photo: review.authorAttribution?.photoUri || null,
        text: review.text?.text || "",
        relativePublishTimeDescription: review.relativePublishTimeDescription || "",
        rating: review.rating ?? 5,
      })).filter((review) => review.text),
      live: true,
    };
    cache = { expiresAt: Date.now() + CACHE_MS, value };
    res.json(value);
  } catch (error) {
    console.error("[reviews] Google Places lookup failed; serving fallback", error);
    res.json(fallback());
  }
});