import { Router } from "express";
import { prisma } from "../db.js";
import { requireAuth, requireTrainer } from "../auth/jwt.js";

export const dashboardRouter = Router();
dashboardRouter.use(requireAuth, requireTrainer);

dashboardRouter.get("/summary", async (_req, res) => {
  const now = new Date();
  const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const [
    totalClients,
    activeClients,
    prospects,
    upcomingSessions,
    completedSessions,
    newLeads,
    revenue,
    recentLeads,
    nextSessions,
    statusBreakdown,
  ] = await Promise.all([
    prisma.clientProfile.count(),
    prisma.clientProfile.count({ where: { status: "ACTIVE" } }),
    prisma.clientProfile.count({ where: { status: "PROSPECT" } }),
    prisma.session.count({ where: { date: { gte: now, lte: weekFromNow }, completed: false } }),
    prisma.session.count({ where: { completed: true } }),
    prisma.leadEnquiry.count({ where: { status: "NEW" } }),
    prisma.booking.findMany({ include: { package: true } }),
    prisma.leadEnquiry.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.session.findMany({
      where: { date: { gte: now }, completed: false },
      orderBy: { date: "asc" },
      take: 5,
      include: { client: { select: { firstName: true, lastName: true, id: true } } },
    }),
    prisma.clientProfile.groupBy({ by: ["status"], _count: { _all: true } }),
  ]);

  const totalRevenue = revenue.reduce((sum, b) => sum + Number(b.package.price), 0);

  res.json({
    totalClients,
    activeClients,
    prospects,
    upcomingSessions,
    completedSessions,
    newLeads,
    totalRevenue,
    recentLeads,
    nextSessions,
    statusBreakdown: statusBreakdown.map((s) => ({ status: s.status, count: s._count._all })),
  });
});
