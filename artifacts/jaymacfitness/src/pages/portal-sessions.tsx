import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiGet } from "../lib/api";
import { Loader2, Clock, MonitorPlay, MapPin, CheckCircle2, XCircle, Calendar } from "lucide-react";

interface SessionRow {
  id: string;
  date: string;
  duration: number;
  type: "GYM" | "ONLINE" | "OUTDOOR";
  notes: string | null;
  cancelled?: boolean;
  completed: boolean;
}

const TYPE_ICON = { GYM: Clock, ONLINE: MonitorPlay, OUTDOOR: MapPin } as const;

type Tab = "ALL" | "UPCOMING" | "COMPLETED" | "CANCELLED";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}
function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

function statusOf(s: SessionRow): "Upcoming" | "Completed" | "Cancelled" {
  if (s.cancelled) return "Cancelled";
  if (s.completed) return "Completed";
  return new Date(s.date) >= new Date() ? "Upcoming" : "Completed";
}

const STATUS_BADGE: Record<string, string> = {
  Upcoming: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  Completed: "bg-[#C8FF00]/15 text-[#C8FF00] border-[#C8FF00]/30",
  Cancelled: "bg-white/10 text-white/50 border-white/15",
};

export default function PortalSessions() {
  const [tab, setTab] = useState<Tab>("ALL");
  const { data, isLoading } = useQuery<SessionRow[]>({
    queryKey: ["my-sessions-list"],
    queryFn: () => apiGet("/api/sessions"),
  });

  const filtered = useMemo(() => {
    const items = data ?? [];
    if (tab === "ALL") return items;
    return items.filter((s) => statusOf(s).toUpperCase() === tab);
  }, [data, tab]);

  const tabs: Array<{ value: Tab; label: string }> = [
    { value: "ALL", label: "All" },
    { value: "UPCOMING", label: "Upcoming" },
    { value: "COMPLETED", label: "Completed" },
    { value: "CANCELLED", label: "Cancelled" },
  ];

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4">
        {tabs.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              tab === t.value
                ? "bg-[#C8FF00] text-black"
                : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden">
        {isLoading ? (
          <div className="py-16 flex items-center justify-center text-white/50">
            <Loader2 className="h-6 w-6 animate-spin mr-2" /> Loading sessions…
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center text-white/50">
            <Calendar className="h-10 w-10 mb-3 opacity-40" />
            <p>No sessions in this view.</p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-white/40">
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Type</th>
                    <th className="px-4 py-3 font-medium">Duration</th>
                    <th className="px-4 py-3 font-medium">Trainer Notes</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s) => {
                    const Icon = TYPE_ICON[s.type] ?? Clock;
                    const status = statusOf(s);
                    return (
                      <tr key={s.id} className="border-b border-white/5">
                        <td className="px-4 py-4 text-white whitespace-nowrap">
                          <div className="font-medium">{formatDate(s.date)}</div>
                          <div className="text-xs text-white/50">{formatTime(s.date)}</div>
                        </td>
                        <td className="px-4 py-4 text-white/70">
                          <span className="inline-flex items-center gap-2">
                            <Icon className="h-4 w-4 text-[#C8FF00]" /> {s.type}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-white/70 whitespace-nowrap">{s.duration} min</td>
                        <td className="px-4 py-4 text-white/70 max-w-md">
                          {s.notes ? (
                            <span className="line-clamp-2">{s.notes}</span>
                          ) : (
                            <span className="text-white/30 italic">—</span>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <StatusChip status={status} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-white/5">
              {filtered.map((s) => {
                const Icon = TYPE_ICON[s.type] ?? Clock;
                const status = statusOf(s);
                return (
                  <div key={s.id} className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-lg bg-[#C8FF00]/10 border border-[#C8FF00]/20 flex items-center justify-center shrink-0">
                        <Icon className="h-5 w-5 text-[#C8FF00]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <div className="font-medium text-white">{formatDate(s.date)}</div>
                          <StatusChip status={status} />
                        </div>
                        <div className="text-xs text-white/50 mt-0.5">
                          {formatTime(s.date)} · {s.duration} min · {s.type}
                        </div>
                        {s.notes && <p className="text-sm text-white/70 mt-2">{s.notes}</p>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function StatusChip({ status }: { status: "Upcoming" | "Completed" | "Cancelled" }) {
  const Icon = status === "Completed" ? CheckCircle2 : status === "Cancelled" ? XCircle : Clock;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${STATUS_BADGE[status]}`}>
      <Icon className="h-3 w-3" /> {status}
    </span>
  );
}
