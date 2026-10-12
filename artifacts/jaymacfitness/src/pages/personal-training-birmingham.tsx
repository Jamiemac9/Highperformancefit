import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { apiGet, apiPost } from "../lib/api";
import { ArrowRight, ChevronDown, Star, Phone, Mail, MapPin, Calendar, Clock, Dumbbell, ClipboardList, Activity, CheckCircle2, Award } from "lucide-react";
import amyTransformation from "@assets/amy_trasnformation_1777814405343.jpg";
import dannyJenTransformation from "@assets/dannyandjen_progress_pic_1777814405345.jpg";
import elaineTransformation from "@assets/elaine_transformation_1777814405346.jpg";

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
      if (data?.url) window.location.href = data.url;
      else alert("Sorry — could not start checkout.");
    } catch (err: any) { alert(err?.message || "Could not start checkout."); }
  }
  const highlights = pkg.highlights && pkg.highlights.length > 0 ? pkg.highlights : [`${pkg.sessions} x 60-minute sessions`, "Personalised training plan", "Nutrition guidance included"];
  const perSession = pkg.pricePerSession ?? (pkg.sessions > 0 ? Number(pkg.price) / pkg.sessions : null);
  return (
    <div className="relative h-full flex flex-col" style={{ background: featured ? "linear-gradient(160deg, #17140F 0%, #2C261C 100%)" : "#17140F", border: featured ? "2px solid #C9A45C" : "1px solid #2C261C", borderRadius: "4px", padding: "28px", boxShadow: featured ? "0 0 40px rgba(201,164,92,0.25), inset 0 0 0 1px rgba(201,164,92,0.15)" : "none" }}>
      {featured && <div className="absolute" style={{ top: "-14px", left: "50%", transform: "translateX(-50%)", background: "#C9A45C", color: "#1A1610", fontFamily: "'Barlow', sans-serif", fontWeight: 700, fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", padding: "6px 14px", borderRadius: "2px", boxShadow: "0 4px 16px rgba(201,164,92,0.45)", whiteSpace: "nowrap" }}>Most Popular</div>}
      <div className="flex items-start justify-between gap-3 mb-5">
        <h3 style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 700, fontSize: "20px", lineHeight: 1.25 }}>{pkg.name}</h3>
        <span className="flex-shrink-0 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider" style={{ background: "rgba(201,164,92,0.15)", border: "1px solid rgba(201,164,92,0.25)", color: "#C9A45C" }}>{pkg.type === "IN_PERSON" ? "In-Person" : pkg.type === "ONLINE" ? "Online" : "Group"}</span>
      </div>
      <div className="mb-4">
        <span className="headline text-4xl tracking-wide">{formatGbp(pkg.price)}</span>
        <span className="text-[#E6DFD2]/50 text-sm ml-2">{perSession ? `(${formatGbp(perSession)} per session)` : ""}</span>
      </div>
      <ul className="space-y-2 mb-6 flex-1">
        {highlights.map((h) => <li key={h} className="flex items-start gap-2 text-[#E6DFD2]/75 text-sm"><CheckCircle2 className="h-4 w-4 text-[#C9A45C] flex-shrink-0 mt-0.5" />{h}</li>)}
      </ul>
      {pkg.stripeLink ? (
        <button onClick={handleBuy} className="w-full bg-[#C9A45C] text-[#1A1610] font-bold uppercase tracking-wider py-3.5 rounded-full hover:bg-[#E3C88F] transition-all inline-flex items-center justify-center gap-2 text-sm">Get Started <ArrowRight className="h-4 w-4" /></button>
      ) : (
        <button onClick={() => navigate("/contact")} className="w-full border border-[#C9A45C]/40 text-[#C9A45C] font-bold uppercase tracking-wider py-3.5 rounded-full hover:bg-[#C9A45C]/10 transition-all inline-flex items-center justify-center gap-2 text-sm">Enquire Now <ArrowRight className="h-4 w-4" /></button>
      )}
    </div>
  );
}

