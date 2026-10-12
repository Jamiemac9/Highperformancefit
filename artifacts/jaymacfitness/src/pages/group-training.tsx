import { useEffect, useState } from "react";
import { Phone, Mail, ArrowRight, Users, Flame, Clock, MapPin, Dumbbell, Target, ChevronDown, Star } from "lucide-react";

const FAQS_GROUP = [
  { q: "How many people are in a group training session?", a: "A maximum of four. Small enough that I can coach everyone's form properly, big enough that people notice when you don't turn up." },
  { q: "Do I need to be at the same fitness level as everyone else?", a: "No. Sessions are tailored to mixed abilities, and every exercise has easier and harder versions so everyone works at the right level." },
  { q: "How much does group training cost?", a: "A Small Group Block is £200 for eight sessions, which works out at £25 a session. 1-2-1 sessions start from £35." },
  { q: "When do group sessions run?", a: "Sessions are programmed weekly. Ask on the free chat for the current times and whether there's space." },
  { q: "What about bootcamps?", a: "Small-group bootcamps at Marvel The Studio are coming soon. Join the founding list on the homepage for first pick of spaces." },
];

// Real Google reviews. Never add invented group results here.
const PROOF_GROUP = [
  { name: "876 Collective", result: "“Forceful when needed but supportive.”", detail: "Google review" },
  { name: "Muhamed Alhariri", result: "“Good atmosphere, no pressure, and the support is spot on.”", detail: "Google review" },
  { name: "Jack Deen", result: "“Highly recommend.”", detail: "Google review" },
];

