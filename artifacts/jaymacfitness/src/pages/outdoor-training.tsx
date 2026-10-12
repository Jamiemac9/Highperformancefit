import { useEffect, useState } from "react";
import { Phone, Mail, ArrowRight, Sun, TreePine, Mountain, Wind, MapPin, Clock, CloudRain, ChevronDown, CheckCircle2 } from "lucide-react";

const FAQS_OUTDOOR = [
  { q: "What happens if it rains during an outdoor session?", a: "Light rain, we train. For anything worse we agree a backup plan, and you'll always know in advance if the location changes." },
  { q: "What equipment do I need to bring?", a: "Comfortable training kit, trainers with grip and a water bottle. I bring the equipment." },
  { q: "Where exactly do outdoor sessions take place?", a: "Kings Heath Park, Cannon Hill Park or a green space near you. The meeting point is confirmed before each session." },
  { q: "How much does outdoor training cost?", a: "Outdoor sessions are priced on the free chat, depending on whether you train 1-2-1 or in a small group. Equipment is provided." },
  { q: "Is outdoor training as effective as gym training?", a: "For most goals — yes. Outdoor training builds functional strength, cardiovascular fitness and mental resilience. The natural terrain (hills, stairs, uneven ground) challenges your body in ways gym machines can't replicate." },
  { q: "What should I wear for outdoor training?", a: "Layer up. In winter: base layer, mid-layer, waterproof jacket, hat and gloves. In summer: breathable top, shorts, sunscreen and a cap." },
];

