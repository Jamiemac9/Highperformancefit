import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db.js";
import { requireAuth, requireTrainer } from "../auth/jwt.js";

// Legacy router. The public POST has been removed in favour of /api/enquiries
// (which has rate limiting + stricter validation). All remaining endpoints are
// trainer-only and exist purely for backward compatibility.
export const leadsRouter = Router();

leadsRouter.use(requireAuth, requireTrainer);

leadsRouter.get("/", async (_req, res) => {
  const leads = await prisma.leadEnquiry.findMany({ orderBy: { createdAt: "desc" } });
  res.json(leads);
});

const updateSchema = z.object({
  status: z.enum(["NEW", "CONTACTED", "CONVERTED", "LOST"]),
});

leadsRouter.patch("/:id", async (req, res) => {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
  const updated = await prisma.leadEnquiry.update({ where: { id: req.params.id }, data: parsed.data });
  res.json(updated);
});

leadsRouter.delete("/:id", async (req, res) => {
  await prisma.leadEnquiry.delete({ where: { id: req.params.id } });
  res.json({ ok: true });
});
