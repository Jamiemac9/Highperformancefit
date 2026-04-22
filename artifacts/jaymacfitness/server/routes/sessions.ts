import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db.js";
import { requireAuth, requireTrainer, type AuthedRequest } from "../auth/jwt.js";

export const sessionsRouter = Router();
sessionsRouter.use(requireAuth);

sessionsRouter.get("/", async (req: AuthedRequest, res) => {
  const isTrainer = req.user!.role === "TRAINER";
  const where = isTrainer
    ? {}
    : { client: { userId: req.user!.sub } };
  const sessions = await prisma.session.findMany({
    where,
    include: { client: { select: { firstName: true, lastName: true, id: true } } },
    orderBy: { date: "asc" },
  });
  res.json(sessions);
});

const createSchema = z.object({
  clientId: z.string(),
  date: z.string(),
  duration: z.number().int().positive(),
  type: z.enum(["GYM", "ONLINE", "OUTDOOR"]),
  notes: z.string().optional(),
});

sessionsRouter.post("/", requireTrainer, async (req: AuthedRequest, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
  const created = await prisma.session.create({
    data: {
      ...parsed.data,
      date: new Date(parsed.data.date),
      trainerId: req.user!.sub,
    },
  });
  res.status(201).json(created);
});

const updateSchema = z.object({
  date: z.string().optional(),
  duration: z.number().int().positive().optional(),
  type: z.enum(["GYM", "ONLINE", "OUTDOOR"]).optional(),
  notes: z.string().optional(),
  completed: z.boolean().optional(),
});

sessionsRouter.patch("/:id", requireTrainer, async (req, res) => {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
  const data: any = { ...parsed.data };
  if (parsed.data.date) data.date = new Date(parsed.data.date);
  const updated = await prisma.session.update({ where: { id: req.params.id }, data });
  res.json(updated);
});

sessionsRouter.delete("/:id", requireTrainer, async (req, res) => {
  await prisma.session.delete({ where: { id: req.params.id } });
  res.json({ ok: true });
});
