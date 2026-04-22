import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { apiGet } from "../lib/api";
import {
  Users,
  Calendar,
  TrendingUp,
  Inbox,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Activity,
} from "lucide-react";

interface DashboardSummary {
  totalClients: number;
  activeClients: number;
  prospects: number;
  upcomingSessions: number;
  completedSessions: number;
  newLeads: number;
  totalRevenue: number | string;
  recentLeads: Array<{ id: string; name: string; email: string; status: string; createdAt: string }>;
  nextSessions: Array<{
    id: string;
    date: string;
    duration: number;
    type: string;
    client?: { firstName: string; lastName: string };
  }>;
  statusBreakdown: Array<{ status: string; count: number }>;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const STATUS_BADGE: Record<string, string> = {
  NEW: "bg-yellow-500/15 text-yellow-300 border-yellow-500/30",
  CONTACTED: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  CONVERTED: "bg-[#C8FF00]/15 text-[#C8FF00] border-[#C8FF00]/30",
  LOST: "bg-white/10 text-white/50 border-white/15",
};

export default function Dashboard() {
  const { data, isLoading } = useQuery<DashboardSummary>({
    queryKey: ["dashboard-summary"],
    queryFn: () => apiGet("/api/dashboard/summary"),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-white/50">
        <Loader2 className="h-6 w-6 animate-spin mr-2" /> Loading dashboard…
      </div>
    );
  }

  if (!data) {
    return <div className="text-white/60">Could not load dashboard data.</div>;
  }

  const stats = [
    { label: "Total Clients", value: data.totalClients, sub: `${data.activeClients} active`, icon: Users },
    { label: "Upcoming Sessions", value: data.upcomingSessions, sub: `${data.completedSessions} completed`, icon: Calendar },
    { label: "New Leads", value: data.newLeads, sub: `${data.prospects} prospects`, icon: Inbox, accent: true },
    { label: "Revenue", value: `£${Number(data.totalRevenue || 0).toLocaleString()}`, sub: "All time", icon: TrendingUp },
  ];

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <p className="text-white/60">Here's what's happening with your training business today.</p>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs font-medium uppercase tracking-wider text-white/50">{s.label}</div>
                <div className={`font-display text-4xl mt-2 ${s.accent ? "text-[#C8FF00]" : "text-white"}`}>{s.value}</div>
                <div className="text-xs text-white/40 mt-1">{s.sub}</div>
              </div>
              <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center">
                <s.icon className="h-5 w-5 text-white/60" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Two-column: next sessions + recent leads */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl tracking-wide">UPCOMING SESSIONS</h2>
            <Link to="/dashboard/sessions" className="text-xs text-[#C8FF00] hover:underline inline-flex items-center gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {data.nextSessions.length === 0 ? (
            <div className="py-10 text-center text-white/40 text-sm">
              <Calendar className="h-8 w-8 mx-auto mb-2 opacity-40" />
              No sessions scheduled.
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {data.nextSessions.slice(0, 5).map((s) => (
                <div key={s.id} className="py-3 flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-[#C8FF00]/10 border border-[#C8FF00]/20 flex items-center justify-center">
                    <Activity className="h-4 w-4 text-[#C8FF00]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-white">
                      {s.client ? `${s.client.firstName} ${s.client.lastName}` : "Session"}
                    </div>
                    <div className="text-xs text-white/50">{formatTime(s.date)} · {s.duration}min · {s.type}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl tracking-wide">RECENT LEADS</h2>
            <Link to="/dashboard/leads" className="text-xs text-[#C8FF00] hover:underline inline-flex items-center gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {data.recentLeads.length === 0 ? (
            <div className="py-10 text-center text-white/40 text-sm">
              <Inbox className="h-8 w-8 mx-auto mb-2 opacity-40" />
              No enquiries yet.
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {data.recentLeads.slice(0, 5).map((l) => (
                <Link
                  to="/dashboard/leads"
                  key={l.id}
                  className="py-3 flex items-center gap-3 hover:bg-white/[0.03] -mx-2 px-2 rounded transition-colors"
                >
                  <div className="h-9 w-9 rounded-full bg-white/5 flex items-center justify-center text-xs font-bold text-white/70">
                    {l.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-white truncate">{l.name}</div>
                    <div className="text-xs text-white/50 truncate">{l.email}</div>
                  </div>
                  <div className="text-xs text-white/40 hidden sm:block">{formatDate(l.createdAt)}</div>
                  <span
                    className={`hidden sm:inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                      STATUS_BADGE[l.status] || "bg-white/10 text-white/60 border-white/10"
                    }`}
                  >
                    {l.status}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Client breakdown */}
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 md:p-6">
        <h2 className="font-display text-xl tracking-wide mb-4">CLIENT BREAKDOWN</h2>
        <div className="grid grid-cols-3 gap-4">
          {(data.statusBreakdown.length > 0 ? data.statusBreakdown : [{ status: "ACTIVE", count: 0 }, { status: "INACTIVE", count: 0 }, { status: "PROSPECT", count: 0 }]).map((b) => (
            <div key={b.status} className="text-center py-4 border border-white/5 rounded-lg">
              <div className="font-display text-3xl text-white">{b.count}</div>
              <div className="text-xs uppercase tracking-wider text-white/50 mt-1">{b.status}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
