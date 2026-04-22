import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db.js";
import { requireAuth, requireTrainer } from "../auth/jwt.js";

export const packagesRouter = Router();

packagesRouter.get("/", async (_req, res) => {
  const pkgs = await prisma.package.findMany({ orderBy: { sessions: "asc" } });
  res.json(pkgs);
});

const createSchema = z.object({
  name: z.string().min(1),
  sessions: z.number().int().positive(),
  price: z.number().positive(),
  description: z.string().optional(),
});

packagesRouter.post("/", requireAuth, requireTrainer, async (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
  const created = await prisma.package.create({ data: parsed.data });
  res.status(201).json(created);
});

packagesRouter.patch("/:id", requireAuth, requireTrainer, async (req, res) => {
  const parsed = createSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
  const updated = await prisma.package.update({ where: { id: req.params.id }, data: parsed.data });
  res.json(updated);
});

packagesRouter.delete("/:id", requireAuth, requireTrainer, async (req, res) => {
  await prisma.package.delete({ where: { id: req.params.id } });
  res.json({ ok: true });
});
