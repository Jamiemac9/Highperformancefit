import { useEffect, useState } from "react";
import { ArrowRight, ChevronDown, Phone, Mail, MapPin, Landmark, Trees, Bus, Clock, CheckCircle2, Home } from "lucide-react";
import amyTransformation from "@assets/amy_trasnformation_1777814405343.jpg";
import dannyJenTransformation from "@assets/dannyandjen_progress_pic_1777814405345.jpg";
import elaineTransformation from "@assets/elaine_transformation_1777814405346.jpg";

const PROOF_IMAGES: Record<string, string> = {
  amy: amyTransformation,
  danny: dannyJenTransformation,
  elaine: elaineTransformation,
};

export type AreaData = {
  slug: string;
  name: string;
  postcode: string;
  eyebrow: string;
  h1Lead: string;
  h1Highlight: string;
  title: string;
  metaDescription: string;
  directAnswer: string;
  travelTime: string;
  distance: string;
  localIntro: string;
  landmarks: string[];
  parks: string[];
  transport: string[];
  serviceAreas: string;
  serviceAreaList: string[];
  clientTypes: string;
  mapQuery: string;
  proof: { name: string; result: string; detail: string; img: string }[];
  faqs: { q: string; a: string }[];
};

export default function AreaLandingPage({ area }: { area: AreaData }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  useEffect(() => {
    if (typeof window !== "undefined") window.scrollTo(0, 0);
  }, [area.slug]);

  return (
    <main className="min-h-screen bg-[#0A1628] text-white">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="pt-24 pb-0">
        <div className="container mx-auto px-4 md:px-6">
          <ol className="flex items-center gap-2 text-sm text-[#C8D8E8]/50">
            <li><a href="/" className="hover:text-[#1E90FF] transition-colors">Home</a></li>
            <li aria-hidden="true">/</li>
            <li><a href="/personal-training-birmingham" className="hover:text-[#1E90FF] transition-colors">Personal Training</a></li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-[#C8D8E8]/80">{area.name}</li>
          </ol>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative overflow-hidden pt-8 pb-14 md:pt-12 md:pb-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl">
            <p className="text-[#1E90FF] font-bold uppercase tracking-[0.2em] text-sm mb-4">{area.eyebrow}</p>
            <h1 className="headline text-4xl md:text-6xl lg:text-7xl leading-none mb-6">
              {area.h1Lead} — <span className="text-[#1E90FF]">{area.h1Highlight}</span>
            </h1>
            <div className="flex flex-wrap gap-4">
              <a href="tel:+447753226214" className="bg-[#1E90FF] text-white font-bold uppercase tracking-wider px-8 py-4 rounded-full hover:bg-[#4DAAFF] hover:shadow-[0_8px_32px_rgba(30,144,255,0.35)] transition-all inline-flex items-center gap-2"><Phone className="h-4 w-4" /> Call Jay — 07753 226 214</a>
              <a href="/contact" className="border border-white/20 text-white font-bold uppercase tracking-wider px-8 py-4 rounded-full hover:bg-white/5 transition-all inline-flex items-center gap-2"><Mail className="h-4 w-4" /> Book Free Consultation</a>
            </div>
          </div>
        </div>
      </header>

      {/* Direct answer block */}
      <section className="pb-4">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl rounded-xl border border-[#1E90FF]/30 bg-[#1E90FF]/[0.06] p-6 md:p-8">
            <p className="text-[#1E90FF] font-bold uppercase tracking-[0.2em] text-xs mb-3">In short</p>
            <p className="text-[#EAF2FB] text-lg md:text-xl leading-relaxed">{area.directAnswer}</p>
            <div className="mt-5 flex flex-wrap gap-3 text-sm">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/[0.04] border border-white/10 px-4 py-2"><Clock className="h-4 w-4 text-[#1E90FF]" /> {area.travelTime}</span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/[0.04] border border-white/10 px-4 py-2"><MapPin className="h-4 w-4 text-[#1E90FF]" /> {area.distance}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Local area content */}
      <section className="py-16 md:py-24 bg-[#0D1B2A] border-t border-white/5">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mb-12">
            <p className="text-[#1E90FF] font-bold uppercase tracking-[0.2em] text-sm mb-4">Training in {area.name}</p>
            <h2 className="headline text-3xl md:text-5xl leading-none mb-6">YOUR LOCAL PERSONAL TRAINER IN {area.name.toUpperCase()}</h2>
            <p className="text-[#C8D8E8]/75 text-lg leading-relaxed">{area.localIntro}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl">
            <article className="bg-[#112240] border border-[#1A3A5C] rounded p-6">
              <Landmark className="h-8 w-8 text-[#1E90FF] mb-4" />
              <h3 className="font-bold text-lg mb-3" style={{ fontFamily: "'Barlow', sans-serif" }}>Local landmarks</h3>
              <ul className="space-y-2">
                {area.landmarks.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-[#C8D8E8]/70 text-sm"><CheckCircle2 className="h-4 w-4 text-[#1E90FF] flex-shrink-0 mt-0.5" />{item}</li>
                ))}
              </ul>
            </article>
            <article className="bg-[#112240] border border-[#1A3A5C] rounded p-6">
              <Trees className="h-8 w-8 text-[#1E90FF] mb-4" />
              <h3 className="font-bold text-lg mb-3" style={{ fontFamily: "'Barlow', sans-serif" }}>Parks &amp; outdoor spaces</h3>
              <ul className="space-y-2">
                {area.parks.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-[#C8D8E8]/70 text-sm"><CheckCircle2 className="h-4 w-4 text-[#1E90FF] flex-shrink-0 mt-0.5" />{item}</li>
                ))}
              </ul>
            </article>
            <article className="bg-[#112240] border border-[#1A3A5C] rounded p-6">
              <Bus className="h-8 w-8 text-[#1E90FF] mb-4" />
              <h3 className="font-bold text-lg mb-3" style={{ fontFamily: "'Barlow', sans-serif" }}>Getting here</h3>
              <ul className="space-y-2">
                {area.transport.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-[#C8D8E8]/70 text-sm"><CheckCircle2 className="h-4 w-4 text-[#1E90FF] flex-shrink-0 mt-0.5" />{item}</li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>

      {/* Map + service areas */}
      <section className="py-16 md:py-24 bg-[#0A1628] border-t border-white/5">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-10 items-stretch max-w-6xl mx-auto">
            <div className="rounded-xl overflow-hidden border border-[#1A3A5C] min-h-[320px] bg-white/5">
              <iframe
                title={`Map of ${area.name}, Birmingham`}
                src={`https://www.google.com/maps?q=${area.mapQuery}&output=embed`}
                className="w-full h-full min-h-[320px]"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-[#1E90FF] font-bold uppercase tracking-[0.2em] text-sm mb-4">Service areas</p>
              <h2 className="headline text-3xl md:text-4xl leading-none mb-5">WHERE I COACH AROUND {area.name.toUpperCase()}</h2>
              <p className="text-[#C8D8E8]/75 text-lg leading-relaxed mb-6">{area.serviceAreas}</p>
              <div className="flex flex-wrap gap-3 mb-6">
                {area.serviceAreaList.map((a) => (
                  <span key={a} className="inline-flex items-center gap-2 rounded-full bg-[#1E90FF]/10 border border-[#1E90FF]/25 text-[#8Fc4ff] px-4 py-2 text-sm"><MapPin className="h-4 w-4" />{a}</span>
                ))}
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.02] p-5">
                <p className="text-[#1E90FF] font-bold uppercase tracking-[0.18em] text-xs mb-2">Who I train in {area.name}</p>
                <p className="text-[#C8D8E8]/75 leading-relaxed">{area.clientTypes}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Proof */}
      <section className="py-16 md:py-24 bg-[#0D1B2A] border-t border-white/5">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="text-[#1E90FF] font-bold uppercase tracking-[0.2em] text-sm mb-4">Local proof</p>
            <h2 className="headline text-3xl md:text-5xl leading-none">RESULTS FROM {area.name.toUpperCase()} CLIENTS</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {area.proof.map((client) => (
              <article key={client.name} className="bg-[#112240] border border-[#1A3A5C] rounded-xl overflow-hidden">
                <div className="aspect-[4/3] bg-white/5">
                  <img src={PROOF_IMAGES[client.img] ?? amyTransformation} alt={`${client.name} — ${area.name} client transformation`} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="p-5">
                  <p className="headline text-xl mb-1">{client.result}</p>
                  <p className="text-[#C8D8E8]/60 text-sm">{client.name} — {client.detail}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24 bg-[#0A1628] border-t border-white/5">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#1E90FF] font-bold uppercase tracking-[0.2em] text-sm mb-4">FAQ</p>
            <h2 className="headline text-3xl md:text-5xl leading-none">PERSONAL TRAINING IN {area.name.toUpperCase()} — YOUR QUESTIONS</h2>
          </div>
          <div className="space-y-3">
            {area.faqs.map((f, i) => {
              const isOpen = openFaq === i;
              return (
                <article key={f.q} className={`border rounded-xl overflow-hidden bg-white/[0.02] transition-colors ${isOpen ? "border-[#1E90FF]/40" : "border-white/10"}`}>
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-4 p-5 md:p-6 text-left hover:bg-white/[0.03] transition-colors"
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${area.slug}-${i}`}
                  >
                    <span className="font-bold text-base md:text-lg">{f.q}</span>
                    <ChevronDown className={`h-5 w-5 text-[#1E90FF] flex-shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  <div id={`faq-answer-${area.slug}-${i}`} className={`grid transition-all duration-300 ease-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                    <div className="overflow-hidden"><p className="px-5 md:px-6 pb-5 md:pb-6 text-[#C8D8E8]/75 leading-relaxed">{f.a}</p></div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA + links back */}
      <section className="py-16 md:py-24 bg-[#0D1B2A] border-t border-white/5">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-3xl">
          <h2 className="headline text-3xl md:text-5xl leading-none mb-6">READY TO START IN <span className="text-[#1E90FF]">{area.name.toUpperCase()}?</span></h2>
          <p className="text-[#C8D8E8]/75 text-lg leading-relaxed mb-8">
            Book your free 20-minute consultation. No pressure, no commitment — just a conversation about where you are and where you want to be.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="tel:+447753226214" className="bg-[#1E90FF] text-white font-bold uppercase tracking-wider px-8 py-4 rounded-full hover:bg-[#4DAAFF] transition-all inline-flex items-center gap-2"><Phone className="h-4 w-4" /> Call 07753 226 214</a>
            <a href="/contact" className="border border-white/20 text-white font-bold uppercase tracking-wider px-8 py-4 rounded-full hover:bg-white/5 transition-all inline-flex items-center gap-2"><ArrowRight className="h-4 w-4" /> Book Free Consultation</a>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-[#C8D8E8]/50">
            <span><a href="/personal-training-birmingham" className="text-[#1E90FF] hover:underline">Personal Training Birmingham</a></span>
            <span><a href="/" className="inline-flex items-center gap-1 text-[#1E90FF] hover:underline"><Home className="h-3.5 w-3.5" /> Homepage</a></span>
          </div>
        </div>
      </section>
    </main>
  );
}
