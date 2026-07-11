import { useEffect, useState } from "react";
import { Phone, Mail, ArrowRight, Globe, Video, MessageSquare, Smartphone, Calendar, Clock, CheckCircle2, ChevronDown, Star } from "lucide-react";

const FAQS_ONLINE = [
  { q: "How does online personal training actually work?", a: "You complete a detailed intake form, then receive a custom training programme via our app. Each week we have a 15-minute video check-in to review progress, adjust the plan and answer questions. You send form videos for review and have WhatsApp access to me daily." },
  { q: "What equipment do I need for online coaching?", a: "Minimum: a phone and some open space. Preferred: dumbbells or resistance bands and a yoga mat. I design programmes around what you have access to — gym, home, hotel room, park." },
  { q: "How much does online coaching cost?", a: "Online packages start from £49 per week (£196/month) for the standard plan. Premium with weekly video calls and full nutrition planning is £79/week. No contract — cancel anytime." },
  { q: "What time zones do you cover?", a: "I'm based in Birmingham (GMT/BST) but coach clients across the UK, Europe, US East Coast, Middle East and Asia. Check-ins are scheduled to work for both of us — typically mornings or evenings in your local time." },
  { q: "How do video form reviews work?", a: "Record your key exercises on your phone and upload them via WhatsApp or the coaching app. I review within 24 hours and send back detailed feedback with corrections, cues and sometimes demonstration videos." },
  { q: "Is online coaching as effective as in-person training?", a: "For self-motivated clients, yes — sometimes more so because you're training more frequently. The accountability comes from the weekly check-ins and daily WhatsApp access. Most of my online clients train 4–5 times per week." },
];

const PROOF_ONLINE = [
  { name: "James R., Dubai", result: "Lost 14kg in 5 months", detail: "Online coaching from Dubai. Trained in apartment gym with minimal equipment." },
  { name: "Lisa M., London", result: "First marathon at 38", detail: "Combined strength training with running programme. Completed London Marathon 2025." },
  { name: "Tom K., New York", result: "Bench press +35kg in 8 months", detail: "Home gym setup. No commercial gym membership needed." },
];

