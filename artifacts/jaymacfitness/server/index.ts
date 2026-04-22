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

const app = express();
const PORT = Number(process.env.PORT || process.env.API_PORT || 5050);

app.set("trust proxy", 1);
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

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Internal server error" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`[server] listening on ${PORT}`);
});
