import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { apiGet, apiPost } from "../lib/api";
import { ArrowRight, Star, Phone, Mail, MapPin, Calendar, Clock, Dumbbell, ClipboardList, Activity, CheckCircle2 } from "lucide-react";
import amyTransformation from "@assets/amy_trasnformation_1777814405343.jpg";

type Pkg = {
  id: string;
  name: string;
  type?: "IN_PERSON" | "ONLINE" | "GROUP";
  sessions: number;
  price: string;
  pricePerSession?: string | null;
  description?: string;
  highlights?: string[];
  featured?: boolean;
  stripeLink?: string | null;
};

function formatGbp(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === "") return "—";
  const n = Number(value);
  if (!Number.isFinite(n)) return "—";
  return Number.isInteger(n) ? `£${n}` : `£${n.toFixed(2)}`;
}

function PackageCard({ pkg, index }: { pkg: Pkg; index: number }) {
  const featured = !!pkg.featured;
  const navigate = useNavigate();

  async function handleBuy() {
    try {
      const data = await apiPost("/api/checkout/create-session", { packageId: pkg.id });
      if (data?.url) {
        window.location.href = data.url;
      } else {
        alert("Sorry — could not start checkout. Please try again.");
      }
    } catch (err: any) {
      alert(err?.message || "Could not start checkout.");
    }
  }

  const highlights =
    pkg.highlights && pkg.highlights.length > 0
      ? pkg.highlights
      : [`${pkg.sessions} x 60-minute sessions`, "Personalised training plan", "Nutrition guidance included"];
  const perSession = pkg.pricePerSession ?? (pkg.sessions > 0 ? Number(pkg.price) / pkg.sessions : null);

  return (
    <div
      className="relative h-full flex flex-col"
      style={{
        background: featured ? "linear-gradient(160deg, #112240 0%, #1A3A5C 100%)" : "#112240",
        border: featured ? "2px solid #1E90FF" : "1px solid #1A3A5C",
        borderRadius: "4px",
        padding: "28px",
        boxShadow: featured ? "0 0 40px rgba(30,144,255,0.25), inset 0 0 0 1px rgba(30,144,255,0.15)" : "none",
      }}
    >
      {featured && (
        <div
          className="absolute"
          style={{
            top: "-14px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#1E90FF",
            color: "#fff",
            fontFamily: "'Barlow', sans-serif",
            fontWeight: 700,
            fontSize: "11px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            padding: "6px 14px",
            borderRadius: "2px",
            boxShadow: "0 4px 16px rgba(30,144,255,0.45)",
            whiteSpace: "nowrap",
          }}
        >
          Most Popular
        </div>
      )}
      <div className="flex items-start justify-between gap-3 mb-5">
        <h3 style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 700, fontSize: "20px", lineHeight: 1.25 }}>
          {pkg.name}
        </h3>
        <span
          className="flex-shrink-0 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider"
          style={{ background: "rgba(30,144,255,0.15)", border: "1px solid rgba(30,144,255,0.25)", color: "#1E90FF" }}
        >
          {pkg.type === "IN_PERSON" ? "In-Person" : pkg.type === "ONLINE" ? "Online" : "Group"}
        </span>
      </div>
      <div className="mb-4">
        <span className="headline text-4xl tracking-wide">{formatGbp(pkg.price)}</span>
        <span className="text-[#C8D8E8]/50 text-sm ml-2">
          {perSession ? `(${formatGbp(perSession)} per session)` : ""}
        </span>
      </div>
      <ul className="space-y-2 mb-6 flex-1">
        {highlights.map((h) => (
          <li key={h} className="flex items-start gap-2 text-[#C8D8E8]/75 text-sm">
            <CheckCircle2 className="h-4 w-4 text-[#1E90FF] flex-shrink-0 mt-0.5" />
            {h}
          </li>
        ))}
      </ul>
      {pkg.stripeLink ? (
        <button
          onClick={handleBuy}
          className="w-full bg-[#1E90FF] text-white font-bold uppercase tracking-wider py-3.5 rounded-full hover:bg-[#4DAAFF] hover:shadow-[0_8px_32px_rgba(30,144,255,0.35)] transition-all inline-flex items-center justify-center gap-2 text-sm"
        >
          Get Started <ArrowRight className="h-4 w-4" />
        </button>
      ) : (
        <button
          onClick={() => navigate("/?scrollTo=contact")}
          className="w-full border border-[#1E90FF]/40 text-[#1E90FF] font-bold uppercase tracking-wider py-3.5 rounded-full hover:bg-[#1E90FF]/10 transition-all inline-flex items-center justify-center gap-2 text-sm"
        >
          Enquire Now <ArrowRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

export default function PersonalTrainingBirmingham() {
  const { data: packages = [] } = useQuery<Pkg[]>({
    queryKey: ["packages", "public"],
    queryFn: () => apiGet("/api/packages") as Promise<Pkg[]>,
    staleTime: 60_000,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.scrollTo(0, 0);
  }, []);

  const inPersonPackages = packages.filter((p) => p.type === "IN_PERSON" || !p.type);

  return (
    <main className="min-h-screen bg-[#0A1628] text-white">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[#0A1628]" />
        <div className="container mx-auto px-4 md:px-6 relative pt-32 pb-20 md:pt-40 md:pb-28">
          <div className="max-w-3xl">
            <p className="text-[#1E90FF] font-bold uppercase tracking-[0.2em] text-sm mb-4">1-2-1 Personal Training</p>
            <h1 className="headline text-5xl md:text-7xl leading-none mb-6">PERSONAL TRAINING<br />IN <span className="text-[#1E90FF]">BIRMINGHAM</span></h1>
            <p className="text-[#C8D8E8]/75 text-lg md:text-xl leading-relaxed max-w-xl mb-8">
              One-to-one sessions at Foundry Gym, Kings Heath. No templates. Every programme is built around your body, your goals and your schedule. Train with a coach who actually cares about your results.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="tel:+447753226214" className="bg-[#1E90FF] text-white font-bold uppercase tracking-wider px-8 py-4 rounded-full hover:bg-[#4DAAFF] hover:shadow-[0_8px_32px_rgba(30,144,255,0.35)] transition-all inline-flex items-center gap-2">
                <Phone className="h-4 w-4" /> Call Jay
              </a>
              <a href="/?scrollTo=contact" className="border border-white/20 text-white font-bold uppercase tracking-wider px-8 py-4 rounded-full hover:bg-white/5 transition-all inline-flex items-center gap-2">
                <Mail className="h-4 w-4" /> Send Enquiry
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* What to expect */}
      <section className="py-20 md:py-28 bg-[#0D1B2A] border-t border-white/5">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-[#1E90FF] font-bold uppercase tracking-[0.2em] text-sm mb-4">The Experience</p>
            <h2 className="headline text-4xl md:text-6xl leading-none">WHAT YOU GET</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { icon: Dumbbell, title: "Custom Training", desc: "Every session designed for your body, not a template." },
              { icon: ClipboardList, title: "Nutrition Support", desc: "Guidance that fits your lifestyle and preferences." },
              { icon: Activity, title: "Progress Tracking", desc: "Weekly measurements, photos and adjustments." },
              { icon: Calendar, title: "Flexible Schedule", desc: "Early mornings, evenings, weekends — we find a time that works." },
            ].map((item) => (
              <div key={item.title} className="bg-[#112240] border border-[#1A3A5C] rounded p-6">
                <item.icon className="h-8 w-8 text-[#1E90FF] mb-4" />
                <h3 className="font-bold text-lg mb-2" style={{ fontFamily: "'Barlow', sans-serif" }}>{item.title}</h3>
                <p className="text-[#C8D8E8]/60 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="py-20 md:py-28 bg-[#0A1628] border-t border-white/5">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div>
              <p className="text-[#1E90FF] font-bold uppercase tracking-[0.2em] text-sm mb-4">Location</p>
              <h2 className="headline text-4xl md:text-5xl leading-none mb-6">FOUNDRY GYM,<br />KINGS HEATH</h2>
              <p className="text-[#C8D8E8]/75 text-lg leading-relaxed mb-6">
                A fully equipped, community-focused gym in the heart of Kings Heath. Free parking, great kit, and a serious training atmosphere without the ego.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-[#C8D8E8]/70">
                  <MapPin className="h-5 w-5 text-[#1E90FF]" />
                  <span>Foundry Gym, Kings Heath, Birmingham B14 7JZ</span>
                </div>
                <div className="flex items-center gap-3 text-[#C8D8E8]/70">
                  <Clock className="h-5 w-5 text-[#1E90FF]" />
                  <span>Mon–Fri 06:00–21:00, Sat 08:00–18:00, Sun 09:00–16:00</span>
                </div>
                <div className="flex items-center gap-3 text-[#C8D8E8]/70">
                  <Star className="h-5 w-5 text-[#1E90FF]" />
                  <span>Free on-site parking available</span>
                </div>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden border border-white/10 aspect-video bg-white/5">
              <iframe
                title="Foundry Gym Kings Heath"
                src="https://www.google.com/maps?q=Foundry+Gym+Kings+Heath+Birmingham&output=embed"
                className="w-full h-full grayscale contrast-125"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="py-20 md:py-28 bg-[#0D1B2A] border-t border-white/5">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="text-[#1E90FF] font-bold uppercase tracking-[0.2em] text-sm mb-4">Pricing</p>
            <h2 className="headline text-4xl md:text-6xl leading-none mb-4">TRAINING PACKAGES</h2>
            <p className="text-[#C8D8E8]/70">Choose the package that fits your goals. All include a free consultation to start.</p>
          </div>
          {inPersonPackages.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {inPersonPackages.map((pkg, i) => (
                <PackageCard key={pkg.id} pkg={pkg} index={i} />
              ))}
            </div>
          ) : (
            <div className="text-center text-[#C8D8E8]/60 py-12">Packages loading...</div>
          )}
          <div className="text-center mt-10">
            <p className="text-[#C8D8E8]/60 text-sm">Payment plans available. Book a free consultation to discuss options.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 bg-[#0A1628] border-t border-white/5">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-3xl">
          <h2 className="headline text-4xl md:text-5xl leading-none mb-6">READY TO <span className="text-[#1E90FF]">START?</span></h2>
          <p className="text-[#C8D8E8]/75 text-lg leading-relaxed mb-8">
            Book your free 20-minute consultation. No pressure, no commitment — just a conversation about where you are and where you want to be.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="tel:+447753226214" className="bg-[#1E90FF] text-white font-bold uppercase tracking-wider px-8 py-4 rounded-full hover:bg-[#4DAAFF] transition-all inline-flex items-center gap-2">
              <Phone className="h-4 w-4" /> Call 07753 226 214
            </a>
            <a href="/?scrollTo=contact" className="border border-white/20 text-white font-bold uppercase tracking-wider px-8 py-4 rounded-full hover:bg-white/5 transition-all inline-flex items-center gap-2">
              <ArrowRight className="h-4 w-4" /> Send Enquiry
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