export default function OnlineCoaching() {
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
            <li aria-current="page" className="text-[#C8D8E8]/80">Online Coaching</li>
          </ol>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative overflow-hidden pt-8 pb-16 md:pt-12 md:pb-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl">
            <p className="text-[#1E90FF] font-bold uppercase tracking-[0.2em] text-sm mb-4">Online Personal Training</p>
            <h1 className="headline text-4xl md:text-6xl lg:text-7xl leading-none mb-6">Online Personal Training UK &amp; Worldwide — <span className="text-[#1E90FF]">Custom Plans, Real Results</span></h1>
            <p className="text-[#C8D8E8]/80 text-lg md:text-xl leading-relaxed max-w-2xl mb-6">
              High Performance Fit offers online personal coaching to clients in 5+ countries. Custom training programmes, video form reviews, weekly check-ins, and direct WhatsApp access to Jay. Train from anywhere with an internet connection.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="tel:+447753226214" className="bg-[#1E90FF] text-white font-bold uppercase tracking-wider px-8 py-4 rounded-full hover:bg-[#4DAAFF] transition-all inline-flex items-center gap-2"><Phone className="h-4 w-4" /> Call Jay — 07753 226 214</a>
              <a href="/contact" className="border border-white/20 text-white font-bold uppercase tracking-wider px-8 py-4 rounded-full hover:bg-white/5 transition-all inline-flex items-center gap-2"><Mail className="h-4 w-4" /> Book Free Consultation</a>
            </div>
          </div>
        </div>
      </header>

      {/* Service Scope */}
      <section className="py-16 md:py-24 bg-[#0D1B2A] border-t border-white/5">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="text-[#1E90FF] font-bold uppercase tracking-[0.2em] text-sm mb-4">What's Included</p>
            <h2 className="headline text-3xl md:text-5xl leading-none">HOW ONLINE COACHING WORKS</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { icon: Globe, title: "1. Sign Up", desc: "Choose your package and complete a detailed intake about goals, history and available equipment." },
              { icon: Calendar, title: "2. Get Your Plan", desc: "Receive a fully customised programme via our app, built around your schedule and the kit you have." },
              { icon: Video, title: "3. Check-Ins", desc: "Weekly 15-minute video calls to review progress, adjust the plan and answer questions." },
              { icon: MessageSquare, title: "4. Daily Support", desc: "Direct WhatsApp line to Jay for quick questions, motivation and accountability." },
            ].map((item) => (
              <article key={item.title} className="bg-[#112240] border border-[#1A3A5C] rounded p-6">
                <item.icon className="h-8 w-8 text-[#1E90FF] mb-4" />
                <h3 className="font-bold text-lg mb-2" style={{ fontFamily: "'Barlow', sans-serif" }}>{item.title}</h3>
                <p className="text-[#C8D8E8]/60 text-sm leading-relaxed">{item.desc}</p>
              </article>
            ))}
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-8">
            <div className="bg-white/[0.02] border border-white/10 rounded p-5 text-center">
              <Clock className="h-6 w-6 text-[#1E90FF] mx-auto mb-2" />
              <p className="font-bold">4–5 sessions/week</p>
              <p className="text-[#C8D8E8]/50 text-sm">Self-directed with structure</p>
            </div>
            <div className="bg-white/[0.02] border border-white/10 rounded p-5 text-center">
              <Smartphone className="h-6 w-6 text-[#1E90FF] mx-auto mb-2" />
              <p className="font-bold">From £49/week</p>
              <p className="text-[#C8D8E8]/50 text-sm">Monthly billing, no contract</p>
            </div>
            <div className="bg-white/[0.02] border border-white/10 rounded p-5 text-center">
              <Globe className="h-6 w-6 text-[#1E90FF] mx-auto mb-2" />
              <p className="font-bold">5+ countries coached</p>
              <p className="text-[#C8D8E8]/50 text-sm">UK, Europe, US, Middle East, Asia</p>
            </div>
          </div>
        </div>
      </section>

      {/* Proof */}
      <section className="py-16 md:py-24 bg-[#0A1628] border-t border-white/5">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="text-[#1E90FF] font-bold uppercase tracking-[0.2em] text-sm mb-4">Proof</p>
            <h2 className="headline text-3xl md:text-5xl leading-none">ONLINE CLIENT RESULTS</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {PROOF_ONLINE.map((client) => (
              <article key={client.name} className="bg-[#112240] border border-[#1A3A5C] rounded-xl p-6">
                <div className="flex items-center gap-1 mb-3">
                  {[1,2,3,4,5].map((s) => <Star key={s} className="h-4 w-4 text-[#1E90FF] fill-[#1E90FF]" />)}
                </div>
                <p className="headline text-xl mb-2">{client.result}</p>
                <p className="text-[#C8D8E8]/60 text-sm">{client.name} — {client.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-16 md:py-24 bg-[#0D1B2A] border-t border-white/5">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="text-[#1E90FF] font-bold uppercase tracking-[0.2em] text-sm mb-4">Comparison</p>
            <h2 className="headline text-3xl md:text-5xl leading-none">ONLINE PT VS. FITNESS APPS VS. YOUTUBE PROGRAMMES</h2>
          </div>
          <div className="max-w-4xl mx-auto overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 font-bold">Feature</th>
                  <th className="text-left py-3 px-4 font-bold text-[#1E90FF]">Online PT</th>
                  <th className="text-left py-3 px-4 font-bold text-[#C8D8E8]/60">Fitness Apps</th>
                  <th className="text-left py-3 px-4 font-bold text-[#C8D8E8]/60">YouTube Programmes</th>
                </tr>
              </thead>
              <tbody className="text-[#C8D8E8]/80">
                <tr className="border-b border-white/5"><td className="py-3 px-4">Custom programme</td><td className="py-3 px-4 text-[#1E90FF]">✓ Built for your body &amp; goals</td><td className="py-3 px-4">✗ Algorithmic</td><td className="py-3 px-4">✗ Generic</td></tr>
                <tr className="border-b border-white/5"><td className="py-3 px-4">Form review</td><td className="py-3 px-4 text-[#1E90FF]">✓ Video analysis by coach</td><td className="py-3 px-4">✗ None</td><td className="py-3 px-4">✗ None</td></tr>
                <tr className="border-b border-white/5"><td className="py-3 px-4">Accountability</td><td className="py-3 px-4 text-[#1E90FF]">✓ Weekly check-ins + daily access</td><td className="py-3 px-4">✗ Streaks only</td><td className="py-3 px-4">✗ None</td></tr>
                <tr className="border-b border-white/5"><td className="py-3 px-4">Progress adjustments</td><td className="py-3 px-4 text-[#1E90FF]">✓ Plan adapts every 2–4 weeks</td><td className="py-3 px-4">✗ Auto-generated</td><td className="py-3 px-4">✗ Static plan</td></tr>
                <tr className="border-b border-white/5"><td className="py-3 px-4">Cost per month</td><td className="py-3 px-4 text-[#1E90FF]">£196–£316</td><td className="py-3 px-4">£0–£15</td><td className="py-3 px-4">£0</td></tr>
                <tr><td className="py-3 px-4">Results timeline</td><td className="py-3 px-4 text-[#1E90FF]">6–10 weeks visible</td><td className="py-3 px-4">Variable</td><td className="py-3 px-4">Rarely consistent</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24 bg-[#0A1628] border-t border-white/5">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#1E90FF] font-bold uppercase tracking-[0.2em] text-sm mb-4">FAQ</p>
            <h2 className="headline text-3xl md:text-5xl leading-none">QUESTIONS ABOUT ONLINE COACHING</h2>
          </div>
          <div className="space-y-3">
            {FAQS_ONLINE.map((f, i) => {
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
      <section className="py-16 md:py-24 bg-[#0D1B2A] border-t border-white/5">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-3xl">
          <h2 className="headline text-3xl md:text-5xl leading-none mb-6">READY TO TRAIN FROM <span className="text-[#1E90FF]">ANYWHERE?</span></h2>
          <p className="text-[#C8D8E8]/75 text-lg leading-relaxed mb-8">
            Book your free consultation. We'll discuss your goals, equipment and schedule — and I'll show you exactly how the programme would work for you.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="tel:+447753226214" className="bg-[#1E90FF] text-white font-bold uppercase tracking-wider px-8 py-4 rounded-full hover:bg-[#4DAAFF] transition-all inline-flex items-center gap-2"><Phone className="h-4 w-4" /> Call 07753 226 214</a>
            <a href="/contact" className="border border-white/20 text-white font-bold uppercase tracking-wider px-8 py-4 rounded-full hover:bg-white/5 transition-all inline-flex items-center gap-2"><ArrowRight className="h-4 w-4" /> Book Free Consultation</a>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-[#C8D8E8]/50">
            <span>Also available: <a href="/personal-training-birmingham" className="text-[#1E90FF] hover:underline">1-to-1 Birmingham</a></span>
            <span><a href="/group-training" className="text-[#1E90FF] hover:underline">Group Training</a></span>
            <span><a href="/outdoor-training" className="text-[#1E90FF] hover:underline">Outdoor Training</a></span>
          </div>
        </div>
      </section>
    </main>
  );
}
