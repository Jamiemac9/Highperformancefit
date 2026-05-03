import { useQuery, useMutation } from "@tanstack/react-query";
import { apiGet, apiPost } from "../lib/api";
import { Loader2, Check, ShoppingCart, AlertCircle } from "lucide-react";
import { useState } from "react";

interface Pkg {
  id: string;
  name: string;
  sessions: number;
  price: string;
  description: string | null;
}

export default function PortalPackages() {
  const [confirm, setConfirm] = useState<Pkg | null>(null);

  const { data, isLoading } = useQuery<Pkg[]>({
    queryKey: ["packages"],
    queryFn: () => apiGet("/api/packages"),
  });

  // Kicks off a real Stripe Checkout session and redirects the browser to it.
  const purchase = useMutation({
    mutationFn: async (packageId: string) => {
      const resp = await apiPost("/api/checkout/create-session", { packageId });
      if (!resp?.url) throw new Error("Could not start checkout. Please try again.");
      return resp.url as string;
    },
    onSuccess: (url) => {
      window.location.href = url;
    },
  });

  return (
    <div className="space-y-6">
      <p className="text-white/60 max-w-2xl">
        Choose a package that fits your training schedule. All sessions are 1-on-1 with Jay.
      </p>

      {purchase.isError && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300 flex items-start gap-2">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          <span>{(purchase.error as Error)?.message || "Could not start checkout."}</span>
        </div>
      )}

      {isLoading ? (
        <div className="py-16 flex items-center justify-center text-white/50">
          <Loader2 className="h-6 w-6 animate-spin mr-2" /> Loading packages…
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {(data ?? []).map((pkg, i) => {
            const isFeatured = i === 1; // middle pkg highlighted
            return (
              <div
                key={pkg.id}
                className={`rounded-2xl p-6 flex flex-col ${
                  isFeatured
                    ? "bg-[#C8FF00] text-black border-2 border-[#C8FF00] lg:scale-105 shadow-[0_0_40px_rgba(200,255,0,0.2)]"
                    : "bg-white/[0.02] border border-white/10 text-white"
                }`}
              >
                {isFeatured && (
                  <div className="text-[10px] uppercase tracking-wider font-bold mb-2">Most popular</div>
                )}
                <h3 className="font-display text-2xl tracking-wide">{pkg.name.toUpperCase()}</h3>
                {pkg.description && (
                  <p className={`text-sm mt-2 ${isFeatured ? "text-black/70" : "text-white/60"}`}>{pkg.description}</p>
                )}
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="font-display text-5xl">£{Number(pkg.price).toFixed(0)}</span>
                </div>
                <div className={`text-xs mt-1 ${isFeatured ? "text-black/60" : "text-white/40"}`}>
                  £{(Number(pkg.price) / pkg.sessions).toFixed(2)} per session
                </div>

                <ul className="mt-5 space-y-2 text-sm flex-1">
                  <Feature featured={isFeatured}>{pkg.sessions} 1-on-1 sessions</Feature>
                  <Feature featured={isFeatured}>Personalised programming</Feature>
                  <Feature featured={isFeatured}>Form coaching &amp; check-ins</Feature>
                </ul>

                <button
                  onClick={() => setConfirm(pkg)}
                  disabled={purchase.isPending}
                  className={`mt-6 w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold text-sm transition-colors disabled:opacity-50 ${
                    isFeatured
                      ? "bg-black text-[#C8FF00] hover:bg-black/80"
                      : "bg-[#C8FF00] text-black hover:bg-[#b8ee00]"
                  }`}
                >
                  <ShoppingCart className="h-4 w-4" /> Purchase
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirm modal */}
      {confirm && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => !purchase.isPending && setConfirm(null)}
        >
          <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display text-2xl tracking-wide">CONFIRM PURCHASE</h3>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-white/60">Package</span>
                <span className="text-white font-medium">{confirm.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Sessions</span>
                <span className="text-white font-medium">{confirm.sessions}</span>
              </div>
              <div className="flex justify-between border-t border-white/10 pt-2 mt-2">
                <span className="text-white/60">Total</span>
                <span className="text-[#C8FF00] font-display text-xl">£{Number(confirm.price).toFixed(0)}</span>
              </div>
            </div>
            <div className="mt-4 text-[11px] text-white/40 italic">
              You'll be redirected to Stripe's secure checkout to complete payment.
            </div>
            <div className="mt-6 flex gap-2">
              <button
                onClick={() => setConfirm(null)}
                disabled={purchase.isPending}
                className="flex-1 px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => purchase.mutate(confirm.id)}
                disabled={purchase.isPending}
                className="flex-1 px-4 py-2.5 rounded-lg bg-[#C8FF00] hover:bg-[#b8ee00] text-black text-sm font-semibold disabled:opacity-50 inline-flex items-center justify-center gap-2"
              >
                {purchase.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                {purchase.isPending ? "Redirecting…" : "Pay with Stripe"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Feature({ children, featured }: { children: React.ReactNode; featured: boolean }) {
  return (
    <li className="flex items-start gap-2">
      <Check className={`h-4 w-4 mt-0.5 shrink-0 ${featured ? "text-black" : "text-[#C8FF00]"}`} />
      <span>{children}</span>
    </li>
  );
}
