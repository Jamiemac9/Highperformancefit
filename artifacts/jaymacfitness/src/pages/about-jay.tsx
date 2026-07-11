import { useEffect } from "react";
import { Phone, Mail, ArrowRight, Instagram, Facebook, Award, MapPin, GraduationCap, Users, Trophy, Star } from "lucide-react";

export default function AboutJay() {
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
            <p className="text-[#1E90FF] font-bold uppercase tracking-[0.2em] text-sm mb-4">About Your Coach</p>
            <h1 className="headline text-5xl md:text-7xl leading-none mb-6">MEET <span className="text-[#1E90FF]">JAY</span></h1>
            <p className="text-[#C8D8E8]/75 text-lg md:text-xl leading-relaxed max-w-xl mb-8">
              I'm Jay — a personal trainer based in Birmingham with one goal: getting you results that actually last. No gimmicks, no shortcuts, just smart training and honest accountability.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="tel:+447753226214" className="bg-[#1E90FF] text-white font-bold uppercase tracking-wider px-8 py-4 rounded-full hover:bg-[#4DAAFF] transition-all inline-flex items-center gap-2">
                <Phone className="h-4 w-4" /> Call Jay
              </a>
              <a href="https://instagram.com/jaymacjm" target="_blank" rel="noopener noreferrer" className="border border-white/20 text-white font-bold uppercase tracking-wider px-8 py-4 rounded-full hover:bg-white/5 transition-all inline-flex items-center gap-2">
                <Instagram className="h-4 w-4" /> @jaymacjm
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Bio + Photo */}
      <section className="py-20 md:py-28 bg-[#0D1B2A] border-t border-white/5">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-center">
            <div>
              <p className="text-[#1E90FF] font-bold uppercase tracking-[0.2em] text-sm mb-4">Background</p>
              <h2 className="headline text-4xl md:text-5xl leading-none mb-6">THE COACH BEHIND<br /><span className="text-[#1E90FF]">HIGH PERFORMANCE FIT</span></h2>
              <div className="space-y-4 text-[#C8D8E8]/75 leading-relaxed">
                <p>
                  I started High Performance Fit because I was tired of seeing people waste money on programmes that don't work. Generic plans, unqualified coaches, and gyms that care more about membership numbers than actual results.
                </p>
                <p>
                  I've been a personal trainer for over 8 years, working with everyone from complete beginners to competitive athletes. I've helped clients lose 20kg+, run their first marathons, and build strength they never thought possible.
                </p>
                <p>
                  My approach is simple: assess where you are, build a plan that fits your life, and hold you accountable to it. I don't do crash diets, I don't do 30-day challenges, and I don't promise magic. What I do promise is a programme built around you, consistent support, and a coach who actually gives a damn.
                </p>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="w-full max-w-sm aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 bg-white/5">
                <img
                  src="/jay-headshot.jpg"
                  alt="Jay Macdonald — Personal Trainer Birmingham"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Credentials */}
      <section className="py-20 md:py-28 bg-[#0A1628] border-t border-white/5">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-[#1E90FF] font-bold uppercase tracking-[0.2em] text-sm mb-4">Qualifications</p>
            <h2 className="headline text-4xl md:text-6xl leading-none">CREDENTIALS &<br />EXPERIENCE</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { icon: Award, title: "REPS Level 3", desc: "Fully qualified personal trainer registered with the Register of Exercise Professionals." },
              { icon: GraduationCap, title: "8+ Years", desc: "Coaching experience across gym, outdoor and online environments since 2017." },
              { icon: Users, title: "500+ Clients", desc: "Clients coached across Birmingham and online, from beginners to competitive athletes." },
              { icon: Trophy, title: "Results First", desc: "Every programme is built around measurable outcomes — not just activity." },
            ].map((item) => (
              <div key={item.title} className="bg-[#112240] border border-[#1A3A5C] rounded p-6 text-center">
                <item.icon className="h-10 w-10 text-[#1E90FF] mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2" style={{ fontFamily: "'Barlow', sans-serif" }}>{item.title}</h3>
                <p className="text-[#C8D8E8]/60 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-20 md:py-28 bg-[#0D1B2A] border-t border-white/5">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl mx-auto text-center">
          <p className="text-[#1E90FF] font-bold uppercase tracking-[0.2em] text-sm mb-4">Philosophy</p>
          <h2 className="headline text-4xl md:text-5xl leading-none mb-8">WHAT I BELIEVE</h2>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            {[
              { title: "No Templates", desc: "Your body, your schedule, your goals. Every programme is built from scratch. If I gave you the same plan I gave someone else, I'd be doing you a disservice." },
              { title: "Accountability Works", desc: "The difference between people who succeed and people who don't isn't talent — it's consistency. My job is to make consistency easier than giving up." },
              { title: "Results Over Hype", desc: "No 30-day challenges, no detox teas, no magic pills. Just progressive training, honest nutrition, and the patience to see it through." },
            ].map((item) => (
              <div key={item.title}>
                <h3 className="font-bold text-xl mb-3 text-[#1E90FF]" style={{ fontFamily: "'Barlow', sans-serif" }}>{item.title}</h3>
                <p className="text-[#C8D8E8]/70 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="py-20 md:py-28 bg-[#0A1628] border-t border-white/5">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-center">
            <div>
              <p className="text-[#1E90FF] font-bold uppercase tracking-[0.2em] text-sm mb-4">Location</p>
              <h2 className="headline text-4xl md:text-5xl leading-none mb-6">WHERE I COACH</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-[#C8D8E8]/70">
                  <MapPin className="h-5 w-5 text-[#1E90FF]" />
                  <span>Foundry Gym, Kings Heath, Birmingham B14 7JZ</span>
                </div>
                <div className="flex items-center gap-3 text-[#C8D8E8]/70">
                  <Star className="h-5 w-5 text-[#1E90FF]" />
                  <span>Outdoor sessions: Kings Heath Park, Cannon Hill Park, Moseley Park</span>
                </div>
                <div className="flex items-center gap-3 text-[#C8D8E8]/70">
                  <Phone className="h-5 w-5 text-[#1E90FF]" />
                  <span>07753 226 214 — call or text anytime</span>
                </div>
                <div className="flex items-center gap-3 text-[#C8D8E8]/70">
                  <Mail className="h-5 w-5 text-[#1E90FF]" />
                  <span>hello@highperformancefit.co.uk</span>
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

      {/* CTA */}
      <section className="py-20 md:py-28 bg-[#0D1B2A] border-t border-white/5">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-3xl">
          <h2 className="headline text-4xl md:text-5xl leading-none mb-6">WORK WITH <span className="text-[#1E90FF]">JAY</span></h2>
          <p className="text-[#C8D8E8]/75 text-lg leading-relaxed mb-8">
            Ready to train with a coach who actually cares? Book your free consultation and let's talk about what you want to achieve.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="tel:+447753226214" className="bg-[#1E90FF] text-white font-bold uppercase tracking-wider px-8 py-4 rounded-full hover:bg-[#4DAAFF] transition-all inline-flex items-center gap-2">
              <Phone className="h-4 w-4" /> Call 07753 226 214
            </a>
            <a href="/?scrollTo=contact" className="border border-white/20 text-white font-bold uppercase tracking-wider px-8 py-4 rounded-full hover:bg-white/5 transition-all inline-flex items-center gap-2">
              <ArrowRight className="h-4 w-4" /> Free Consultation
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
