import { useEffect, useState } from "react";
import { Phone, Mail, ArrowRight, Users, Flame, Clock, MapPin, Dumbbell, Target, ChevronDown, Star } from "lucide-react";

const FAQS_GROUP = [
  { q: "How many people are in a group training session?", a: "Groups are capped at 4–6 people. This is small enough that I can still correct form and give individual attention, but large enough to create real energy and accountability." },
  { q: "Do I need to be at the same fitness level as everyone else?", a: "No. I match people by general fitness level and goals, but every exercise has progressions and regressions. A beginner and an intermediate can train side by side doing the same session at different intensities." },
  { q: "How much does group training cost compared to 1-to-1?", a: "Group sessions are roughly 40–50% cheaper per person than 1-to-1. A block of 8 group sessions is £189/month (£23.60/session) compared to £45/session for 1-to-1." },
  { q: "What times are group sessions available?", a: "Current groups: Tuesday & Thursday 18:30, Saturday 09:00. Morning groups (06:30) forming for early risers. New groups start when 4 people sign up." },
  { q: "Can I try a session before committing?", a: "Yes — your first group session is free. Come along, meet the group, see how the sessions run and decide if it's the right fit. No pressure to sign up." },
  { q: "What if I miss a session?", a: "Life happens. If you miss a session, you can join another group running the same week (subject to space). Or you can swap it for a 30-minute 1-to-1 catch-up session at a discounted rate." },
];

const PROOF_GROUP = [
  { name: "The Tuesday Group", result: "Average 8kg loss in 12 weeks", detail: "4 women, mixed ages 28–45. Combined PT sessions with a private WhatsApp group for accountability." },
  { name: "The Saturday Morning Crew", result: "3 members ran first 5K", detail: "6 people, mostly beginners. 3-month block focused on building baseline fitness and confidence." },
  { name: "Corporate Group, Birmingham", result: "Team energy transformed", detail: "5 office workers training together. Reported better focus at work and stronger team bonds." },
];

