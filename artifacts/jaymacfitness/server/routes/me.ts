import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db.js";
import { requireAuth, type AuthedRequest } from "../auth/jwt.js";

// Client self-service profile + summary endpoints. All require auth (client role).
export const meRouter = Router();
meRouter.use(requireAuth);

function requireClient(req: AuthedRequest, res: any, next: any) {
  if (req.user?.role !== "CLIENT") return res.status(403).json({ error: "Clients only" });
  next();
}

meRouter.get("/profile", requireClient, async (req: AuthedRequest, res, next) => {
  try {
    const profile = await prisma.clientProfile.findUnique({
      where: { userId: req.user!.sub },
      include: { user: { select: { email: true } } },
    });
    if (!profile) return res.status(404).json({ error: "Profile not found" });
    res.json(profile);
  } catch (err) {
    next(err);
  }
});

const updateSchema = z.object({
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  phone: z.string().max(50).nullable().optional(),
  goals: z.string().max(2000).nullable().optional(),
  emergencyContact: z.string().max(300).nullable().optional(),
});

meRouter.patch("/profile", requireClient, async (req: AuthedRequest, res, next) => {
  try {
    const parsed = updateSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });
    const updated = await prisma.clientProfile.update({
      where: { userId: req.user!.sub },
      data: parsed.data,
      include: { user: { select: { email: true } } },
    });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// Summary used by /portal/dashboard: profile, sessions remaining, next 3 sessions, progress note.
meRouter.get("/summary", requireClient, async (req: AuthedRequest, res, next) => {
  try {
    const profile = await prisma.clientProfile.findUnique({
      where: { userId: req.user!.sub },
      include: {
        bookings: { include: { package: true }, orderBy: { purchasedAt: "desc" } },
      },
    });
    if (!profile) return res.status(404).json({ error: "Profile not found" });

    const sessionsRemaining = profile.bookings.reduce((sum, b) => sum + b.sessionsRemaining, 0);

    const upcoming = await prisma.session.findMany({
      where: {
        clientId: profile.id,
        date: { gte: new Date() },
        cancelled: false,
        completed: false,
      },
      orderBy: { date: "asc" },
      take: 3,
    });

    res.json({
      profile: {
        id: profile.id,
        firstName: profile.firstName,
        lastName: profile.lastName,
        progressNote: profile.progressNote,
      },
      sessionsRemaining,
      activeBookings: profile.bookings.filter((b) => b.sessionsRemaining > 0),
      upcoming,
    });
  } catch (err) {
    next(err);
  }
});
