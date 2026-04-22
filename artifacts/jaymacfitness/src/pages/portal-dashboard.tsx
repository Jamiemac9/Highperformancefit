import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { apiGet } from "../lib/api";
import { Calendar, MonitorPlay, MapPin, Clock, ArrowRight, Loader2, Sparkles, CalendarPlus } from "lucide-react";

interface Summary {
  profile: { id: string; firstName: string; lastName: string; progressNote: string | null };
  sessionsRemaining: number;
  activeBookings: Array<{ id: string; sessionsRemaining: number; package: { name: string; sessions: number } }>;
  upcoming: Array<{ id: string; date: string; duration: number; type: "GYM" | "ONLINE" | "OUTDOOR" }>;
}

const TYPE_ICON = { GYM: Clock, ONLINE: MonitorPlay, OUTDOOR: MapPin } as const;

function formatLong(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function PortalDashboard() {
  const { data, isLoading } = useQuery<Summary>({
    queryKey: ["me-summary"],
    queryFn: () => apiGet("/api/me/summary"),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-white/50">
        <Loader2 className="h-6 w-6 animate-spin mr-2" /> Loading…
      </div>
    );
  }
  if (!data) return <div className="text-white/60">Could not load your dashboard.</div>;

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="rounded-2xl border border-[#C8FF00]/20 bg-gradient-to-br from-[#C8FF00]/10 via-[#C8FF00]/5 to-transparent p-6 md:p-8">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-white/60 text-sm uppercase tracking-wider">Welcome back</p>
            <h2 className="font-display text-4xl md:text-5xl tracking-wide mt-1">
              {data.profile.firstName.toUpperCase()}
            </h2>
            <p className="text-white/70 mt-2 max-w-md">Ready to put in the work?</p>
          </div>
          <div className="text-right">
            <div className="text-xs uppercase tracking-wider text-white/50">Sessions remaining</div>
            <div className="font-display text-6xl text-[#C8FF00] leading-none mt-1">{data.sessionsRemaining}</div>
            {data.sessionsRemaining === 0 && (
              <Link to="/portal/packages" className="text-xs text-[#C8FF00] hover:underline inline-flex items-center gap-1 mt-2">
                Buy a package <ArrowRight className="h-3 w-3" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Active packages */}
      {data.activeBookings.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.activeBookings.map((b) => (
            <div key={b.id} className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
              <div className="text-xs uppercase tracking-wider text-white/50">Active package</div>
              <div className="font-display text-xl mt-1">{b.package.name}</div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="font-display text-3xl text-[#C8FF00]">{b.sessionsRemaining}</span>
                <span className="text-sm text-white/50">/ {b.package.sessions} left</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upcoming sessions */}
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-xl tracking-wide">UPCOMING SESSIONS</h3>
          <Link to="/portal/book" className="text-xs text-[#C8FF00] hover:underline inline-flex items-center gap-1">
            Book another <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        {data.upcoming.length === 0 ? (
          <div className="py-10 text-center text-white/40">
            <Calendar className="h-8 w-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No sessions scheduled yet.</p>
            <Link to="/portal/book" className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg bg-[#C8FF00] text-black text-sm font-semibold hover:bg-[#b8ee00]">
              <CalendarPlus className="h-4 w-4" /> Book a session
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {data.upcoming.map((s) => {
              const Icon = TYPE_ICON[s.type] ?? Clock;
              return (
                <div key={s.id} className="flex items-center gap-4 p-4 rounded-lg border border-white/5 bg-black/20">
                  <div className="h-12 w-12 rounded-lg bg-[#C8FF00]/10 border border-[#C8FF00]/20 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-[#C8FF00]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-white">{formatLong(s.date)}</div>
                    <div className="text-xs text-white/50 mt-0.5">{s.duration} mins · {s.type}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Progress note from trainer */}
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 md:p-6">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-4 w-4 text-[#C8FF00]" />
          <h3 className="font-display text-xl tracking-wide">PROGRESS NOTES FROM JAY</h3>
        </div>
        {data.profile.progressNote ? (
          <p className="text-white/80 whitespace-pre-wrap leading-relaxed">{data.profile.progressNote}</p>
        ) : (
          <p className="text-white/40 italic text-sm">
            Jay will leave personalised progress notes here after your sessions. Check back soon.
          </p>
        )}
      </div>
    </div>
  );
}

