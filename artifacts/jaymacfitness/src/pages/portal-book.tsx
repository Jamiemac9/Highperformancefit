import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPost } from "../lib/api";
import { Loader2, Clock, MonitorPlay, MapPin, ChevronLeft, ChevronRight, ShoppingCart, AlertCircle, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

interface Slot {
  id: string;
  date: string;
  duration: number;
  type: "GYM" | "ONLINE" | "OUTDOOR";
  isBooked: boolean;
}
interface Summary {
  sessionsRemaining: number;
}

const TYPE_ICON = { GYM: Clock, ONLINE: MonitorPlay, OUTDOOR: MapPin } as const;
const TYPE_LABEL = { GYM: "Gym", ONLINE: "Online", OUTDOOR: "Outdoor" } as const;

function startOfWeek(d: Date) {
  const out = new Date(d);
  out.setHours(0, 0, 0, 0);
  const day = (out.getDay() + 6) % 7; // Monday = 0
  out.setDate(out.getDate() - day);
  return out;
}
function addDays(d: Date, n: number) {
  const out = new Date(d);
  out.setDate(out.getDate() + n);
  return out;
}
function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function dayLabel(d: Date) {
  return d.toLocaleDateString("en-GB", { weekday: "short" }).toUpperCase();
}
function dayNumber(d: Date) {
  return d.getDate();
}
function timeLabel(iso: string) {
  return new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

export default function PortalBook() {
  const qc = useQueryClient();
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));
  const [confirm, setConfirm] = useState<Slot | null>(null);

  const summaryQuery = useQuery<Summary>({
    queryKey: ["me-summary"],
    queryFn: () => apiGet("/api/me/summary"),
  });

  const slotsQuery = useQuery<Slot[]>({
    queryKey: ["slots", weekStart.toISOString()],
    queryFn: () => {
      const from = weekStart.toISOString();
      const to = addDays(weekStart, 7).toISOString();
      return apiGet(`/api/slots?from=${from}&to=${to}`);
    },
  });

  const bookMutation = useMutation({
    mutationFn: (slotId: string) => apiPost("/api/bookings/session", { slotId }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["slots"] });
      qc.invalidateQueries({ queryKey: ["me-summary"] });
      qc.invalidateQueries({ queryKey: ["my-sessions-list"] });
      setConfirm(null);
    },
  });

  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart]);
  const slotsByDay = useMemo(() => {
    const map = new Map<string, Slot[]>();
    for (const s of slotsQuery.data ?? []) {
      const key = new Date(s.date).toDateString();
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(s);
    }
    return map;
  }, [slotsQuery.data]);

  const remaining = summaryQuery.data?.sessionsRemaining ?? 0;
  const canBook = remaining > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-wider text-white/50">Sessions remaining</div>
          <div className="font-display text-3xl text-[#C8FF00] mt-1">{remaining}</div>
        </div>
        {!canBook && (
          <Link
            to="/portal/packages"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#C8FF00] text-black text-sm font-semibold hover:bg-[#b8ee00]"
          >
            <ShoppingCart className="h-4 w-4" /> Buy a package
          </Link>
        )}
      </div>

      {/* No sessions warning */}
      {!canBook && (
        <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-200 flex items-start gap-2">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          <span>You have no sessions remaining. Purchase a package to book a slot.</span>
        </div>
      )}

      {/* Booking error */}
      {bookMutation.isError && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300 flex items-start gap-2">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          <span>{(bookMutation.error as Error)?.message || "Could not book that slot."}</span>
        </div>
      )}

      {/* Booking success */}
      {bookMutation.isSuccess && (
        <div className="rounded-lg border border-[#C8FF00]/30 bg-[#C8FF00]/10 px-4 py-3 text-sm text-[#C8FF00] flex items-start gap-2">
          <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />
          <span>Session booked. See you there.</span>
        </div>
      )}

      {/* Week navigator */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setWeekStart(addDays(weekStart, -7))}
          className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm"
        >
          <ChevronLeft className="h-4 w-4" /> Prev
        </button>
        <div className="font-display text-lg tracking-wide text-white/80">
          {weekStart.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
          {" – "}
          {addDays(weekStart, 6).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
        </div>
        <button
          onClick={() => setWeekStart(addDays(weekStart, 7))}
          className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm"
        >
          Next <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {slotsQuery.isLoading ? (
        <div className="py-16 flex items-center justify-center text-white/50">
          <Loader2 className="h-6 w-6 animate-spin mr-2" /> Loading availability…
        </div>
      ) : (
        <>
          {/* Desktop week grid */}
          <div className="hidden lg:grid grid-cols-7 gap-3">
            {days.map((d) => {
              const slots = slotsByDay.get(d.toDateString()) ?? [];
              const isToday = sameDay(d, new Date());
              return (
                <div key={d.toISOString()} className="rounded-xl border border-white/10 bg-white/[0.02] flex flex-col min-h-[200px]">
                  <div className={`px-3 py-2 border-b border-white/10 text-center ${isToday ? "bg-[#C8FF00]/10" : ""}`}>
                    <div className="text-[10px] uppercase tracking-wider text-white/50">{dayLabel(d)}</div>
                    <div className={`font-display text-2xl ${isToday ? "text-[#C8FF00]" : "text-white"}`}>{dayNumber(d)}</div>
                  </div>
                  <div className="p-2 space-y-2 flex-1">
                    {slots.length === 0 ? (
                      <div className="text-[11px] text-white/30 text-center py-4">No slots</div>
                    ) : (
                      slots.map((s) => {
                        const Icon = TYPE_ICON[s.type] ?? Clock;
                        return (
                          <button
                            key={s.id}
                            disabled={!canBook || bookMutation.isPending}
                            onClick={() => setConfirm(s)}
                            className="w-full text-left p-2 rounded-lg border border-[#C8FF00]/20 bg-[#C8FF00]/5 hover:bg-[#C8FF00]/15 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                          >
                            <div className="text-sm font-semibold text-[#C8FF00]">{timeLabel(s.date)}</div>
                            <div className="text-[10px] text-white/60 flex items-center gap-1 mt-0.5">
                              <Icon className="h-3 w-3" /> {s.duration}m · {TYPE_LABEL[s.type]}
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile / tablet — list grouped by day */}
          <div className="lg:hidden space-y-4">
            {days.map((d) => {
              const slots = slotsByDay.get(d.toDateString()) ?? [];
              if (slots.length === 0) return null;
              return (
                <div key={d.toISOString()} className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden">
                  <div className="px-4 py-2 border-b border-white/10 bg-black/20">
                    <div className="font-display text-lg tracking-wide">
                      {d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "short" })}
                    </div>
                  </div>
                  <div className="p-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {slots.map((s) => {
                      const Icon = TYPE_ICON[s.type] ?? Clock;
                      return (
                        <button
                          key={s.id}
                          disabled={!canBook || bookMutation.isPending}
                          onClick={() => setConfirm(s)}
                          className="text-left p-3 rounded-lg border border-[#C8FF00]/20 bg-[#C8FF00]/5 hover:bg-[#C8FF00]/15 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <div className="font-semibold text-[#C8FF00]">{timeLabel(s.date)}</div>
                          <div className="text-[11px] text-white/60 flex items-center gap-1 mt-0.5">
                            <Icon className="h-3 w-3" /> {s.duration}m · {TYPE_LABEL[s.type]}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            {(slotsQuery.data ?? []).length === 0 && (
              <div className="rounded-xl border border-white/10 bg-white/[0.02] py-12 text-center text-white/40">
                No availability this week.
              </div>
            )}
          </div>
        </>
      )}

      {/* Confirm dialog */}
      {confirm && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => !bookMutation.isPending && setConfirm(null)}
        >
          <div
            className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-display text-2xl tracking-wide">CONFIRM BOOKING</h3>
            <div className="mt-4 space-y-1 text-sm">
              <div className="text-white/60">When</div>
              <div className="text-white text-lg">
                {new Date(confirm.date).toLocaleString("en-GB", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
              <div className="text-white/60 mt-3">Type · Duration</div>
              <div className="text-white">{TYPE_LABEL[confirm.type]} · {confirm.duration} mins</div>
            </div>
            <div className="mt-6 flex gap-2">
              <button
                onClick={() => setConfirm(null)}
                disabled={bookMutation.isPending}
                className="flex-1 px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => bookMutation.mutate(confirm.id)}
                disabled={bookMutation.isPending}
                className="flex-1 px-4 py-2.5 rounded-lg bg-[#C8FF00] hover:bg-[#b8ee00] text-black text-sm font-semibold disabled:opacity-50 inline-flex items-center justify-center gap-2"
              >
                {bookMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
