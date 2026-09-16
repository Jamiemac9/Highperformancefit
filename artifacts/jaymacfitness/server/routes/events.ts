import { Router } from "express";
import { body, validationResult } from "express-validator";
import rateLimit from "express-rate-limit";
import { prisma } from "../db.js";

export const eventsRouter = Router();
const eventRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
});

eventsRouter.post(
  "/",
  eventRateLimiter,
  body("event").isString().trim().isIn(["enquiry_created", "waitlist_joined", "booking_clicked"]),
  body("payload").optional().isObject(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: "Invalid event", details: errors.array() });
    try {
      await prisma.eventLog.create({
        data: { event: req.body.event, payload: req.body.payload || {} },
      });
      res.status(201).json({ ok: true });
    } catch (error) {
      next(error);
    }
  },
);