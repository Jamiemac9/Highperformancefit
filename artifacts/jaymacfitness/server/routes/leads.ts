import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db.js";
import { requireAuth, requireTrainer } from "../auth/jwt.js";

export const leadsRouter = Router();

const createSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(1),
  source: z.string().optional(),
});

// Public endpoint to submit lead from marketing site
leadsRouter.post("/", async (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
  const created = await prisma.leadEnquiry.create({ data: parsed.data });
  res.status(201).json({ id: created.id });
});

leadsRouter.get("/", requireAuth, requireTrainer, async (_req, res) => {
  const leads = await prisma.leadEnquiry.findMany({ orderBy: { createdAt: "desc" } });
  res.json(leads);
});

const updateSchema = z.object({
  status: z.enum(["NEW", "CONTACTED", "CONVERTED", "LOST"]),
});

leadsRouter.patch("/:id", requireAuth, requireTrainer, async (req, res) => {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
  const updated = await prisma.leadEnquiry.update({ where: { id: req.params.id }, data: parsed.data });
  res.json(updated);
});

leadsRouter.delete("/:id", requireAuth, requireTrainer, async (req, res) => {
  await prisma.leadEnquiry.delete({ where: { id: req.params.id } });
  res.json({ ok: true });
});
