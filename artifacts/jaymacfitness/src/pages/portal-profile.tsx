import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPatch } from "../lib/api";
import { Loader2, Save, AlertCircle, CheckCircle2, Lock } from "lucide-react";

interface Profile {
  id: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  goals: string | null;
  emergencyContact: string | null;
  user: { email: string };
}

export default function PortalProfile() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery<Profile>({
    queryKey: ["me-profile"],
    queryFn: () => apiGet("/api/me/profile"),
  });

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    goals: "",
    emergencyContact: "",
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (data) {
      setForm({
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone ?? "",
        goals: data.goals ?? "",
        emergencyContact: data.emergencyContact ?? "",
      });
    }
  }, [data]);

  const save = useMutation({
    mutationFn: (body: typeof form) =>
      apiPatch("/api/me/profile", {
        firstName: body.firstName,
        lastName: body.lastName,
        phone: body.phone || null,
        goals: body.goals || null,
        emergencyContact: body.emergencyContact || null,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["me-profile"] });
      qc.invalidateQueries({ queryKey: ["me-summary"] });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    },
  });

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center py-20 text-white/50">
        <Loader2 className="h-6 w-6 animate-spin mr-2" /> Loading…
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        save.mutate(form);
      }}
      className="max-w-2xl space-y-6"
    >
      {save.isError && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300 flex items-start gap-2">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          <span>{(save.error as Error)?.message || "Could not save profile."}</span>
        </div>
      )}
      {saved && (
        <div className="rounded-lg border border-[#C8FF00]/30 bg-[#C8FF00]/10 px-4 py-3 text-sm text-[#C8FF00] flex items-start gap-2">
          <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />
          <span>Profile saved.</span>
        </div>
      )}

      <Section title="Personal details">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="First name">
            <input
              required
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              className={inputCls}
            />
          </Field>
          <Field label="Last name">
            <input
              required
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              className={inputCls}
            />
          </Field>
        </div>
        <Field label="Phone">
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="+44 7700 900000"
            className={inputCls}
          />
        </Field>
        <Field label="Email" hint="Contact Jay to change your email address.">
          <div className="relative">
            <input value={data.user.email} disabled className={`${inputCls} pr-10 opacity-60 cursor-not-allowed`} />
            <Lock className="h-4 w-4 absolute right-3 top-1/2 -translate-y-1/2 text-white/30" />
          </div>
        </Field>
      </Section>

      <Section title="Training">
        <Field label="My goal" hint="What you want to achieve. Jay will use this to plan your sessions.">
          <textarea
            rows={4}
            value={form.goals}
            onChange={(e) => setForm({ ...form, goals: e.target.value })}
            placeholder="e.g. Lose 10kg before September, build strength, run a half marathon…"
            className={`${inputCls} resize-y`}
          />
        </Field>
      </Section>

      <Section title="Emergency contact">
        <Field label="Name & phone" hint="Who should we contact in an emergency during your session?">
          <input
            value={form.emergencyContact}
            onChange={(e) => setForm({ ...form, emergencyContact: e.target.value })}
            placeholder="Jane Doe — 07000 000000"
            className={inputCls}
          />
        </Field>
      </Section>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={save.isPending}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#C8FF00] text-black font-semibold hover:bg-[#b8ee00] disabled:opacity-50"
        >
          {save.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save changes
        </button>
      </div>
    </form>
  );
}

const inputCls =
  "w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2.5 text-sm text-white placeholder-white/30 focus:border-[#C8FF00] focus:outline-none focus:ring-1 focus:ring-[#C8FF00]/30";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 md:p-6 space-y-4">
      <h3 className="font-display text-xl tracking-wide">{title.toUpperCase()}</h3>
      {children}
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-xs uppercase tracking-wider text-white/50 mb-1.5">{label}</div>
      {children}
      {hint && <div className="text-[11px] text-white/40 mt-1.5">{hint}</div>}
    </label>
  );
}
