import { Router } from "express";
import { body, validationResult } from "express-validator";
import rateLimit from "express-rate-limit";
import { prisma } from "../db.js";

export const waitlistRouter = Router();
const waitlistRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

waitlistRouter.post(
  "/",
  waitlistRateLimiter,
  body("firstName").isString().trim().isLength({ min: 1, max: 100 }),
  body("email").isEmail().normalizeEmail(),
  body("whatsapp").isString().trim().isLength({ min: 5, max: 50 }),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: "Please check your details", details: errors.array() });
    try {
      const entry = await prisma.bootcampWaitlist.upsert({
        where: { email: req.body.email },
        update: { firstName: req.body.firstName, whatsapp: req.body.whatsapp, status: "waitlist" },
        create: { firstName: req.body.firstName, email: req.body.email, whatsapp: req.body.whatsapp },
      });
      await prisma.eventLog.create({
        data: { event: "waitlist_joined", payload: { waitlistId: entry.id, source: "landing" } },
      });
      res.status(201).json({ ok: true });
    } catch (error) {
      next(error);
    }
  },
);