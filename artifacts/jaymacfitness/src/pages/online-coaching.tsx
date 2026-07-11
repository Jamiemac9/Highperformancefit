import { useEffect } from "react";
import { Phone, Mail, ArrowRight, Globe, Video, MessageSquare, Smartphone, Calendar, Clock, CheckCircle2 } from "lucide-react";

export default function OnlineCoaching() {
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
            <p className="text-[#1E90FF] font-bold uppercase tracking-[0.2em] text-sm mb-4">Online Coaching</p>
            <h1 className="headline text-5xl md:text-7xl leading-none mb-6">TRAIN FROM<br />ANYWHERE WITH <span className="text-[#1E90FF]">JAY</span></h1>
            <p className="text-[#C8D8E8]/75 text-lg md:text-xl leading-relaxed max-w-xl mb-8">
              Custom training programmes, weekly video check-ins, form reviews and direct WhatsApp access. I've coached clients in five countries. Distance is not an excuse.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="tel:+447753226214" className="bg-[#1E90FF] text-white font-bold uppercase tracking-wider px-8 py-4 rounded-full hover:bg-[#4DAAFF] transition-all inline-flex items-center gap-2">
                <Phone className="h-4 w-4" /> Call Jay
              </a>
              <a href="/?scrollTo=contact" className="border border-white/20 text-white font-bold uppercase tracking-wider px-8 py-4 rounded-full hover:bg-white/5 transition-all inline-flex items-center gap-2">
                <Mail className="h-4 w-4" /> Enquire Online
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 md:py-28 bg-[#0D1B2A] border-t border-white/5">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-[#1E90FF] font-bold uppercase tracking-[0.2em] text-sm mb-4">The Process</p>
            <h2 className="headline text-4xl md:text-6xl leading-none">HOW ONLINE COACHING WORKS</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { icon: Globe, title: "1. Sign Up", desc: "Choose your package and complete a detailed intake form about your goals, training history and available equipment." },
              { icon: Calendar, title: "2. Get Your Plan", desc: "Receive a fully customised training programme via our app, built around your schedule and the kit you have access to." },
              { icon: Video, title: "3. Check-Ins", desc: "Weekly video calls to review progress, adjust the plan and answer questions. Form reviews via video upload." },
              { icon: MessageSquare, title: "4. Daily Support", desc: "Direct WhatsApp line to Jay for quick questions, motivation and accountability between sessions." },
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

      {/* Features */}
      <section className="py-20 md:py-28 bg-[#0A1628] border-t border-white/5">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-center">
            <div>
              <p className="text-[#1E90FF] font-bold uppercase tracking-[0.2em] text-sm mb-4">What's Included</p>
              <h2 className="headline text-4xl md:text-5xl leading-none mb-6">EVERYTHING YOU NEED<br />TO <span className="text-[#1E90FF]">SUCCEED</span></h2>
              <div className="space-y-4">
                {[
                  "Fully customised training programme (updated every 4 weeks)",
                  "Nutrition guidance tailored to your goals and dietary preferences",
                  "Weekly 15-minute video check-in with Jay",
                  "Form review via video upload — send clips, get corrections",
                  "Direct WhatsApp access for questions and motivation",
                  "Progress tracking via photos, measurements and performance logs",
                  "Access to our coaching app with workout logging and video demos",
                  "Flexible scheduling — no set class times, train when it suits you",
                ].map((f) => (
                  <div key={f} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-[#1E90FF] flex-shrink-0 mt-0.5" />
                    <span className="text-[#C8D8E8]/80">{f}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#112240] border border-[#1A3A5C] rounded p-6 text-center">
                <Globe className="h-10 w-10 text-[#1E90FF] mx-auto mb-3" />
                <p className="headline text-3xl mb-1">5</p>
                <p className="text-[#C8D8E8]/60 text-sm">Countries Coached</p>
              </div>
              <div className="bg-[#112240] border border-[#1A3A5C] rounded p-6 text-center">
                <Video className="h-10 w-10 text-[#1E90FF] mx-auto mb-3" />
                <p className="headline text-3xl mb-1">50+</p>
                <p className="text-[#C8D8E8]/60 text-sm">Form Reviews Monthly</p>
              </div>
              <div className="bg-[#112240] border border-[#1A3A5C] rounded p-6 text-center">
                <Smartphone className="h-10 w-10 text-[#1E90FF] mx-auto mb-3" />
                <p className="headline text-3xl mb-1">24/7</p>
                <p className="text-[#C8D8E8]/60 text-sm">WhatsApp Access</p>
              </div>
              <div className="bg-[#112240] border border-[#1A3A5C] rounded p-6 text-center">
                <Clock className="h-10 w-10 text-[#1E90FF] mx-auto mb-3" />
                <p className="headline text-3xl mb-1">45</p>
                <p className="text-[#C8D8E8]/60 text-sm">Min Per Session</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing note */}
      <section className="py-20 md:py-28 bg-[#0D1B2A] border-t border-white/5">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-3xl">
          <p className="text-[#1E90FF] font-bold uppercase tracking-[0.2em] text-sm mb-4">Pricing</p>
          <h2 className="headline text-4xl md:text-5xl leading-none mb-6">ONLINE PACKAGES</h2>
          <p className="text-[#C8D8E8]/75 text-lg leading-relaxed mb-8">
            Online coaching starts from £49 per week, billed monthly. All packages include the full suite of support — programmes, check-ins, form reviews and daily access.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/personal-training-birmingham" className="bg-[#1E90FF] text-white font-bold uppercase tracking-wider px-8 py-4 rounded-full hover:bg-[#4DAAFF] transition-all inline-flex items-center gap-2">
              <ArrowRight className="h-4 w-4" /> View All Packages
            </a>
            <a href="/?scrollTo=contact" className="border border-white/20 text-white font-bold uppercase tracking-wider px-8 py-4 rounded-full hover:bg-white/5 transition-all inline-flex items-center gap-2">
              <Phone className="h-4 w-4" /> Free Consultation
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
