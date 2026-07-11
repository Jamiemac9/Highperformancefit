import { useEffect, useState } from "react";
import { Phone, Mail, ArrowRight, ChevronDown } from "lucide-react";

const FAQS = [
  { q: "What areas do you cover?", a: "I'm based at Foundry Gym in Kings Heath and primarily coach clients across South and Central Birmingham. Online coaching is available worldwide." },
  { q: "Do you offer online training?", a: "Yes. Online clients get a fully bespoke training programme, weekly check-ins, video form reviews and direct WhatsApp access between sessions. I've coached clients in five countries." },
  { q: "How do I get started?", a: "Fill in the enquiry form on our contact page or book a free consultation. We'll have a 20-minute chat about your goals and figure out the right plan for you." },
  { q: "What should I bring to a session?", a: "Comfortable training kit, indoor trainers, a water bottle and a towel. That's it — everything else is provided at the gym." },
  { q: "Are nutrition plans included?", a: "Every package includes nutrition guidance. Full bespoke meal plans are available as an add-on if you want extra structure." },
  { q: "How do I pay?", a: "Packages can be paid up-front by bank transfer or split into monthly direct debits. Everything is set up after your free consultation." },
  { q: "Can I train with a friend?", a: "Yes — group training is available for 3–6 people. It's cheaper than 1-2-1 and the energy of training together often pushes everyone further." },
  { q: "What if I need to cancel a session?", a: "Life happens. Give 24 hours notice and we'll reschedule. Cancellations within 24 hours may be charged at the coach's discretion." },
  { q: "Do you work with beginners?", a: "Absolutely. Most of my clients started as complete beginners. The only requirement is a willingness to show up and work." },
  { q: "How soon will I see results?", a: "Most clients notice changes in energy and strength within 2–3 weeks. Visible body composition changes typically show within 6–8 weeks with consistent training and nutrition." },
];

export default function Faq() {
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="min-h-screen bg-[#0A1628] text-white">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative pt-32 pb-20 md:pt-40 md:pb-28">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-[#1E90FF] font-bold uppercase tracking-[0.2em] text-sm mb-4">Questions</p>
            <h1 className="headline text-5xl md:text-7xl leading-none mb-6">FREQUENTLY ASKED<br /><span className="text-[#1E90FF]">QUESTIONS</span></h1>
            <p className="text-[#C8D8E8]/75 text-lg leading-relaxed">
              Everything you need to know before starting your training journey with High Performance Fit.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ List */}
      <section className="py-12 md:py-20 bg-[#0D1B2A] border-t border-white/5">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl mx-auto">
          <div className="space-y-3">
            {FAQS.map((f, i) => {
              const isOpen = open === i;
              return (
                <div key={f.q} className={`border rounded-xl overflow-hidden bg-white/[0.02] transition-colors ${isOpen ? "border-[#1E90FF]/40" : "border-white/10"}`}>
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-4 p-5 md:p-6 text-left hover:bg-white/[0.03] transition-colors"
                    aria-expanded={isOpen}
                  >
                    <span className="font-bold text-base md:text-lg">{f.q}</span>
                    <ChevronDown className={`h-5 w-5 text-[#1E90FF] flex-shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  <div className={`grid transition-all duration-300 ease-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                    <div className="overflow-hidden">
                      <p className="px-5 md:px-6 pb-5 md:pb-6 text-[#C8D8E8]/75 leading-relaxed">{f.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Still have questions */}
      <section className="py-20 md:py-28 bg-[#0A1628] border-t border-white/5">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-3xl">
          <h2 className="headline text-4xl md:text-5xl leading-none mb-6">STILL HAVE <span className="text-[#1E90FF]">QUESTIONS?</span></h2>
          <p className="text-[#C8D8E8]/75 text-lg leading-relaxed mb-8">
            No problem. Call, text or email — I'll get back to you within 24 hours. Or book a free consultation and we can talk it through in person.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="tel:+447753226214" className="bg-[#1E90FF] text-white font-bold uppercase tracking-wider px-8 py-4 rounded-full hover:bg-[#4DAAFF] transition-all inline-flex items-center gap-2">
              <Phone className="h-4 w-4" /> Call 07753 226 214
            </a>
            <a href="mailto:hello@highperformancefit.co.uk" className="border border-white/20 text-white font-bold uppercase tracking-wider px-8 py-4 rounded-full hover:bg-white/5 transition-all inline-flex items-center gap-2">
              <Mail className="h-4 w-4" /> Email Jay
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
