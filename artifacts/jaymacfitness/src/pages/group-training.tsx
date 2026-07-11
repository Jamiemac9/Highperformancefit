import { useEffect } from "react";
import { Phone, Mail, ArrowRight, Users, Flame, Clock, MapPin, Dumbbell, Target, CheckCircle2 } from "lucide-react";

export default function GroupTraining() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="min-h-screen bg-[#0A1628] text-white">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative pt-32 pb-20 md:pt-40 md:pb-28">
          <div className="max-w-3xl">
            <p className="text-[#1E90FF] font-bold uppercase tracking-[0.2em] text-sm mb-4">Small Group Training</p>
            <h1 className="headline text-5xl md:text-7xl leading-none mb-6">GROUP TRAINING<br />IN <span className="text-[#1E90FF]">BIRMINGHAM</span></h1>
            <p className="text-[#C8D8E8]/75 text-lg md:text-xl leading-relaxed max-w-xl mb-8">
              Train with 3–6 people who are just as committed as you. The energy of a team, the structure of PT, at a price that makes sense. Small groups, big results.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="tel:+447753226214" className="bg-[#1E90FF] text-white font-bold uppercase tracking-wider px-8 py-4 rounded-full hover:bg-[#4DAAFF] transition-all inline-flex items-center gap-2">
                <Phone className="h-4 w-4" /> Call Jay
              </a>
              <a href="/?scrollTo=contact" className="border border-white/20 text-white font-bold uppercase tracking-wider px-8 py-4 rounded-full hover:bg-white/5 transition-all inline-flex items-center gap-2">
                <Mail className="h-4 w-4" /> Enquire
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Why group training */}
      <section className="py-20 md:py-28 bg-[#0D1B2A] border-t border-white/5">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-[#1E90FF] font-bold uppercase tracking-[0.2em] text-sm mb-4">The Benefits</p>
            <h2 className="headline text-4xl md:text-6xl leading-none">WHY TRAIN IN A GROUP?</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { icon: Users, title: "Accountability", desc: "Training partners who expect you to show up. Missing a session becomes harder than going." },
              { icon: Flame, title: "Energy & Motivation", desc: "The competitive spark of a group pushes everyone further than they'd go alone." },
              { icon: Target, title: "Structured Sessions", desc: "Every session is programmed by Jay — no random gym classes, no wasted time." },
            ].map((item) => (
              <div key={item.title} className="bg-[#112240] border border-[#1A3A5C] rounded p-8">
                <item.icon className="h-10 w-10 text-[#1E90FF] mb-4" />
                <h3 className="font-bold text-xl mb-3" style={{ fontFamily: "'Barlow', sans-serif" }}>{item.title}</h3>
                <p className="text-[#C8D8E8]/60 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Session format */}
      <section className="py-20 md:py-28 bg-[#0A1628] border-t border-white/5">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-center">
            <div>
              <p className="text-[#1E90FF] font-bold uppercase tracking-[0.2em] text-sm mb-4">Session Format</p>
              <h2 className="headline text-4xl md:text-5xl leading-none mb-6">WHAT TO EXPECT</h2>
              <div className="space-y-5">
                {[
                  { icon: Users, text: "3–6 people per group, matched by fitness level and goals" },
                  { icon: Clock, text: "60-minute sessions, structured warm-up, main work and cool-down" },
                  { icon: Dumbbell, text: "Progressive strength and conditioning programming" },
                  { icon: MapPin, text: "At Foundry Gym, Kings Heath — fully equipped facility" },
                ].map((item) => (
                  <div key={item.text} className="flex items-start gap-3">
                    <item.icon className="h-5 w-5 text-[#1E90FF] flex-shrink-0 mt-0.5" />
                    <span className="text-[#C8D8E8]/80">{item.text}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 p-4 bg-[#1E90FF]/10 border border-[#1E90FF]/20 rounded">
                <p className="text-[#C8D8E8]/80 text-sm">
                  <strong className="text-white">Current groups:</strong> Tuesday & Thursday evenings at 18:30. Saturday mornings at 09:00. New groups forming — enquire to join.
                </p>
              </div>
            </div>
            <div className="bg-[#112240] border border-[#1A3A5C] rounded-2xl p-8">
              <h3 className="font-bold text-xl mb-6" style={{ fontFamily: "'Barlow', sans-serif" }}>Group Training Packages</h3>
              <div className="space-y-4">
                {[
                  { name: "4 Sessions/Month", price: "£99", freq: "1x per week" },
                  { name: "8 Sessions/Month", price: "£189", freq: "2x per week", best: true },
                  { name: "12 Sessions/Month", price: "£279", freq: "3x per week" },
                ].map((p) => (
                  <div key={p.name} className={`flex items-center justify-between p-4 rounded ${p.best ? "bg-[#1E90FF]/10 border border-[#1E90FF]/30" : "bg-white/[0.02] border border-white/10"}`}>
                    <div>
                      <p className="font-bold">{p.name}</p>
                      <p className="text-[#C8D8E8]/60 text-sm">{p.freq}</p>
                    </div>
                    <div className="text-right">
                      <p className="headline text-2xl">{p.price}</p>
                      <p className="text-[#C8D8E8]/50 text-xs">per month</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[#C8D8E8]/50 text-xs mt-4">All packages include nutrition guidance. No contract — cancel anytime.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 bg-[#0D1B2A] border-t border-white/5">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-3xl">
          <h2 className="headline text-4xl md:text-5xl leading-none mb-6">JOIN A <span className="text-[#1E90FF]">GROUP</span></h2>
          <p className="text-[#C8D8E8]/75 text-lg leading-relaxed mb-8">
            Book your free trial session. Train with the group, meet the coach, and see if it's the right fit — no commitment required.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="tel:+447753226214" className="bg-[#1E90FF] text-white font-bold uppercase tracking-wider px-8 py-4 rounded-full hover:bg-[#4DAAFF] transition-all inline-flex items-center gap-2">
              <Phone className="h-4 w-4" /> Call 07753 226 214
            </a>
            <a href="/?scrollTo=contact" className="border border-white/20 text-white font-bold uppercase tracking-wider px-8 py-4 rounded-full hover:bg-white/5 transition-all inline-flex items-center gap-2">
              <ArrowRight className="h-4 w-4" /> Free Trial Session
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
