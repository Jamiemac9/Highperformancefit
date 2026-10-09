import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { authRouter } from "./routes/auth.js";
import { clientsRouter } from "./routes/clients.js";
import { sessionsRouter } from "./routes/sessions.js";
import { packagesRouter } from "./routes/packages.js";
import { bookingsRouter } from "./routes/bookings.js";
import { leadsRouter } from "./routes/leads.js";
import { enquiriesRouter } from "./routes/enquiries.js";
import { dashboardRouter } from "./routes/dashboard.js";
import { slotsRouter } from "./routes/slots.js";
import { meRouter } from "./routes/me.js";
import { checkoutRouter } from "./routes/checkout.js";
import { reviewsRouter } from "./routes/reviews.js";
import { waitlistRouter } from "./routes/waitlist.js";
import { eventsRouter } from "./routes/events.js";

const app = express();
const PORT = Number(process.env.PORT || process.env.API_PORT || 5050);

app.set("trust proxy", 1);

// HTTPS + naked-domain redirect for SEO
// Must sit before any route handler so all traffic (including API) is canonicalised.
const CANONICAL_DOMAIN = "highperformancefit.co.uk";
app.use((req, res, next) => {
  // Skip enforcement in local dev to avoid redirect loops.
  if (process.env.NODE_ENV !== "production" && !process.env.REPLIT_DOMAINS) {
    return next();
  }
  const host = ((req.headers["x-forwarded-host"] as string) || req.headers.host || "").split(":")[0].toLowerCase();
  // Platform preview hosts stay reachable so a new deploy can be checked before DNS moves.
  if (
    host.includes("localhost") ||
    host.includes("127.0.0.1") ||
    host.endsWith(".replit.dev") ||
    host.endsWith(".onrender.com")
  ) {
    return next();
  }
  const proto = ((req.headers["x-forwarded-proto"] as string) || req.protocol || "http").toLowerCase();
  const needsHttps = proto !== "https";
  const needsNaked = host !== CANONICAL_DOMAIN;
  if (!needsHttps && !needsNaked) return next();
  return res.redirect(301, `https://${CANONICAL_DOMAIN}${req.originalUrl || req.url}`);
});

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get("/api/healthz", (_req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRouter);
app.use("/api/clients", clientsRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/packages", packagesRouter);
app.use("/api/bookings", bookingsRouter);
app.use("/api/leads", leadsRouter);
app.use("/api/enquiries", enquiriesRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/slots", slotsRouter);
app.use("/api/me", meRouter);
app.use("/api/checkout", checkoutRouter);
app.use("/api/reviews", reviewsRouter);
app.use("/api/waitlist", waitlistRouter);
app.use("/api/webhook/events", eventsRouter);

app.use("/api", (_req, res) => res.status(404).json({ error: "Not found" }));

// ---------------------------------------------------------------------------
// Website. When the built site exists (pnpm run build → dist/public), this same
// process serves it, so one Render service runs the whole thing. Prerendered
// pages live at dist/public/<route>/index.html; everything else falls back to
// the SPA shell (dashboard, portal, login).
// ---------------------------------------------------------------------------
const PUBLIC_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../dist/public");
if (existsSync(PUBLIC_DIR)) {
  app.use(
    "/assets",
    express.static(path.join(PUBLIC_DIR, "assets"), { immutable: true, maxAge: "1y", fallthrough: false }),
  );
  app.use(
    express.static(PUBLIC_DIR, {
      index: false,
      redirect: false,
      maxAge: "7d",
      setHeaders: (res, file) => {
        if (file.endsWith(".html")) res.setHeader("Cache-Control", "no-cache");
      },
    }),
  );
  app.get("*", (req, res) => {
    const clean = path.posix.normalize(decodeURIComponent(req.path)).replace(/^(\.\.(\/|$))+/, "");
    const page = path.join(PUBLIC_DIR, clean, "index.html");
    const target = page.startsWith(PUBLIC_DIR) && existsSync(page) ? page : path.join(PUBLIC_DIR, "index.html");
    res.setHeader("Cache-Control", "no-cache");
    res.sendFile(target);
  });
} else {
  console.warn(`[server] ${PUBLIC_DIR} not found — serving the API only (run the web build to serve the site).`);
}

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Internal server error" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`[server] listening on ${PORT}`);
});
