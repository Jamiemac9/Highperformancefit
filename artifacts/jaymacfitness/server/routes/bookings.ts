import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db.js";
import { requireAuth, requireTrainer, type AuthedRequest } from "../auth/jwt.js";

export const bookingsRouter = Router();
bookingsRouter.use(requireAuth);

bookingsRouter.get("/", async (req: AuthedRequest, res) => {
  const isTrainer = req.user!.role === "TRAINER";
  const where = isTrainer ? {} : { client: { userId: req.user!.sub } };
  const bookings = await prisma.booking.findMany({
    where,
    include: { package: true, client: { select: { firstName: true, lastName: true, id: true } } },
    orderBy: { purchasedAt: "desc" },
  });
  res.json(bookings);
});

const createSchema = z.object({
  clientId: z.string(),
  packageId: z.string(),
});

bookingsRouter.post("/", requireTrainer, async (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
  const pkg = await prisma.package.findUnique({ where: { id: parsed.data.packageId } });
  if (!pkg) return res.status(404).json({ error: "Package not found" });
  const created = await prisma.booking.create({
    data: {
      clientId: parsed.data.clientId,
      packageId: parsed.data.packageId,
      sessionsRemaining: pkg.sessions,
    },
    include: { package: true },
  });
  res.status(201).json(created);
});

// CLIENT: purchase a package (Stripe placeholder — for now this just creates the booking)
bookingsRouter.post("/purchase", async (req: AuthedRequest, res, next) => {
  try {
    if (req.user!.role !== "CLIENT") return res.status(403).json({ error: "Clients only" });
    const parsed = z.object({ packageId: z.string() }).safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
    const profile = await prisma.clientProfile.findUnique({ where: { userId: req.user!.sub } });
    if (!profile) return res.status(404).json({ error: "Client profile not found" });
    const pkg = await prisma.package.findUnique({ where: { id: parsed.data.packageId } });
    if (!pkg) return res.status(404).json({ error: "Package not found" });

    // TODO: integrate Stripe here. For now we mark as purchased pending payment.
    if (!process.env.STRIPE_SECRET_KEY) {
      if (process.env.NODE_ENV === "production") {
        return res.status(503).json({
          error: "Payments are not configured. Please contact your trainer to purchase a package.",
        });
      }
      console.warn("[bookings] STRIPE_SECRET_KEY not set — package purchase is recorded without real payment (dev only).");
    }

    const created = await prisma.booking.create({
      data: {
        clientId: profile.id,
        packageId: pkg.id,
        sessionsRemaining: pkg.sessions,
      },
      include: { package: true },
    });
    res.status(201).json({
      booking: created,
      paymentStatus: process.env.STRIPE_SECRET_KEY ? "paid" : "pending_stripe_setup",
      message: process.env.STRIPE_SECRET_KEY
        ? "Package purchased successfully."
        : "Package recorded. Add STRIPE_SECRET_KEY env var to enable real payments.",
    });
  } catch (err) {
    next(err);
  }
});

// CLIENT: book a specific session slot. Atomically:
// - validate slot is free
// - find an active booking with sessionsRemaining > 0
// - decrement remaining, create Session, mark slot booked
bookingsRouter.post("/session", async (req: AuthedRequest, res, next) => {
  try {
    if (req.user!.role !== "CLIENT") return res.status(403).json({ error: "Clients only" });
    const parsed = z.object({ slotId: z.string() }).safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid input" });

    const profile = await prisma.clientProfile.findUnique({ where: { userId: req.user!.sub } });
    if (!profile) return res.status(404).json({ error: "Client profile not found" });

    // Find a trainer to assign (the system has 1 trainer in this MVP)
    const trainer = await prisma.user.findFirst({ where: { role: "TRAINER" } });
    if (!trainer) return res.status(500).json({ error: "No trainer configured" });

    try {
      const result = await prisma.$transaction(async (tx) => {
        // Lock the slot via a conditional update — if it's already booked, count = 0.
        const slotUpdate = await tx.trainerAvailability.updateMany({
          where: { id: parsed.data.slotId, isBooked: false },
          data: { isBooked: true },
        });
        if (slotUpdate.count === 0) {
          throw Object.assign(new Error("Slot is no longer available"), { status: 409 });
        }
        const slot = await tx.trainerAvailability.findUnique({ where: { id: parsed.data.slotId } });
        if (!slot) throw Object.assign(new Error("Slot not found"), { status: 404 });

        // FIFO credit consumption inside the tx — loop oldest-first and try to
        // decrement; conditional updateMany ensures concurrent requests skip a
        // depleted booking and fall through to the next eligible one.
        let decremented = false;
        // up to 5 attempts is plenty (a client rarely has many active packages)
        for (let attempt = 0; attempt < 5 && !decremented; attempt++) {
          const candidate = await tx.booking.findFirst({
            where: { clientId: profile.id, sessionsRemaining: { gt: 0 } },
            orderBy: { purchasedAt: "asc" },
          });
          if (!candidate) break;
          const decr = await tx.booking.updateMany({
            where: { id: candidate.id, sessionsRemaining: { gt: 0 } },
            data: { sessionsRemaining: { decrement: 1 } },
          });
          if (decr.count > 0) decremented = true;
        }
        if (!decremented) {
          throw Object.assign(new Error("No sessions remaining. Please purchase a package first."), { status: 409 });
        }

        const session = await tx.session.create({
          data: {
            clientId: profile.id,
            trainerId: trainer.id,
            date: slot.date,
            duration: slot.duration,
            type: slot.type,
          },
        });

        await tx.trainerAvailability.update({
          where: { id: slot.id },
          data: { sessionId: session.id },
        });

        return { session, slot };
      });

      res.status(201).json(result);
    } catch (txErr: any) {
      if (txErr?.status) return res.status(txErr.status).json({ error: txErr.message });
      throw txErr;
    }
  } catch (err) {
    next(err);
  }
});

bookingsRouter.delete("/:id", requireTrainer, async (req, res) => {
  await prisma.booking.delete({ where: { id: req.params.id } });
  res.json({ ok: true });
});