export default function OutdoorTraining() {
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
            <li aria-current="page" className="text-[#E6DFD2]/80">Outdoor Training</li>
          </ol>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative overflow-hidden pt-8 pb-16 md:pt-12 md:pb-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl">
            <p className="text-[#C9A45C] font-bold uppercase tracking-[0.2em] text-sm mb-4">Outdoor Training</p>
            <h1 className="headline text-4xl md:text-6xl lg:text-7xl leading-none mb-6">Outdoor Personal Training Birmingham — <span className="text-[#C9A45C]">Fresh Air, No Machines</span></h1>
            <p className="text-[#E6DFD2]/80 text-lg md:text-xl leading-relaxed max-w-2xl mb-6">
              Outdoor training sessions in Birmingham parks and open spaces. No gym needed. Bodyweight and environment-based workouts using hills, stairs, trees and whatever the space gives us. Harder, different, and surprisingly effective. Free first session.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="tel:+447753226214" className="bg-[#C9A45C] text-[#1A1610] font-bold uppercase tracking-wider px-8 py-4 rounded-full hover:bg-[#E3C88F] transition-all inline-flex items-center gap-2"><Phone className="h-4 w-4" /> Call Jay — 07753 226 214</a>
              <a href="/contact" className="border border-white/20 text-white font-bold uppercase tracking-wider px-8 py-4 rounded-full hover:bg-white/5 transition-all inline-flex items-center gap-2"><Mail className="h-4 w-4" /> Book Free Session</a>
            </div>
          </div>
        </div>
      </header>

      {/* Service Scope */}
      <section className="py-16 md:py-24 bg-[#0F0D0B] border-t border-white/5">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="text-[#C9A45C] font-bold uppercase tracking-[0.2em] text-sm mb-4">What's Included</p>
            <h2 className="headline text-3xl md:text-5xl leading-none">WHAT YOU GET WITH OUTDOOR TRAINING</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { icon: Sun, title: "Vitamin D & Fresh Air", desc: "Natural light and fresh air boost mood, energy and recovery between sessions." },
              { icon: TreePine, title: "Natural Terrain", desc: "Hills, grass, stairs and trees become your gym. Every session is different." },
              { icon: Wind, title: "Mental Reset", desc: "Breaking out of four walls resets your mind as much as your body." },
              { icon: Mountain, title: "Functional Fitness", desc: "Movements that translate to real life — not just gym machines." },
            ].map((item) => (
              <article key={item.title} className="bg-[#17140F] border border-[#2C261C] rounded p-6">
                <item.icon className="h-8 w-8 text-[#C9A45C] mb-4" />
                <h3 className="font-bold text-lg mb-2" style={{ fontFamily: "'Barlow', sans-serif" }}>{item.title}</h3>
                <p className="text-[#E6DFD2]/60 text-sm leading-relaxed">{item.desc}</p>
              </article>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto mt-12">
            {/* Locations */}
            <div className="bg-[#17140F] border border-[#2C261C] rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="h-6 w-6 text-[#C9A45C]" />
                <h3 className="font-bold text-xl" style={{ fontFamily: "'Barlow', sans-serif" }}>Training Locations</h3>
              </div>
              <p className="text-[#E6DFD2]/70 leading-relaxed mb-4">
                Sessions run in Birmingham's best outdoor training spots. The meeting point is confirmed before each session.
              </p>
              <div className="space-y-3">
                {[
                  { name: "Kings Heath Park", detail: "Flat areas + hill sprints. Main entrance." },
                  { name: "Cannon Hill Park", detail: "Near the MAC. Stairs, open grass, trees." },
                  { name: "Your local green space", detail: "If it suits you better, we can train near you." },
                ].map((loc) => (
                  <div key={loc.name} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-[#C9A45C] flex-shrink-0 mt-0.5" />
                    <div><p className="font-bold text-sm">{loc.name}</p><p className="text-[#E6DFD2]/50 text-xs">{loc.detail}</p></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Schedule & Policy */}
            <div className="space-y-6">
              <div className="bg-[#17140F] border border-[#2C261C] rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Clock className="h-5 w-5 text-[#C9A45C]" />
                  <h3 className="font-bold" style={{ fontFamily: "'Barlow', sans-serif" }}>Schedule</h3>
                </div>
                <p className="text-[#E6DFD2]/70 text-sm leading-relaxed">
                  Summer (April–October): Tue &amp; Thu 06:30, Sat 08:00. Winter sessions adapt — shorter formats, covered areas. Sessions run rain or shine.
                </p>
              </div>
              <div className="bg-[#17140F] border border-[#2C261C] rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <CloudRain className="h-5 w-5 text-[#C9A45C]" />
                  <h3 className="font-bold" style={{ fontFamily: "'Barlow', sans-serif" }}>All-Weather Policy</h3>
                </div>
                <p className="text-[#E6DFD2]/70 text-sm leading-relaxed">
                  Light rain, we train. For anything worse we agree a backup plan in advance.
                </p>
              </div>
              <div className="bg-[#17140F] border border-[#2C261C] rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Sun className="h-5 w-5 text-[#C9A45C]" />
                  <h3 className="font-bold" style={{ fontFamily: "'Barlow', sans-serif" }}>What to Bring</h3>
                </div>
                <p className="text-[#E6DFD2]/70 text-sm leading-relaxed">
                  Comfortable training kit, trainers with grip, water bottle, sunscreen (summer) or layers (winter). I bring the equipment.
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-8">
            <div className="bg-white/[0.02] border border-white/10 rounded p-5 text-center">
              <p className="font-bold">Small group or 1-2-1</p>
              <p className="text-[#E6DFD2]/50 text-sm">Max 4 people in a group</p>
            </div>
            <div className="bg-white/[0.02] border border-white/10 rounded p-5 text-center">
              <p className="font-bold">Priced on the free chat</p>
              <p className="text-[#E6DFD2]/50 text-sm">Fully customised outdoor session</p>
            </div>
            <div className="bg-white/[0.02] border border-white/10 rounded p-5 text-center">
              <p className="font-bold">No gym needed</p>
              <p className="text-[#E6DFD2]/50 text-sm">Your environment is the gym</p>
            </div>
          </div>
        </div>
      </section>

      {/* Training Style */}
      <section className="py-16 md:py-24 bg-[#100E0C] border-t border-white/5">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#C9A45C] font-bold uppercase tracking-[0.2em] text-sm mb-4">Training Style</p>
            <h2 className="headline text-3xl md:text-5xl leading-none">WHAT WE DO OUTDOORS</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              "Bodyweight strength circuits (push, pull, core, legs)",
              "Kettlebell and resistance band workouts",
              "Hill sprints and interval running",
              "Parkour-inspired movement and agility drills",
              "Partner exercises and team challenges",
              "Cold-weather adapted sessions (layered, dynamic warm-ups)",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 bg-[#17140F] border border-[#2C261C] rounded p-4">
                <CheckCircle2 className="h-5 w-5 text-[#C9A45C] flex-shrink-0 mt-0.5" />
                <span className="text-[#E6DFD2]/80">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24 bg-[#0F0D0B] border-t border-white/5">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#C9A45C] font-bold uppercase tracking-[0.2em] text-sm mb-4">FAQ</p>
            <h2 className="headline text-3xl md:text-5xl leading-none">QUESTIONS ABOUT OUTDOOR TRAINING</h2>
          </div>
          <div className="space-y-3">
            {FAQS_OUTDOOR.map((f, i) => {
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
          <h2 className="headline text-3xl md:text-5xl leading-none mb-6">BREAK OUT OF THE <span className="text-[#C9A45C]">GYM</span></h2>
          <p className="text-[#E6DFD2]/75 text-lg leading-relaxed mb-8">
            Book your free outdoor taster session. Experience training in fresh air with a coach who knows how to use the environment to challenge you.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="tel:+447753226214" className="bg-[#C9A45C] text-[#1A1610] font-bold uppercase tracking-wider px-8 py-4 rounded-full hover:bg-[#E3C88F] transition-all inline-flex items-center gap-2"><Phone className="h-4 w-4" /> Call 07753 226 214</a>
            <a href="/contact" className="border border-white/20 text-white font-bold uppercase tracking-wider px-8 py-4 rounded-full hover:bg-white/5 transition-all inline-flex items-center gap-2"><ArrowRight className="h-4 w-4" /> Book a free chat</a>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-[#E6DFD2]/50">
            <span>Also available: <a href="/personal-training-birmingham" className="text-[#C9A45C] hover:underline">1-to-1 Birmingham</a></span>
            <span><a href="/online-coaching" className="text-[#C9A45C] hover:underline">Online Coaching</a></span>
            <span><a href="/group-training" className="text-[#C9A45C] hover:underline">Group Training</a></span>
          </div>
        </div>
      </section>
    </main>
  );
}
