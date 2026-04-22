import { useState, useMemo, Fragment } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { apiGet, apiPatch, apiPost } from "../lib/api";
import {
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  ChevronsRight,
  Mail,
  Phone,
  Calendar,
  UserPlus,
  PhoneCall,
  XCircle,
  Inbox as InboxIcon,
  Loader2,
  TrendingUp,
} from "lucide-react";

type LeadStatus = "NEW" | "CONTACTED" | "CONVERTED" | "LOST";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  source: string | null;
  note: string | null;
  status: LeadStatus;
  createdAt: string;
  updatedAt: string;
  convertedClientId: string | null;
}

interface LeadsResponse {
  items: Lead[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const STATUS_TABS: Array<{ value: LeadStatus | "ALL"; label: string }> = [
  { value: "ALL", label: "All" },
  { value: "NEW", label: "New" },
  { value: "CONTACTED", label: "Contacted" },
  { value: "CONVERTED", label: "Converted" },
  { value: "LOST", label: "Lost" },
];

const STATUS_STYLES: Record<LeadStatus, string> = {
  NEW: "bg-yellow-500/15 text-yellow-300 border-yellow-500/30",
  CONTACTED: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  CONVERTED: "bg-[#C8FF00]/15 text-[#C8FF00] border-[#C8FF00]/30",
  LOST: "bg-white/10 text-white/50 border-white/15",
};

const PAGE_SIZE = 20;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function extractGoal(message: string): string {
  const match = message.match(/Goal:\s*([^\n]+)/i);
  if (match) return match[1].trim();
  return "—";
}

function extractBody(message: string): string {
  const lines = message.split("\n").filter((l) => !/^Goal:/i.test(l) && l.trim());
  return lines.join("\n").trim() || message;
}

export default function DashboardLeads() {
  const [tab, setTab] = useState<LeadStatus | "ALL">("ALL");
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const qc = useQueryClient();
  const navigate = useNavigate();

  // Aggregate stats from a dedicated endpoint (accurate at any scale).
  const statsQuery = useQuery<{
    total: number;
    counts: Record<"NEW" | "CONTACTED" | "CONVERTED" | "LOST", number>;
    conversionRate: number;
  }>({
    queryKey: ["enquiries-stats"],
    queryFn: () => apiGet(`/api/enquiries/stats`),
  });

  const listQuery = useQuery<LeadsResponse>({
    queryKey: ["enquiries", tab, page],
    queryFn: () => {
      const params = new URLSearchParams({ page: String(page), limit: String(PAGE_SIZE) });
      if (tab !== "ALL") params.set("status", tab);
      return apiGet(`/api/enquiries?${params.toString()}`);
    },
  });

  const stats = useMemo(() => {
    const data = statsQuery.data;
    return {
      total: data?.total ?? 0,
      newCount: data?.counts?.NEW ?? 0,
      convertedCount: data?.counts?.CONVERTED ?? 0,
      conversionRate: data?.conversionRate ?? 0,
    };
  }, [statsQuery.data]);

  const patchMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: LeadStatus }) =>
      apiPatch(`/api/enquiries/${id}`, { status }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["enquiries"] });
      qc.invalidateQueries({ queryKey: ["enquiries-stats"] });
    },
  });

  const convertMutation = useMutation({
    mutationFn: (id: string) => apiPost(`/api/enquiries/${id}/convert`),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["enquiries"] });
      qc.invalidateQueries({ queryKey: ["enquiries-stats"] });
      const clientId = data?.client?.id;
      if (clientId) navigate(`/dashboard/clients/${clientId}`);
    },
  });

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const onTabChange = (val: LeadStatus | "ALL") => {
    setTab(val);
    setPage(1);
    setExpanded(new Set());
  };

  const items = listQuery.data?.items ?? [];
  const totalPages = listQuery.data?.totalPages ?? 1;

  return (
    <div className="space-y-8">
      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total Leads" value={stats.total} icon={InboxIcon} />
        <StatCard label="New (Uncontacted)" value={stats.newCount} icon={Mail} accent />
        <StatCard
          label="Conversion Rate"
          value={`${stats.conversionRate}%`}
          icon={TrendingUp}
          subtitle={`${stats.convertedCount} converted`}
        />
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4">
        {STATUS_TABS.map((t) => {
          const active = tab === t.value;
          return (
            <button
              key={t.value}
              onClick={() => onTabChange(t.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                active
                  ? "bg-[#C8FF00] text-black"
                  : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Errors */}
      {convertMutation.isError && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {(convertMutation.error as Error)?.message || "Could not convert lead. They may already have a client account."}
        </div>
      )}

      {/* Table */}
      <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden">
        {listQuery.isLoading ? (
          <div className="py-16 flex items-center justify-center text-white/50">
            <Loader2 className="h-6 w-6 animate-spin mr-2" /> Loading enquiries…
          </div>
        ) : items.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center text-white/50">
            <InboxIcon className="h-10 w-10 mb-3 opacity-40" />
            <p>No enquiries in this view.</p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-white/40">
                    <th className="w-10"></th>
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Phone</th>
                    <th className="px-4 py-3 font-medium">Goal</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((lead) => {
                    const isOpen = expanded.has(lead.id);
                    const busy =
                      (patchMutation.isPending && patchMutation.variables?.id === lead.id) ||
                      (convertMutation.isPending && convertMutation.variables === lead.id);
                    return (
                      <Fragment key={lead.id}>
                        <tr
                          onClick={() => toggleExpand(lead.id)}
                          className="border-b border-white/5 hover:bg-white/[0.03] cursor-pointer transition-colors"
                        >
                          <td className="pl-4">
                            {isOpen ? (
                              <ChevronDown className="h-4 w-4 text-white/40" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-white/40" />
                            )}
                          </td>
                          <td className="px-4 py-4 font-medium text-white">{lead.name}</td>
                          <td className="px-4 py-4 text-white/70">{lead.email}</td>
                          <td className="px-4 py-4 text-white/70">{lead.phone || "—"}</td>
                          <td className="px-4 py-4 text-white/70">{extractGoal(lead.message)}</td>
                          <td className="px-4 py-4 text-white/70 whitespace-nowrap">{formatDate(lead.createdAt)}</td>
                          <td className="px-4 py-4">
                            <StatusBadge status={lead.status} />
                          </td>
                          <td className="px-4 py-4">
                            <ActionButtons
                              lead={lead}
                              busy={busy}
                              onMark={(status) => patchMutation.mutate({ id: lead.id, status })}
                              onConvert={() => convertMutation.mutate(lead.id)}
                            />
                          </td>
                        </tr>
                        {isOpen && (
                          <tr className="bg-black/30 border-b border-white/5">
                            <td></td>
                            <td colSpan={7} className="px-4 py-5">
                              <ExpandedDetails lead={lead} />
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="lg:hidden divide-y divide-white/5">
              {items.map((lead) => {
                const isOpen = expanded.has(lead.id);
                const busy =
                  (patchMutation.isPending && patchMutation.variables?.id === lead.id) ||
                  (convertMutation.isPending && convertMutation.variables === lead.id);
                return (
                  <div key={lead.id} className="p-4">
                    <button
                      onClick={() => toggleExpand(lead.id)}
                      className="w-full flex items-start justify-between gap-3 text-left"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-white truncate">{lead.name}</span>
                          <StatusBadge status={lead.status} small />
                        </div>
                        <div className="text-sm text-white/60 truncate">{lead.email}</div>
                        <div className="text-xs text-white/40 mt-1">
                          {extractGoal(lead.message)} · {formatDate(lead.createdAt)}
                        </div>
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 text-white/40 mt-1 transition-transform ${isOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    {isOpen && (
                      <div className="mt-4 pt-4 border-t border-white/5 space-y-4">
                        <ExpandedDetails lead={lead} />
                        <ActionButtons
                          lead={lead}
                          busy={busy}
                          stacked
                          onMark={(status) => patchMutation.mutate({ id: lead.id, status })}
                          onConvert={() => convertMutation.mutate(lead.id)}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between gap-4 px-4 py-4 border-t border-white/10">
            <div className="text-xs text-white/50">
              Page <span className="text-white">{page}</span> of {totalPages} · {listQuery.data?.total} total
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="h-9 w-9 inline-flex items-center justify-center rounded-md border border-white/10 text-white/70 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="h-9 w-9 inline-flex items-center justify-center rounded-md border border-white/10 text-white/70 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronsRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  subtitle,
  accent,
}: {
  label: string;
  value: string | number;
  icon: any;
  subtitle?: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-medium uppercase tracking-wider text-white/50">{label}</div>
          <div className={`font-display text-4xl mt-2 ${accent ? "text-[#C8FF00]" : "text-white"}`}>{value}</div>
          {subtitle && <div className="text-xs text-white/40 mt-1">{subtitle}</div>}
        </div>
        <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center">
          <Icon className="h-5 w-5 text-white/60" />
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status, small }: { status: LeadStatus; small?: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border font-semibold uppercase tracking-wider ${STATUS_STYLES[status]} ${
        small ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs"
      }`}
    >
      {status}
    </span>
  );
}

function ExpandedDetails({ lead }: { lead: Lead }) {
  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4 text-sm">
        <div className="flex items-center gap-2 text-white/70">
          <Mail className="h-4 w-4 text-white/40" />
          <a href={`mailto:${lead.email}`} className="hover:text-[#C8FF00]">{lead.email}</a>
        </div>
        {lead.phone && (
          <div className="flex items-center gap-2 text-white/70">
            <Phone className="h-4 w-4 text-white/40" />
            <a href={`tel:${lead.phone}`} className="hover:text-[#C8FF00]">{lead.phone}</a>
          </div>
        )}
        <div className="flex items-center gap-2 text-white/70">
          <Calendar className="h-4 w-4 text-white/40" />
          {new Date(lead.createdAt).toLocaleString("en-GB")}
        </div>
        {lead.source && (
          <div className="text-white/70">
            <span className="text-white/40">Source:</span> {lead.source}
          </div>
        )}
      </div>
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-2">Message</div>
        <div className="text-sm text-white/80 whitespace-pre-wrap leading-relaxed bg-black/30 rounded-lg p-4 border border-white/5">
          {extractBody(lead.message)}
        </div>
      </div>
      {lead.note && (
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-2">Internal Note</div>
          <div className="text-sm text-white/70 bg-black/30 rounded-lg p-4 border border-white/5">{lead.note}</div>
        </div>
      )}
    </div>
  );
}

function ActionButtons({
  lead,
  busy,
  stacked,
  onMark,
  onConvert,
}: {
  lead: Lead;
  busy: boolean;
  stacked?: boolean;
  onMark: (status: LeadStatus) => void;
  onConvert: () => void;
}) {
  const stop = (e: React.MouseEvent) => e.stopPropagation();
  const isFinal = lead.status === "CONVERTED" || lead.status === "LOST";

  const baseBtn = "inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed";

  return (
    <div
      onClick={stop}
      className={`${stacked ? "flex flex-col gap-2 w-full" : "flex flex-wrap items-center justify-end gap-2"}`}
    >
      <button
        type="button"
        onClick={(e) => { stop(e); onMark("CONTACTED"); }}
        disabled={busy || lead.status === "CONTACTED" || isFinal}
        className={`${baseBtn} bg-blue-500/15 text-blue-300 border border-blue-500/30 hover:bg-blue-500/25 ${stacked ? "w-full" : ""}`}
      >
        <PhoneCall className="h-3.5 w-3.5" />
        Mark Contacted
      </button>
      <button
        type="button"
        onClick={(e) => { stop(e); onConvert(); }}
        disabled={busy || lead.status === "CONVERTED"}
        className={`${baseBtn} bg-[#C8FF00] text-black hover:bg-[#b8ee00] ${stacked ? "w-full" : ""}`}
      >
        {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <UserPlus className="h-3.5 w-3.5" />}
        Convert to Client
      </button>
      <button
        type="button"
        onClick={(e) => { stop(e); onMark("LOST"); }}
        disabled={busy || isFinal}
        className={`${baseBtn} bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 ${stacked ? "w-full" : ""}`}
      >
        <XCircle className="h-3.5 w-3.5" />
        Mark Lost
      </button>
    </div>
  );
}
