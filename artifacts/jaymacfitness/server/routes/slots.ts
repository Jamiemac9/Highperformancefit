import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db.js";
import { requireAuth, requireTrainer, type AuthedRequest } from "../auth/jwt.js";

export const slotsRouter = Router();
slotsRouter.use(requireAuth);

// GET /api/slots — any authed user can view available slots
// Query params: from (ISO date, default now), to (ISO date, default +21d), includeBooked (default false)
slotsRouter.get("/", async (req: AuthedRequest, res, next) => {
  try {
    const from = req.query.from ? new Date(String(req.query.from)) : new Date();
    const to = req.query.to
      ? new Date(String(req.query.to))
      : new Date(Date.now() + 21 * 24 * 60 * 60 * 1000);
    // Only trainers may opt-in to seeing booked slots; clients always get
    // the unbooked-only view regardless of query param.
    const isTrainer = req.user!.role === "TRAINER";
    const includeBooked = isTrainer && req.query.includeBooked === "true";

    const slots = await prisma.trainerAvailability.findMany({
      where: {
        date: { gte: from, lte: to },
        ...(includeBooked ? {} : { isBooked: false }),
      },
      orderBy: { date: "asc" },
    });
    res.json(slots);
  } catch (err) {
    next(err);
  }
});

const createSchema = z.object({
  date: z.string().datetime(),
  duration: z.number().int().positive().max(240).optional(),
  type: z.enum(["GYM", "ONLINE", "OUTDOOR"]).optional(),
});

// Trainer creates an availability slot
slotsRouter.post("/", requireTrainer, async (req, res, next) => {
  try {
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
    const created = await prisma.trainerAvailability.create({
      data: {
        date: new Date(parsed.data.date),
        duration: parsed.data.duration ?? 60,
        type: parsed.data.type ?? "GYM",
      },
    });
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

// Trainer bulk creates slots (e.g. seed a week)
slotsRouter.post("/bulk", requireTrainer, async (req, res, next) => {
  try {
    const parsed = z.object({ slots: z.array(createSchema).min(1).max(200) }).safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
    const created = await prisma.trainerAvailability.createMany({
      data: parsed.data.slots.map((s) => ({
        date: new Date(s.date),
        duration: s.duration ?? 60,
        type: s.type ?? "GYM",
      })),
    });
    res.status(201).json({ count: created.count });
  } catch (err) {
    next(err);
  }
});

slotsRouter.delete("/:id", requireTrainer, async (req, res, next) => {
  try {
    const slot = await prisma.trainerAvailability.findUnique({ where: { id: req.params.id } });
    if (!slot) return res.status(404).json({ error: "Slot not found" });
    if (slot.isBooked) return res.status(409).json({ error: "Cannot delete a booked slot" });
    await prisma.trainerAvailability.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});
