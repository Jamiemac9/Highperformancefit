import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "../db.js";
import {
  signAccess,
  signRefresh,
  verifyRefresh,
  cookieOpts,
  requireAuth,
  type AuthedRequest,
} from "../auth/jwt.js";

export const authRouter = Router();

const loginSchema = z.object({ email: z.string().email(), password: z.string().min(1) });
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().optional(),
});

authRouter.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  const payload = { sub: user.id, role: user.role, email: user.email };
  const access = signAccess(payload);
  const refresh = signRefresh(payload);

  res.cookie("access_token", access, { ...cookieOpts, maxAge: 15 * 60 * 1000 });
  res.cookie("refresh_token", refresh, { ...cookieOpts, maxAge: 7 * 24 * 60 * 60 * 1000 });
  res.json({ user: { id: user.id, email: user.email, role: user.role } });
});

authRouter.post("/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
  const { email, password, firstName, lastName, phone } = parsed.data;
  const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (existing) return res.status(409).json({ error: "Email already registered" });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email: email.toLowerCase(),
      passwordHash,
      role: "CLIENT",
      clientProfile: {
        create: { firstName, lastName, phone, status: "ACTIVE" },
      },
    },
  });

  const payload = { sub: user.id, role: user.role, email: user.email };
  res.cookie("access_token", signAccess(payload), { ...cookieOpts, maxAge: 15 * 60 * 1000 });
  res.cookie("refresh_token", signRefresh(payload), { ...cookieOpts, maxAge: 7 * 24 * 60 * 60 * 1000 });
  res.status(201).json({ user: { id: user.id, email: user.email, role: user.role } });
});

authRouter.post("/refresh", (req, res) => {
  const token = req.cookies?.refresh_token;
  if (!token) return res.status(401).json({ error: "No refresh token" });
  try {
    const payload = verifyRefresh(token);
    const fresh = { sub: payload.sub, role: payload.role, email: payload.email };
    res.cookie("access_token", signAccess(fresh), { ...cookieOpts, maxAge: 15 * 60 * 1000 });
    res.json({ ok: true });
  } catch {
    return res.status(401).json({ error: "Invalid refresh token" });
  }
});

authRouter.post("/logout", (_req, res) => {
  res.clearCookie("access_token", cookieOpts);
  res.clearCookie("refresh_token", cookieOpts);
  res.json({ ok: true });
});

authRouter.get("/me", requireAuth, async (req: AuthedRequest, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.sub },
    include: { clientProfile: true },
  });
  if (!user) return res.status(404).json({ error: "Not found" });
  res.json({
    id: user.id,
    email: user.email,
    role: user.role,
    profile: user.clientProfile,
  });
});