export default function GroupTraining() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  useEffect(() => { if (typeof window !== "undefined") window.scrollTo(0, 0); }, []);

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
            <li aria-current="page" className="text-[#E6DFD2]/80">Group Training</li>
          </ol>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative overflow-hidden pt-8 pb-16 md:pt-12 md:pb-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl">
            <p className="text-[#C9A45C] font-bold uppercase tracking-[0.2em] text-sm mb-4">Small Group Training</p>
            <h1 className="headline text-4xl md:text-6xl lg:text-7xl leading-none mb-6">Small Group Personal Training Birmingham — <span className="text-[#C9A45C]">Accountability &amp; Energy</span></h1>
            <p className="text-[#E6DFD2]/80 text-lg md:text-xl leading-relaxed max-w-2xl mb-6">
              Train in a small group of up to four people with PT-level programming and people who notice when you don't show up. Based at Foundry Gym in Kings Heath, Birmingham. £25 a session in a block of eight.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="tel:+447753226214" className="bg-[#C9A45C] text-[#1A1610] font-bold uppercase tracking-wider px-8 py-4 rounded-full hover:bg-[#E3C88F] transition-all inline-flex items-center gap-2"><Phone className="h-4 w-4" /> Call Jay — 07753 226 214</a>
              <a href="/contact" className="border border-white/20 text-white font-bold uppercase tracking-wider px-8 py-4 rounded-full hover:bg-white/5 transition-all inline-flex items-center gap-2"><Mail className="h-4 w-4" /> Book a free chat</a>
            </div>
          </div>
        </div>
      </header>

      {/* Service Scope */}
      <section className="py-16 md:py-24 bg-[#0F0D0B] border-t border-white/5">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="text-[#C9A45C] font-bold uppercase tracking-[0.2em] text-sm mb-4">What's Included</p>
            <h2 className="headline text-3xl md:text-5xl leading-none">WHAT YOU GET WITH GROUP TRAINING</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { icon: Users, title: "Small Groups", desc: "Maximum four people. Small enough for proper coaching, big enough for real energy." },
              { icon: Flame, title: "Team Energy", desc: "The competitive spark of a group pushes everyone further than they'd go alone." },
              { icon: Dumbbell, title: "Structured Sessions", desc: "Every session is programmed by Jay — progressive strength and conditioning, no random classes." },
            ].map((item) => (
              <article key={item.title} className="bg-[#17140F] border border-[#2C261C] rounded p-8">
                <item.icon className="h-10 w-10 text-[#C9A45C] mb-4" />
                <h3 className="font-bold text-xl mb-3" style={{ fontFamily: "'Barlow', sans-serif" }}>{item.title}</h3>
                <p className="text-[#E6DFD2]/60 leading-relaxed">{item.desc}</p>
              </article>
            ))}
          </div>
          <div className="grid md:grid-cols-4 gap-4 max-w-5xl mx-auto mt-8">
            <div className="bg-white/[0.02] border border-white/10 rounded p-5 text-center">
              <Users className="h-6 w-6 text-[#C9A45C] mx-auto mb-2" />
              <p className="font-bold">Max 4 people</p>
              <p className="text-[#E6DFD2]/50 text-sm">Mixed abilities</p>
            </div>
            <div className="bg-white/[0.02] border border-white/10 rounded p-5 text-center">
              <Clock className="h-6 w-6 text-[#C9A45C] mx-auto mb-2" />
              <p className="font-bold">60 minutes</p>
              <p className="text-[#E6DFD2]/50 text-sm">Warm-up, work, cool-down</p>
            </div>
            <div className="bg-white/[0.02] border border-white/10 rounded p-5 text-center">
              <MapPin className="h-6 w-6 text-[#C9A45C] mx-auto mb-2" />
              <p className="font-bold">Foundry Gym</p>
              <p className="text-[#E6DFD2]/50 text-sm">Kings Heath, Birmingham</p>
            </div>
            <div className="bg-white/[0.02] border border-white/10 rounded p-5 text-center">
              <Target className="h-6 w-6 text-[#C9A45C] mx-auto mb-2" />
              <p className="font-bold">£25/session</p>
              <p className="text-[#E6DFD2]/50 text-sm">In a block of 8</p>
            </div>
          </div>
          <div className="max-w-4xl mx-auto mt-8 bg-[#17140F] border border-[#2C261C] rounded-2xl p-6 md:p-8">
            <h3 className="font-bold text-xl mb-4">Group training prices</h3>
            <div className="space-y-3">
              {[
                { name: "Small Group Block", price: "£200", freq: "8 sessions · £25 a session · max 4 people", unit: "one-off", best: true },
                { name: "Marvel Bootcamp", price: "£50", freq: "Coming soon · founding rate", unit: "per month", best: false },
              ].map((p) => (
                <div key={p.name} className={`flex items-center justify-between p-4 rounded ${p.best ? "bg-[#C9A45C]/10 border border-[#C9A45C]/30" : "bg-white/[0.02] border border-white/10"}`}>
                  <div><p className="font-bold">{p.name}</p><p className="text-[#E6DFD2]/60 text-sm">{p.freq}</p></div>
                  <div className="text-right"><p className="headline text-2xl">{p.price}</p><p className="text-[#E6DFD2]/50 text-xs">{p.unit}</p></div>
                </div>
              ))}
            </div>
            <p className="text-[#E6DFD2]/50 text-xs mt-3">Tailored to mixed abilities, programmed weekly. Start with a free 30-minute chat.</p>
          </div>
        </div>
      </section>

      {/* Proof */}
      <section className="py-16 md:py-24 bg-[#100E0C] border-t border-white/5">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="text-[#C9A45C] font-bold uppercase tracking-[0.2em] text-sm mb-4">Proof</p>
            <h2 className="headline text-3xl md:text-5xl leading-none">What clients say on Google</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {PROOF_GROUP.map((g) => (
              <article key={g.name} className="bg-[#17140F] border border-[#2C261C] rounded-xl p-6">
                <div className="flex items-center gap-1 mb-3">
                  {[1,2,3,4,5].map((s) => <Star key={s} className="h-4 w-4 text-[#C9A45C] fill-[#C9A45C]" />)}
                </div>
                <p className="headline text-xl mb-2">{g.result}</p>
                <p className="text-[#E6DFD2]/60 text-sm">{g.name} — {g.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24 bg-[#0F0D0B] border-t border-white/5">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#C9A45C] font-bold uppercase tracking-[0.2em] text-sm mb-4">FAQ</p>
            <h2 className="headline text-3xl md:text-5xl leading-none">QUESTIONS ABOUT GROUP TRAINING</h2>
          </div>
          <div className="space-y-3">
            {FAQS_GROUP.map((f, i) => {
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
      <section className="py-16 md:py-24 bg-[#100E0C] border-t border-white/5">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-3xl">
          <h2 className="headline text-3xl md:text-5xl leading-none mb-6">JOIN A <span className="text-[#C9A45C]">GROUP</span></h2>
          <p className="text-[#E6DFD2]/75 text-lg leading-relaxed mb-8">
            Book your free trial session. Train with the group, meet the coach, and see if it's the right fit — no commitment required.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="tel:+447753226214" className="bg-[#C9A45C] text-[#1A1610] font-bold uppercase tracking-wider px-8 py-4 rounded-full hover:bg-[#E3C88F] transition-all inline-flex items-center gap-2"><Phone className="h-4 w-4" /> Call 07753 226 214</a>
            <a href="/contact" className="border border-white/20 text-white font-bold uppercase tracking-wider px-8 py-4 rounded-full hover:bg-white/5 transition-all inline-flex items-center gap-2"><ArrowRight className="h-4 w-4" /> Book Free Trial Session</a>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-[#E6DFD2]/50">
            <span>Also available: <a href="/personal-training-birmingham" className="text-[#C9A45C] hover:underline">1-to-1 Birmingham</a></span>
            <span><a href="/online-coaching" className="text-[#C9A45C] hover:underline">Online Coaching</a></span>
            <span><a href="/outdoor-training" className="text-[#C9A45C] hover:underline">Outdoor Training</a></span>
          </div>
        </div>
      </section>
    </main>
  );
}
