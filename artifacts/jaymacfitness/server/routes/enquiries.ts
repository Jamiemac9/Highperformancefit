import { Router } from "express";
import { body, param, query, validationResult } from "express-validator";
import rateLimit from "express-rate-limit";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { prisma } from "../db.js";
import { requireAuth, requireTrainer } from "../auth/jwt.js";

export const enquiriesRouter = Router();

const enquiryRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many enquiries from this IP. Please try again in an hour." },
});

function handleValidation(req: any, res: any): boolean {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ error: "Validation failed", details: errors.array() });
    return true;
  }
  return false;
}

function generateTempPassword(): string {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789abcdefghjkmnpqrstuvwxyz";
  let out = "";
  for (let i = 0; i < 12; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out + "!1";
}

async function sendWelcomeEmail(email: string, tempPassword: string, firstName: string) {
  const transport = nodemailer.createTransport({
    jsonTransport: true,
  });
  const info = await transport.sendMail({
    from: '"JayMacFitness" <noreply@jaymacfitness.co.uk>',
    to: email,
    subject: "Welcome to JayMacFitness — your account is ready",
    text: `Hi ${firstName},\n\nYour client account has been created.\n\nLogin email: ${email}\nTemporary password: ${tempPassword}\n\nPlease change your password after your first login.\n\nJay`,
  });
  console.log(`[email] welcome email queued for ${email}`, info.messageId);
}

enquiriesRouter.post(
  "/",
  enquiryRateLimiter,
  body("name").isString().trim().isLength({ min: 1, max: 200 }).withMessage("Name is required"),
  body("email").isEmail().normalizeEmail().withMessage("Valid email is required"),
  body("phone").optional({ nullable: true, checkFalsy: true }).isString().trim().isLength({ max: 50 }),
  body("message").isString().trim().isLength({ min: 1, max: 5000 }).withMessage("Message is required"),
  body("source").optional({ nullable: true, checkFalsy: true }).isString().trim().isLength({ max: 100 }),
  async (req, res, next) => {
    if (handleValidation(req, res)) return;
    try {
      const { name, email, phone, message, source } = req.body;
      const created = await prisma.leadEnquiry.create({
        data: {
          name,
          email,
          phone: phone || null,
          message,
          source: source || "website",
        },
      });
      res.status(201).json(created);
    } catch (err) {
      next(err);
    }
  }
);

enquiriesRouter.get(
  "/",
  requireAuth,
  requireTrainer,
  query("status").optional().isIn(["NEW", "CONTACTED", "CONVERTED", "LOST"]),
  query("page").optional().isInt({ min: 1 }).toInt(),
  query("limit").optional().isInt({ min: 1, max: 100 }).toInt(),
  async (req, res, next) => {
    if (handleValidation(req, res)) return;
    try {
      const status = req.query.status as any;
      const page = (req.query.page as unknown as number) || 1;
      const limit = (req.query.limit as unknown as number) || 20;
      const where = status ? { status } : {};
      const [items, total] = await Promise.all([
        prisma.leadEnquiry.findMany({
          where,
          orderBy: { createdAt: "desc" },
          skip: (page - 1) * limit,
          take: limit,
        }),
        prisma.leadEnquiry.count({ where }),
      ]);
      res.json({
        items,
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      });
    } catch (err) {
      next(err);
    }
  }
);

enquiriesRouter.patch(
  "/:id",
  requireAuth,
  requireTrainer,
  param("id").isString().notEmpty(),
  body("status").optional().isIn(["NEW", "CONTACTED", "CONVERTED", "LOST"]),
  body("note").optional({ nullable: true }).isString().isLength({ max: 5000 }),
  async (req, res, next) => {
    if (handleValidation(req, res)) return;
    try {
      const { status, note } = req.body;
      if (status === undefined && note === undefined) {
        return res.status(400).json({ error: "Provide status and/or note to update" });
      }
      const data: any = {};
      if (status !== undefined) data.status = status;
      if (note !== undefined) data.note = note;
      const updated = await prisma.leadEnquiry.update({
        where: { id: req.params.id },
        data,
      });
      res.json(updated);
    } catch (err: any) {
      if (err?.code === "P2025") return res.status(404).json({ error: "Enquiry not found" });
      next(err);
    }
  }
);

enquiriesRouter.post(
  "/:id/convert",
  requireAuth,
  requireTrainer,
  param("id").isString().notEmpty(),
  async (req, res, next) => {
    if (handleValidation(req, res)) return;
    try {
      const lead = await prisma.leadEnquiry.findUnique({ where: { id: req.params.id } });
      if (!lead) return res.status(404).json({ error: "Enquiry not found" });
      if (lead.status === "CONVERTED" && lead.convertedClientId) {
        const existing = await prisma.clientProfile.findUnique({
          where: { id: lead.convertedClientId },
          include: { user: { select: { id: true, email: true, role: true } } },
        });
        if (existing) return res.status(409).json({ error: "Lead already converted", client: existing });
      }

      const existingUser = await prisma.user.findUnique({ where: { email: lead.email } });
      if (existingUser) {
        return res.status(409).json({ error: "A user with this email already exists" });
      }

      const [firstName, ...rest] = lead.name.trim().split(/\s+/);
      const lastName = rest.join(" ") || "—";
      const tempPassword = generateTempPassword();
      const passwordHash = await bcrypt.hash(tempPassword, 10);

      const result = await prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            email: lead.email,
            passwordHash,
            role: "CLIENT",
          },
        });
        const profile = await tx.clientProfile.create({
          data: {
            userId: user.id,
            firstName,
            lastName,
            phone: lead.phone,
            goals: lead.message,
            status: "ACTIVE",
          },
        });
        await tx.leadEnquiry.update({
          where: { id: lead.id },
          data: { status: "CONVERTED", convertedClientId: profile.id },
        });
        return { user, profile };
      });

      try {
        await sendWelcomeEmail(lead.email, tempPassword, firstName);
      } catch (mailErr) {
        console.error("[email] failed to send welcome email", mailErr);
      }

      res.status(201).json({
        client: {
          ...result.profile,
          user: { id: result.user.id, email: result.user.email, role: result.user.role },
        },
        emailSent: true,
      });
    } catch (err) {
      next(err);
    }
  }
);

enquiriesRouter.delete(
  "/:id",
  requireAuth,
  requireTrainer,
  param("id").isString().notEmpty(),
  async (req, res, next) => {
    if (handleValidation(req, res)) return;
    try {
      await prisma.leadEnquiry.delete({ where: { id: req.params.id } });
      res.json({ ok: true });
    } catch (err: any) {
      if (err?.code === "P2025") return res.status(404).json({ error: "Enquiry not found" });
      next(err);
    }
  }
);
