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

bookingsRouter.delete("/:id", requireTrainer, async (req, res) => {
  await prisma.booking.delete({ where: { id: req.params.id } });
  res.json({ ok: true });
});
