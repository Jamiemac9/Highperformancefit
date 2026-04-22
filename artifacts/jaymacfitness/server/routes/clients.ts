import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db.js";
import { requireAuth, requireTrainer, type AuthedRequest } from "../auth/jwt.js";

export const clientsRouter = Router();

clientsRouter.use(requireAuth, requireTrainer);

clientsRouter.get("/", async (_req, res) => {
  const clients = await prisma.clientProfile.findMany({
    include: { user: { select: { email: true } }, _count: { select: { sessions: true, bookings: true } } },
    orderBy: { joinedAt: "desc" },
  });
  res.json(clients);
});

clientsRouter.get("/:id", async (req, res) => {
  const client = await prisma.clientProfile.findUnique({
    where: { id: req.params.id },
    include: {
      user: { select: { email: true, createdAt: true } },
      sessions: { orderBy: { date: "desc" } },
      bookings: { include: { package: true }, orderBy: { purchasedAt: "desc" } },
    },
  });
  if (!client) return res.status(404).json({ error: "Not found" });
  res.json(client);
});

const createSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().optional(),
  dob: z.string().optional(),
  goals: z.string().optional(),
  medicalNotes: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "PROSPECT"]).optional(),
});

clientsRouter.post("/", async (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
  const d = parsed.data;
  const existing = await prisma.user.findUnique({ where: { email: d.email.toLowerCase() } });
  if (existing) return res.status(409).json({ error: "Email already exists" });
  const created = await prisma.user.create({
    data: {
      email: d.email.toLowerCase(),
      passwordHash: "",
      role: "CLIENT",
      clientProfile: {
        create: {
          firstName: d.firstName,
          lastName: d.lastName,
          phone: d.phone,
          dob: d.dob ? new Date(d.dob) : undefined,
          goals: d.goals,
          medicalNotes: d.medicalNotes,
          status: d.status ?? "PROSPECT",
        },
      },
    },
    include: { clientProfile: true },
  });
  res.status(201).json(created.clientProfile);
});

const updateSchema = createSchema.partial().omit({ email: true });

clientsRouter.patch("/:id", async (req, res) => {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
  const updated = await prisma.clientProfile.update({
    where: { id: req.params.id },
    data: { ...parsed.data, dob: parsed.data.dob ? new Date(parsed.data.dob) : undefined },
  });
  res.json(updated);
});

clientsRouter.delete("/:id", async (req: AuthedRequest, res) => {
  const cp = await prisma.clientProfile.findUnique({ where: { id: req.params.id } });
  if (!cp) return res.status(404).json({ error: "Not found" });
  await prisma.user.delete({ where: { id: cp.userId } });
  res.json({ ok: true });
});
