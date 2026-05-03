import { Router } from "express";
import { z } from "zod";
import Stripe from "stripe";
import { prisma } from "../db.js";

export const checkoutRouter = Router();

let _stripe: Stripe | null = null;
function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  if (!_stripe) {
    _stripe = new Stripe(key);
  }
  return _stripe;
}

const bodySchema = z.object({
  packageId: z.string().min(1),
});

/**
 * POST /api/checkout/create-session
 * Public endpoint — anyone on the landing page can buy a package.
 * Looks up the package, creates a Stripe Checkout Session with its price
 * (in GBP, one-off payment), and returns { url } for the client to redirect to.
 */
checkoutRouter.post("/create-session", async (req, res, next) => {
  try {
    const stripe = getStripe();
    if (!stripe) {
      return res.status(503).json({
        error:
          "Payments are not configured yet. Please contact us to purchase a package.",
      });
    }

    const parsed = bodySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid input" });
    }

    const pkg = await prisma.package.findUnique({
      where: { id: parsed.data.packageId },
    });
    if (!pkg || !pkg.isActive) {
      return res.status(404).json({ error: "Package not available" });
    }

    // If the trainer has manually set a per-package Stripe Payment Link, prefer it
    // — it lets them control everything in their Stripe dashboard.
    if (pkg.stripeLink) {
      return res.json({ url: pkg.stripeLink });
    }

    // Build origin. Prefer the canonical published domain from REPLIT_DOMAINS so
    // an attacker can't spoof X-Forwarded-Host to redirect victims to a malicious
    // site after Stripe payment. Falls back to the request host in dev.
    const replitDomain = (process.env.REPLIT_DOMAINS || "")
      .split(",")[0]
      ?.trim();
    let origin: string;
    if (replitDomain) {
      origin = `https://${replitDomain}`;
    } else {
      const proto =
        (req.headers["x-forwarded-proto"] as string)?.split(",")[0] ||
        req.protocol ||
        "https";
      const host = req.headers.host;
      origin = `${proto}://${host}`;
    }

    // Stripe wants the unit_amount in the smallest currency unit (pence).
    const unitAmount = Math.round(Number(pkg.price) * 100);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "gbp",
            unit_amount: unitAmount,
            product_data: {
              name: `JayMacFitness — ${pkg.name}`,
              description:
                pkg.description ||
                `${pkg.sessions} session${pkg.sessions === 1 ? "" : "s"} with Jay`,
            },
          },
        },
      ],
      success_url: `${origin}/?paid=1&pkg=${encodeURIComponent(pkg.name)}`,
      cancel_url: `${origin}/#packages?cancelled=1`,
      metadata: {
        packageId: pkg.id,
        packageName: pkg.name,
        sessions: String(pkg.sessions),
      },
      allow_promotion_codes: true,
      billing_address_collection: "auto",
    });

    if (!session.url) {
      return res.status(500).json({ error: "Stripe did not return a URL" });
    }
    res.json({ url: session.url });
  } catch (err) {
    next(err);
  }
});
