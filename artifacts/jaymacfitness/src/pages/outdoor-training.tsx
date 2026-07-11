import { useEffect } from "react";
import { Phone, Mail, ArrowRight, Sun, TreePine, Mountain, Wind, MapPin, Clock, CloudRain, CheckCircle2 } from "lucide-react";

export default function OutdoorTraining() {
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
            <p className="text-[#1E90FF] font-bold uppercase tracking-[0.2em] text-sm mb-4">Outdoor Training</p>
            <h1 className="headline text-5xl md:text-7xl leading-none mb-6">OUTDOOR<br />TRAINING IN <span className="text-[#1E90FF]">BIRMINGHAM</span></h1>
            <p className="text-[#C8D8E8]/75 text-lg md:text-xl leading-relaxed max-w-xl mb-8">
              Fresh air, no machines, zero excuses. Training outdoors in Birmingham parks and open spaces. Bodyweight, resistance bands, kettlebells and whatever the environment gives us. Harder, different, and surprisingly effective.
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

      {/* Why outdoor */}
      <section className="py-20 md:py-28 bg-[#0D1B2A] border-t border-white/5">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-[#1E90FF] font-bold uppercase tracking-[0.2em] text-sm mb-4">The Experience</p>
            <h2 className="headline text-4xl md:text-6xl leading-none">WHY TRAIN OUTSIDE?</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { icon: Sun, title: "Vitamin D & Fresh Air", desc: "Natural light and fresh air boost mood, energy and recovery between sessions." },
              { icon: TreePine, title: "Natural Terrain", desc: "Hills, grass, stairs and trees become your gym. Every session is different." },
              { icon: Wind, title: "Mental Reset", desc: "Breaking out of four walls resets your mind as much as your body." },
              { icon: Mountain, title: "Functional Fitness", desc: "Movements that translate to real life — not just gym machines." },
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

      {/* What we do */}
      <section className="py-20 md:py-28 bg-[#0A1628] border-t border-white/5">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-center">
            <div>
              <p className="text-[#1E90FF] font-bold uppercase tracking-[0.2em] text-sm mb-4">Training Style</p>
              <h2 className="headline text-4xl md:text-5xl leading-none mb-6">WHAT WE DO<br />OUTDOORS</h2>
              <div className="space-y-4">
                {[
                  "Bodyweight strength circuits (push, pull, core, legs)",
                  "Kettlebell and resistance band workouts",
                  "Hill sprints and interval running",
                  "Parkour-inspired movement and agility drills",
                  "Group partner exercises and team challenges",
                  "Cold-weather adapted sessions (layered clothing, shortened warm-ups)",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-[#1E90FF] flex-shrink-0 mt-0.5" />
                    <span className="text-[#C8D8E8]/80">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-[#112240] border border-[#1A3A5C] rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="h-5 w-5 text-[#1E90FF]" />
                  <h3 className="font-bold" style={{ fontFamily: "'Barlow', sans-serif" }}>Locations</h3>
                </div>
                <p className="text-[#C8D8E8]/70 text-sm leading-relaxed mb-3">
                  Sessions run in Kings Heath Park, Cannon Hill Park and local green spaces. Location confirmed 24 hours before each session based on weather and group size.
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Kings Heath Park", "Cannon Hill Park", "Moseley Park", "Highbury Park"].map((loc) => (
                    <span key={loc} className="text-xs bg-white/5 border border-white/10 rounded px-3 py-1 text-[#C8D8E8]/70">{loc}</span>
                  ))}
                </div>
              </div>
              <div className="bg-[#112240] border border-[#1A3A5C] rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="h-5 w-5 text-[#1E90FF]" />
                  <h3 className="font-bold" style={{ fontFamily: "'Barlow', sans-serif" }}>Schedule</h3>
                </div>
                <p className="text-[#C8D8E8]/70 text-sm leading-relaxed">
                  Summer season (April–October): Tuesday & Thursday 06:30, Saturday 08:00. Winter sessions move to covered areas and shorter formats. Sessions run rain or shine — we adapt, we don't cancel.
                </p>
              </div>
              <div className="bg-[#112240] border border-[#1A3A5C] rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <CloudRain className="h-5 w-5 text-[#1E90FF]" />
                  <h3 className="font-bold" style={{ fontFamily: "'Barlow', sans-serif" }}>All-Weather Policy</h3>
                </div>
                <p className="text-[#C8D8E8]/70 text-sm leading-relaxed">
                  Light rain? We train. Heavy rain? We move to a covered area or Foundry Gym as backup. You'll get a text 2 hours before if location changes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 md:py-28 bg-[#0D1B2A] border-t border-white/5">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-3xl">
          <p className="text-[#1E90FF] font-bold uppercase tracking-[0.2em] text-sm mb-4">Pricing</p>
          <h2 className="headline text-4xl md:text-5xl leading-none mb-6">OUTDOOR PACKAGES</h2>
          <p className="text-[#C8D8E8]/75 text-lg leading-relaxed mb-8">
            Outdoor sessions start from £25 per session in a group of 4–6, or £60 per session for 1-2-1 outdoor training. All equipment provided — just bring water, a towel and the right mindset.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="tel:+447753226214" className="bg-[#1E90FF] text-white font-bold uppercase tracking-wider px-8 py-4 rounded-full hover:bg-[#4DAAFF] transition-all inline-flex items-center gap-2">
              <Phone className="h-4 w-4" /> Call 07753 226 214
            </a>
            <a href="/?scrollTo=contact" className="border border-white/20 text-white font-bold uppercase tracking-wider px-8 py-4 rounded-full hover:bg-white/5 transition-all inline-flex items-center gap-2">
              <ArrowRight className="h-4 w-4" /> Book Free Taster
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
