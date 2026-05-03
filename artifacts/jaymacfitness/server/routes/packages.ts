import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db.js";
import { requireAuth, requireTrainer, verifyAccess } from "../auth/jwt.js";

export const packagesRouter = Router();

// Public list endpoint.
// - By default only active packages are returned (public landing + client portal).
// - When `?all=1` is supplied AND the caller has a valid trainer JWT cookie,
//   every package (active + inactive) is returned. This is what the trainer
//   admin screen uses. If the caller is not an authenticated trainer, the
//   `?all=1` flag is ignored — they get the public list. This keeps behaviour
//   deterministic instead of silently flipping based on cookie freshness.
packagesRouter.get("/", async (req, res) => {
  const wantsAll = req.query.all === "1" || req.query.all === "true";

  let isTrainer = false;
  if (wantsAll) {
    const token = req.cookies?.access_token as string | undefined;
    if (token) {
      try {
        const payload = verifyAccess(token);
        isTrainer = payload.role === "TRAINER";
      } catch {
        // ignore: treat as anonymous
      }
    }
  }

  const pkgs = await prisma.package.findMany({
    where: wantsAll && isTrainer ? undefined : { isActive: true },
    orderBy: [{ featured: "desc" }, { sessions: "asc" }],
  });
  res.json(pkgs);
});

const packageTypeSchema = z.enum(["IN_PERSON", "ONLINE", "GROUP"]);

const createSchema = z.object({
  name: z.string().min(1),
  type: packageTypeSchema.optional(),
  sessions: z.number().int().positive(),
  price: z.number().positive(),
  pricePerSession: z.number().positive().optional(),
  description: z.string().optional(),
  highlights: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
  featured: z.boolean().optional(),
  stripeLink: z.string().url().nullable().optional(),
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