export default function GroupTraining() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  useEffect(() => { if (typeof window !== "undefined") window.scrollTo(0, 0); }, []);

  return (
    <main className="min-h-screen bg-[#0A1628] text-white">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="pt-24 pb-0">
        <div className="container mx-auto px-4 md:px-6">
          <ol className="flex items-center gap-2 text-sm text-[#C8D8E8]/50">
            <li><a href="/" className="hover:text-[#1E90FF] transition-colors">Home</a></li>
            <li aria-hidden="true">/</li>
            <li><a href="/" className="hover:text-[#1E90FF] transition-colors">Services</a></li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-[#C8D8E8]/80">Group Training</li>
          </ol>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative overflow-hidden pt-8 pb-16 md:pt-12 md:pb-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl">
            <p className="text-[#1E90FF] font-bold uppercase tracking-[0.2em] text-sm mb-4">Small Group Training</p>
            <h1 className="headline text-4xl md:text-6xl lg:text-7xl leading-none mb-6">Small Group Personal Training Birmingham — <span className="text-[#1E90FF]">Accountability &amp; Energy</span></h1>
            <p className="text-[#C8D8E8]/80 text-lg md:text-xl leading-relaxed max-w-2xl mb-6">
              Train in a small group of 4–6 people with the intensity of 1-to-1 coaching and the motivation of a team. Based at Foundry Gym in Kings Heath, Birmingham. More affordable than private sessions. Free first session.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="tel:+447753226214" className="bg-[#1E90FF] text-white font-bold uppercase tracking-wider px-8 py-4 rounded-full hover:bg-[#4DAAFF] transition-all inline-flex items-center gap-2"><Phone className="h-4 w-4" /> Call Jay — 07753 226 214</a>
              <a href="/contact" className="border border-white/20 text-white font-bold uppercase tracking-wider px-8 py-4 rounded-full hover:bg-white/5 transition-all inline-flex items-center gap-2"><Mail className="h-4 w-4" /> Book Free Trial Session</a>
            </div>
          </div>
        </div>
      </header>

      {/* Service Scope */}
      <section className="py-16 md:py-24 bg-[#0D1B2A] border-t border-white/5">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="text-[#1E90FF] font-bold uppercase tracking-[0.2em] text-sm mb-4">What's Included</p>
            <h2 className="headline text-3xl md:text-5xl leading-none">WHAT YOU GET WITH GROUP TRAINING</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { icon: Users, title: "Small Groups", desc: "4–6 people per group. Small enough for individual attention, big enough for real energy." },
              { icon: Flame, title: "Team Energy", desc: "The competitive spark of a group pushes everyone further than they'd go alone." },
              { icon: Dumbbell, title: "Structured Sessions", desc: "Every session is programmed by Jay — progressive strength and conditioning, no random classes." },
            ].map((item) => (
              <article key={item.title} className="bg-[#112240] border border-[#1A3A5C] rounded p-8">
                <item.icon className="h-10 w-10 text-[#1E90FF] mb-4" />
                <h3 className="font-bold text-xl mb-3" style={{ fontFamily: "'Barlow', sans-serif" }}>{item.title}</h3>
                <p className="text-[#C8D8E8]/60 leading-relaxed">{item.desc}</p>
              </article>
            ))}
          </div>
          <div className="grid md:grid-cols-4 gap-4 max-w-5xl mx-auto mt-8">
            <div className="bg-white/[0.02] border border-white/10 rounded p-5 text-center">
              <Users className="h-6 w-6 text-[#1E90FF] mx-auto mb-2" />
              <p className="font-bold">4–6 people</p>
              <p className="text-[#C8D8E8]/50 text-sm">Matched by level</p>
            </div>
            <div className="bg-white/[0.02] border border-white/10 rounded p-5 text-center">
              <Clock className="h-6 w-6 text-[#1E90FF] mx-auto mb-2" />
              <p className="font-bold">60 minutes</p>
              <p className="text-[#C8D8E8]/50 text-sm">Warm-up, work, cool-down</p>
            </div>
            <div className="bg-white/[0.02] border border-white/10 rounded p-5 text-center">
              <MapPin className="h-6 w-6 text-[#1E90FF] mx-auto mb-2" />
              <p className="font-bold">Foundry Gym</p>
              <p className="text-[#C8D8E8]/50 text-sm">Kings Heath, Birmingham</p>
            </div>
            <div className="bg-white/[0.02] border border-white/10 rounded p-5 text-center">
              <Target className="h-6 w-6 text-[#1E90FF] mx-auto mb-2" />
              <p className="font-bold">From £23.60/session</p>
              <p className="text-[#C8D8E8]/50 text-sm">In a block of 8</p>
            </div>
          </div>
          <div className="max-w-4xl mx-auto mt-8 bg-[#112240] border border-[#1A3A5C] rounded-2xl p-6 md:p-8">
            <h3 className="font-bold text-xl mb-4" style={{ fontFamily: "'Barlow', sans-serif" }}>Group Training Packages</h3>
            <div className="space-y-3">
              {[
                { name: "4 Sessions/Month", price: "£99", freq: "1x per week", best: false },
                { name: "8 Sessions/Month", price: "£189", freq: "2x per week", best: true },
                { name: "12 Sessions/Month", price: "£279", freq: "3x per week", best: false },
              ].map((p) => (
                <div key={p.name} className={`flex items-center justify-between p-4 rounded ${p.best ? "bg-[#1E90FF]/10 border border-[#1E90FF]/30" : "bg-white/[0.02] border border-white/10"}`}>
                  <div><p className="font-bold">{p.name}</p><p className="text-[#C8D8E8]/60 text-sm">{p.freq}</p></div>
                  <div className="text-right"><p className="headline text-2xl">{p.price}</p><p className="text-[#C8D8E8]/50 text-xs">per month</p></div>
                </div>
              ))}
            </div>
            <p className="text-[#C8D8E8]/50 text-xs mt-3">All packages include nutrition guidance. No contract — cancel anytime. First session free.</p>
          </div>
        </div>
      </section>

      {/* Proof */}
      <section className="py-16 md:py-24 bg-[#0A1628] border-t border-white/5">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="text-[#1E90FF] font-bold uppercase tracking-[0.2em] text-sm mb-4">Proof</p>
            <h2 className="headline text-3xl md:text-5xl leading-none">GROUP CLIENT RESULTS</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {PROOF_GROUP.map((g) => (
              <article key={g.name} className="bg-[#112240] border border-[#1A3A5C] rounded-xl p-6">
                <div className="flex items-center gap-1 mb-3">
                  {[1,2,3,4,5].map((s) => <Star key={s} className="h-4 w-4 text-[#1E90FF] fill-[#1E90FF]" />)}
                </div>
                <p className="headline text-xl mb-2">{g.result}</p>
                <p className="text-[#C8D8E8]/60 text-sm">{g.name} — {g.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24 bg-[#0D1B2A] border-t border-white/5">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#1E90FF] font-bold uppercase tracking-[0.2em] text-sm mb-4">FAQ</p>
            <h2 className="headline text-3xl md:text-5xl leading-none">QUESTIONS ABOUT GROUP TRAINING</h2>
          </div>
          <div className="space-y-3">
            {FAQS_GROUP.map((f, i) => {
              const isOpen = openFaq === i;
              return (
                <article key={f.q} className={`border rounded-xl overflow-hidden bg-white/[0.02] transition-colors ${isOpen ? "border-[#1E90FF]/40" : "border-white/10"}`}>
                  <button onClick={() => setOpenFaq(isOpen ? null : i)} className="w-full flex items-center justify-between gap-4 p-5 md:p-6 text-left hover:bg-white/[0.03] transition-colors" aria-expanded={isOpen}>
                    <span className="font-bold text-base md:text-lg">{f.q}</span>
                    <ChevronDown className={`h-5 w-5 text-[#1E90FF] flex-shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  <div className={`grid transition-all duration-300 ease-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                    <div className="overflow-hidden"><p className="px-5 md:px-6 pb-5 md:pb-6 text-[#C8D8E8]/75 leading-relaxed">{f.a}</p></div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-[#0A1628] border-t border-white/5">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-3xl">
          <h2 className="headline text-3xl md:text-5xl leading-none mb-6">JOIN A <span className="text-[#1E90FF]">GROUP</span></h2>
          <p className="text-[#C8D8E8]/75 text-lg leading-relaxed mb-8">
            Book your free trial session. Train with the group, meet the coach, and see if it's the right fit — no commitment required.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="tel:+447753226214" className="bg-[#1E90FF] text-white font-bold uppercase tracking-wider px-8 py-4 rounded-full hover:bg-[#4DAAFF] transition-all inline-flex items-center gap-2"><Phone className="h-4 w-4" /> Call 07753 226 214</a>
            <a href="/contact" className="border border-white/20 text-white font-bold uppercase tracking-wider px-8 py-4 rounded-full hover:bg-white/5 transition-all inline-flex items-center gap-2"><ArrowRight className="h-4 w-4" /> Book Free Trial Session</a>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-[#C8D8E8]/50">
            <span>Also available: <a href="/personal-training-birmingham" className="text-[#1E90FF] hover:underline">1-to-1 Birmingham</a></span>
            <span><a href="/online-coaching" className="text-[#1E90FF] hover:underline">Online Coaching</a></span>
            <span><a href="/outdoor-training" className="text-[#1E90FF] hover:underline">Outdoor Training</a></span>
          </div>
        </div>
      </section>
    </main>
  );
}