const FAQS_PT = [
  { q: "How much does personal training cost in Birmingham?", a: "Fresh Start is £250 for five 1-2-1 sessions (£50 a session). 1-2-1 Monthly is £280 a month for eight sessions (£35 a session) on direct debit, with no contract and 14 days' notice to pause." },
  { q: "How many sessions per week do I need?", a: "Two a week is a good starting point for most people, and 1-2-1 Monthly is built around that. We'll settle the right rhythm for your life on the free chat." },
  { q: "What if I have an injury or medical condition?", a: "Rehab-aware programming is a big part of what I do, and I hold Level 4 qualifications in weight management through exercise and in obesity and diabetes. I adapt every exercise to you and I'm happy to work alongside your physio or GP." },
  { q: "How long until I see results?", a: "It depends on where you start and how consistent the training and food are. As a guide, Amy lost three stone in 14 weeks of 1-2-1 training. We'll set honest expectations on the free chat." },
  { q: "Can I train with a partner or friend?", a: "Yes. Danny and Jen trained together as a couple and lost six stone between them. Ask about partner sessions on the free chat." },
];

// Real clients only, with their own before/after photos.
const PROOF_PT = [
  { name: "Amy K.", result: "Lost 3 stone", detail: "14 weeks of 1-2-1 training", image: amyTransformation, swap: false },
  { name: "Danny & Jen", result: "6 stone between them", detail: "6 months of couples training", image: dannyJenTransformation, swap: false },
  { name: "Elaine T.", result: "Back stronger than before", detail: "Post-injury rehab and training", image: elaineTransformation, swap: true },
];

