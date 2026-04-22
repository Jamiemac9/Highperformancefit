import jwt, { SignOptions } from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

const ACCESS_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
if (!ACCESS_SECRET || !REFRESH_SECRET) {
  throw new Error("JWT_SECRET and JWT_REFRESH_SECRET environment variables must be set");
}
const ACCESS_TTL = "15m";
const REFRESH_TTL = "7d";

export type JwtPayload = { sub: string; role: "TRAINER" | "CLIENT"; email: string };

export function signAccess(payload: JwtPayload) {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_TTL } as SignOptions);
}

export function signRefresh(payload: JwtPayload) {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_TTL } as SignOptions);
}

export function verifyAccess(token: string): JwtPayload {
  return jwt.verify(token, ACCESS_SECRET) as JwtPayload;
}

export function verifyRefresh(token: string): JwtPayload {
  return jwt.verify(token, REFRESH_SECRET) as JwtPayload;
}

export const cookieOpts = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

export interface AuthedRequest extends Request {
  user?: JwtPayload;
}

export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const token = req.cookies?.access_token;
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    req.user = verifyAccess(token);
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

export function requireTrainer(req: AuthedRequest, res: Response, next: NextFunction) {
  if (req.user?.role !== "TRAINER") return res.status(403).json({ error: "Forbidden" });
  next();
}
