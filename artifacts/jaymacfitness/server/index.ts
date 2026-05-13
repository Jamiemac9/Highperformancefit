import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
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
  if (host.includes("localhost") || host.includes("127.0.0.1") || host.endsWith(".replit.dev")) {
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

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Internal server error" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`[server] listening on ${PORT}`);
});