export default function PersonalTrainingBirmingham() {
  const { data: packages = [] } = useQuery<Pkg[]>({ queryKey: ["packages", "public"], queryFn: () => apiGet("/api/packages") as Promise<Pkg[]>, staleTime: 60_000 });
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  useEffect(() => { if (typeof window !== "undefined") window.scrollTo(0, 0); }, []);
  const inPersonPackages = packages.filter((p) => p.type === "IN_PERSON" || !p.type);

  return (
    <main className="min-h-screen bg-[#100E0C] text-white">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="pt-24 pb-0">
        <div className="container mx-auto px-4 md:px-6">
          <ol className="flex items-center gap-2 text-sm text-[#E6DFD2]/50">
            <li><a href="/" className="hover:text-[#C9A45C] transition-colors">Home</a></li>
            <li aria-hidden="true">/</li>
            <li><a href="/" className="hover:text-[#C9A45C] transition-colors">Services</a></li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-[#E6DFD2]/80">Personal Training Birmingham</li>
          </ol>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative overflow-hidden pt-8 pb-16 md:pt-12 md:pb-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl">
            <p className="text-[#C9A45C] font-bold uppercase tracking-[0.2em] text-sm mb-4">1-to-1 Personal Training</p>
            <h1 className="headline text-4xl md:text-6xl lg:text-7xl leading-none mb-6">Personal Training Birmingham — <span className="text-[#C9A45C]">1-to-1 Coaching That Works</span></h1>
            <p className="text-[#E6DFD2]/80 text-lg md:text-xl leading-relaxed max-w-2xl mb-6">
              High Performance Fit provides 1-to-1 personal training in Birmingham for people who want real results. Based at Foundry Gym in Kings Heath, Jay has 13 years of coaching experience and is Level 4 qualified. No contracts. Free first consultation.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="tel:+447753226214" className="bg-[#C9A45C] text-[#1A1610] font-bold uppercase tracking-wider px-8 py-4 rounded-full hover:bg-[#E3C88F] transition-all inline-flex items-center gap-2"><Phone className="h-4 w-4" /> Call Jay — 07753 226 214</a>
              <a href="/contact" className="border border-white/20 text-white font-bold uppercase tracking-wider px-8 py-4 rounded-full hover:bg-white/5 transition-all inline-flex items-center gap-2"><Mail className="h-4 w-4" /> Book Free Consultation</a>
            </div>
          </div>
        </div>
      </header>

      {/* Service Scope */}
      <section className="py-16 md:py-24 bg-[#0F0D0B] border-t border-white/5">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="text-[#C9A45C] font-bold uppercase tracking-[0.2em] text-sm mb-4">What's Included</p>
            <h2 className="headline text-3xl md:text-5xl leading-none">WHAT YOU GET WITH 1-TO-1 TRAINING</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { icon: Dumbbell, title: "Custom Training", desc: "Every session designed for your body, goals and current fitness level. No templates." },
              { icon: ClipboardList, title: "Nutrition Support", desc: "Guidance that fits your lifestyle, preferences and schedule — not a restrictive meal plan." },
              { icon: Activity, title: "Progress Tracking", desc: "Weekly measurements, progress photos and programme adjustments based on data." },
              { icon: Calendar, title: "Flexible Schedule", desc: "Early mornings (06:00), evenings (21:00), weekends — we find times that work." },
            ].map((item) => (
              <article key={item.title} className="bg-[#17140F] border border-[#2C261C] rounded p-6">
                <item.icon className="h-8 w-8 text-[#C9A45C] mb-4" />
                <h3 className="font-bold text-lg mb-2" style={{ fontFamily: "'Barlow', sans-serif" }}>{item.title}</h3>
                <p className="text-[#E6DFD2]/60 text-sm leading-relaxed">{item.desc}</p>
              </article>
            ))}
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-8">
            <div className="bg-white/[0.02] border border-white/10 rounded p-5 text-center">
              <Clock className="h-6 w-6 text-[#C9A45C] mx-auto mb-2" />
              <p className="font-bold">60-minute sessions</p>
              <p className="text-[#E6DFD2]/50 text-sm">Full hour, no rushing</p>
            </div>
            <div className="bg-white/[0.02] border border-white/10 rounded p-5 text-center">
              <MapPin className="h-6 w-6 text-[#C9A45C] mx-auto mb-2" />
              <p className="font-bold">Foundry Gym, Kings Heath</p>
              <p className="text-[#E6DFD2]/50 text-sm">Fully equipped gym</p>
            </div>
            <div className="bg-white/[0.02] border border-white/10 rounded p-5 text-center">
              <Award className="h-6 w-6 text-[#C9A45C] mx-auto mb-2" />
              <p className="font-bold">From £35/session</p>
              <p className="text-[#E6DFD2]/50 text-sm">On 1-2-1 Monthly</p>
            </div>
          </div>
        </div>
      </section>

      {/* Proof: Client Results */}
      <section className="py-16 md:py-24 bg-[#100E0C] border-t border-white/5">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="text-[#C9A45C] font-bold uppercase tracking-[0.2em] text-sm mb-4">Proof</p>
            <h2 className="headline text-3xl md:text-5xl leading-none">REAL CLIENT RESULTS</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {PROOF_PT.map((client, i) => (
              <article key={client.name} className="bg-[#17140F] border border-[#2C261C] rounded-xl overflow-hidden">
                <div className="aspect-[4/3] bg-white/5">
                  <img src={client.image} alt={`${client.name} transformation`} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="p-5">
                  <p className="headline text-xl mb-1">{client.result}</p>
                  <p className="text-[#E6DFD2]/60 text-sm">{client.name} — {client.detail}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 md:py-24 bg-[#0F0D0B] border-t border-white/5">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="text-[#C9A45C] font-bold uppercase tracking-[0.2em] text-sm mb-4">Comparison</p>
            <h2 className="headline text-3xl md:text-5xl leading-none">1-TO-1 PT VS. GYM MEMBERSHIP VS. FITNESS APPS</h2>
          </div>
          <div className="max-w-4xl mx-auto overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 font-bold">Feature</th>
                  <th className="text-left py-3 px-4 font-bold text-[#C9A45C]">1-to-1 PT</th>
                  <th className="text-left py-3 px-4 font-bold text-[#E6DFD2]/60">Gym Membership</th>
                  <th className="text-left py-3 px-4 font-bold text-[#E6DFD2]/60">Fitness Apps</th>
                </tr>
              </thead>
              <tbody className="text-[#E6DFD2]/80">
                <tr className="border-b border-white/5">
                  <td className="py-3 px-4">Personalised programme</td>
                  <td className="py-3 px-4 text-[#C9A45C]">✓ Built for you</td>
                  <td className="py-3 px-4">✗ Self-directed</td>
                  <td className="py-3 px-4">✗ Generic template</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3 px-4">Form correction</td>
                  <td className="py-3 px-4 text-[#C9A45C]">✓ Real-time</td>
                  <td className="py-3 px-4">✗ None</td>
                  <td className="py-3 px-4">✗ Video only</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3 px-4">Accountability</td>
                  <td className="py-3 px-4 text-[#C9A45C]">✓ Appointment-based</td>
                  <td className="py-3 px-4">✗ None</td>
                  <td className="py-3 px-4">✗ Push notifications</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3 px-4">Nutrition guidance</td>
                  <td className="py-3 px-4 text-[#C9A45C]">✓ Included</td>
                  <td className="py-3 px-4">✗ Extra cost</td>
                  <td className="py-3 px-4">✓ Basic</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3 px-4">Cost per month</td>
                  <td className="py-3 px-4 text-[#C9A45C]">£280 (1-2-1 Monthly, 8 sessions)</td>
                  <td className="py-3 px-4">Varies by gym</td>
                  <td className="py-3 px-4">Free to low monthly fee</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-center text-[#E6DFD2]/50 text-sm mt-6">Honest comparison. PT costs more but delivers results faster because every session is purposeful and you're held accountable.</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24 bg-[#100E0C] border-t border-white/5">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#C9A45C] font-bold uppercase tracking-[0.2em] text-sm mb-4">FAQ</p>
            <h2 className="headline text-3xl md:text-5xl leading-none">QUESTIONS ABOUT 1-TO-1 TRAINING</h2>
          </div>
          <div className="space-y-3">
            {FAQS_PT.map((f, i) => {
              const isOpen = openFaq === i;
              return (
                <article key={f.q} className={`border rounded-xl overflow-hidden bg-white/[0.02] transition-colors ${isOpen ? "border-[#C9A45C]/40" : "border-white/10"}`}>
                  <button onClick={() => setOpenFaq(isOpen ? null : i)} className="w-full flex items-center justify-between gap-4 p-5 md:p-6 text-left hover:bg-white/[0.03] transition-colors" aria-expanded={isOpen}>
                    <span className="font-bold text-base md:text-lg">{f.q}</span>
                    <ChevronDown className={`h-5 w-5 text-[#C9A45C] flex-shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  <div className={`grid transition-all duration-300 ease-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                    <div className="overflow-hidden"><p className="px-5 md:px-6 pb-5 md:pb-6 text-[#E6DFD2]/75 leading-relaxed">{f.a}</p></div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-[#0F0D0B] border-t border-white/5">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-3xl">
          <h2 className="headline text-3xl md:text-5xl leading-none mb-6">READY TO <span className="text-[#C9A45C]">START?</span></h2>
          <p className="text-[#E6DFD2]/75 text-lg leading-relaxed mb-8">
            Book your free 20-minute consultation. No pressure, no commitment — just a conversation about where you are and where you want to be.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="tel:+447753226214" className="bg-[#C9A45C] text-[#1A1610] font-bold uppercase tracking-wider px-8 py-4 rounded-full hover:bg-[#E3C88F] transition-all inline-flex items-center gap-2"><Phone className="h-4 w-4" /> Call 07753 226 214</a>
            <a href="/contact" className="border border-white/20 text-white font-bold uppercase tracking-wider px-8 py-4 rounded-full hover:bg-white/5 transition-all inline-flex items-center gap-2"><ArrowRight className="h-4 w-4" /> Book Free Consultation</a>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-[#E6DFD2]/50">
            <span>Also available: <a href="/online-coaching" className="text-[#C9A45C] hover:underline">Online Coaching</a></span>
            <span><a href="/group-training" className="text-[#C9A45C] hover:underline">Group Training</a></span>
            <span><a href="/outdoor-training" className="text-[#C9A45C] hover:underline">Outdoor Training</a></span>
          </div>
        </div>
      </section>
    </main>
  );
}
