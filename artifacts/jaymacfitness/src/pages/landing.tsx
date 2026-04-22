import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { apiGet, apiPost } from "../lib/api";
import {
  Dumbbell,
  Laptop,
  Users,
  ArrowRight,
  ChevronDown,
  Star,
  MapPin,
  Mail,
  Phone,
  Instagram,
  Facebook,
  CheckCircle2,
  Calendar,
  ClipboardList,
  Activity,
  Trophy,
  Menu,
  X,
} from "lucide-react";

type Pkg = { id: string; name: string; sessions: number; price: string; description?: string };

const SERVICES = [
  {
    icon: Dumbbell,
    title: "1-2-1 Personal Training",
    desc: "Focused, hands-on coaching at Foundry Gym Kings Heath. Built around your body, your goals, your pace.",
    href: "#packages",
  },
  {
    icon: Laptop,
    title: "Online Coaching",
    desc: "Custom programming, video form checks and weekly accountability — train anywhere with a coach in your pocket.",
    href: "#packages",
  },
  {
    icon: Users,
    title: "Group Training",
    desc: "High-energy small group sessions. Push harder with people who push back. Limited spaces each week.",
    href: "#contact",
  },
];

const STEPS = [
  { icon: Calendar, title: "Free Consultation", desc: "Tell me your goals, training history and what's held you back. No pressure, just a conversation." },
  { icon: ClipboardList, title: "Personalised Plan", desc: "Get a programme built for your body, your schedule and the result you actually want." },
  { icon: Activity, title: "Train & Track", desc: "We train, we measure, we adjust. Every session has a purpose. Every week you progress." },
  { icon: Trophy, title: "Get Results", desc: "Stronger, fitter, leaner — and the habits to keep it that way long after we're done." },
];

const TESTIMONIALS = [
  {
    quote:
      "Jay completely changed my relationship with training. I dropped 18kg in 9 months and I've never felt stronger. He pushes you, but he meets you where you are.",
    name: "Sarah W.",
    detail: "Client since 2024",
  },
  {
    quote:
      "I'd tried every gym and every plan going. Within 6 weeks with Jay I was lifting weights I didn't think were possible. The man knows his stuff.",
    name: "Marcus T.",
    detail: "Online coaching",
  },
  {
    quote:
      "Honest, structured, and actually fun. The accountability is what made it stick for me. Worth every penny.",
    name: "Priya K.",
    detail: "1-2-1 client",
  },
];

const FAQS = [
  { q: "What areas do you cover?", a: "I'm based at Foundry Gym in Kings Heath and primarily coach clients across South and Central Birmingham. Online coaching is available worldwide." },
  { q: "Do you offer online training?", a: "Yes. Online clients get a fully bespoke training programme, weekly check-ins, video form reviews and direct WhatsApp access between sessions." },
  { q: "How do I get started?", a: "Fill in the enquiry form below or book a free consultation. We'll have a 20-minute chat about your goals and figure out the right plan for you." },
  { q: "What should I bring to a session?", a: "Comfortable training kit, indoor trainers, a water bottle and a towel. That's it — everything else is provided at the gym." },
  { q: "Are nutrition plans included?", a: "Every package includes nutrition guidance. Full bespoke meal plans are available as an add-on if you want extra structure." },
  { q: "How do I pay?", a: "Packages can be paid up-front by bank transfer or split into monthly direct debits. Everything is set up after your free consultation." },
];

export default function Landing() {
  const { data: packages = [] } = useQuery<Pkg[]>({
    queryKey: ["packages"],
    queryFn: () => apiGet<Pkg[]>("/api/packages"),
  });

  return (
    <div className="font-body bg-[#0A0A0A] text-white min-h-screen overflow-x-hidden">
      <Nav />
      <Hero />
      <SocialProof />
      <Services />
      <HowItWorks />
      <Packages packages={packages} />
      <Testimonials />
      <FAQ />
      <Contact />
      <Footer />
    </div>
  );
}

function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#services", label: "Services" },
    { href: "#how", label: "How It Works" },
    { href: "#packages", label: "Packages" },
    { href: "#faq", label: "FAQ" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-[#0A0A0A]/95 backdrop-blur border-b border-white/5" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
        <a href="#top" className="font-display text-2xl md:text-3xl tracking-wider text-white">
          JAYMAC<span className="text-[#C8FF00]">FITNESS</span>
        </a>
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm font-medium text-white/70 hover:text-[#C8FF00] transition-colors">
              {l.label}
            </a>
          ))}
          <Link to="/login" className="text-sm font-medium text-white/70 hover:text-[#C8FF00] transition-colors">
            Login
          </Link>
          <a
            href="#contact"
            className="bg-[#C8FF00] text-black font-bold px-5 py-2.5 rounded-full text-sm hover:scale-105 transition-transform"
          >
            Book Free Consult
          </a>
        </nav>
        <button onClick={() => setOpen(!open)} className="md:hidden p-2 text-white" aria-label="Menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      {open && (
        <div className="md:hidden bg-[#0A0A0A] border-t border-white/5 animate-fade-in">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-1">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-3 px-2 text-base text-white/80 hover:text-[#C8FF00] hover:bg-white/5 rounded transition-colors"
              >
                {l.label}
              </a>
            ))}
            <Link to="/login" onClick={() => setOpen(false)} className="py-3 px-2 text-base text-white/80 hover:text-[#C8FF00] hover:bg-white/5 rounded transition-colors">
              Login
            </Link>
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="mt-2 bg-[#C8FF00] text-black font-bold px-5 py-3 rounded-full text-base text-center"
            >
              Book Free Consult
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative min-h-screen flex items-center bg-[#0A0A0A] bg-noise pt-20">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0A0A0A] pointer-events-none" />
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-[#C8FF00]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -left-32 w-96 h-96 bg-[#C8FF00]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10 py-20">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6 md:mb-8 animate-fade-in">
            <span className="h-2 w-2 rounded-full bg-[#C8FF00] animate-pulse" />
            <span className="text-xs md:text-sm text-white/80 font-medium">Now booking — April 2026 spaces</span>
          </div>

          <h1 className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-[10rem] leading-[0.9] tracking-tight text-white animate-fade-up">
            RESULTS.
            <br />
            <span className="text-[#C8FF00]">NOT EXCUSES.</span>
          </h1>

          <p className="mt-6 md:mt-8 text-lg md:text-2xl text-white/70 max-w-2xl animate-fade-up" style={{ animationDelay: "0.15s" }}>
            Personal training in Birmingham — online and in-person. Built for people who are done starting over.
          </p>

          <div className="mt-8 md:mt-10 flex flex-col sm:flex-row gap-4 animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <a
              href="#contact"
              className="group bg-[#C8FF00] text-black font-bold text-base md:text-lg px-8 py-4 rounded-full hover:scale-[1.02] transition-transform inline-flex items-center justify-center gap-2 animate-pulse-glow"
            >
              Book a Free Consultation
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#packages"
              className="border-2 border-white/20 text-white font-bold text-base md:text-lg px-8 py-4 rounded-full hover:border-[#C8FF00] hover:text-[#C8FF00] transition-colors inline-flex items-center justify-center"
            >
              View Packages
            </a>
          </div>
        </div>
      </div>

      <a href="#proof" className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 hover:text-[#C8FF00] transition-colors hidden md:block">
        <ChevronDown className="h-6 w-6 animate-bounce" />
      </a>
    </section>
  );
}

function SocialProof() {
  const stats = [
    { value: "100+", label: "Clients Trained" },
    { value: "4.9★", label: "Average Rating" },
    { value: "13", label: "Years Experience" },
  ];
  return (
    <section id="proof" className="bg-[#C8FF00] text-black py-6 md:py-8 border-y-4 border-black">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-3 gap-4 md:gap-12 text-center">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col">
              <span className="font-display text-3xl md:text-5xl leading-none">{s.value}</span>
              <span className="text-xs md:text-sm font-bold uppercase tracking-wider mt-1">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.classList.add("in-view");
            obs.unobserve(el);
          }
        });
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className="reveal" style={{ animationDelay: `${delay}s` }}>
      {children}
    </div>
  );
}

function Services() {
  return (
    <section id="services" className="py-20 md:py-32 bg-[#0A0A0A]">
      <div className="container mx-auto px-4 md:px-6">
        <Reveal>
          <div className="max-w-3xl mb-12 md:mb-20">
            <p className="text-[#C8FF00] font-bold uppercase tracking-[0.2em] text-sm mb-4">What I Offer</p>
            <h2 className="font-display text-5xl md:text-7xl leading-none">
              THREE WAYS
              <br />
              TO TRAIN.
            </h2>
          </div>
        </Reveal>

        <div className="grid gap-6 md:gap-8 md:grid-cols-3">
          {SERVICES.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.1}>
              <div className="group h-full border border-white/10 rounded-2xl p-8 bg-white/[0.02] hover:bg-white/[0.04] hover:border-[#C8FF00]/40 transition-all duration-300">
                <div className="h-14 w-14 rounded-xl bg-[#C8FF00]/10 border border-[#C8FF00]/20 flex items-center justify-center mb-6 group-hover:bg-[#C8FF00] transition-colors">
                  <s.icon className="h-7 w-7 text-[#C8FF00] group-hover:text-black transition-colors" />
                </div>
                <h3 className="font-display text-2xl md:text-3xl mb-3 tracking-wide">{s.title}</h3>
                <p className="text-white/60 leading-relaxed mb-6">{s.desc}</p>
                <a href={s.href} className="inline-flex items-center gap-2 text-[#C8FF00] font-bold text-sm uppercase tracking-wider group-hover:gap-3 transition-all">
                  Learn More <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="how" className="py-20 md:py-32 bg-[#0A0A0A] border-t border-white/5">
      <div className="container mx-auto px-4 md:px-6">
        <Reveal>
          <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
            <p className="text-[#C8FF00] font-bold uppercase tracking-[0.2em] text-sm mb-4">The Process</p>
            <h2 className="font-display text-5xl md:text-7xl leading-none">HOW IT WORKS</h2>
          </div>
        </Reveal>

        <div className="max-w-5xl mx-auto space-y-12 md:space-y-20">
          {STEPS.map((step, i) => {
            const reversed = i % 2 === 1;
            return (
              <Reveal key={step.title} delay={i * 0.05}>
                <div className={`flex flex-col ${reversed ? "md:flex-row-reverse" : "md:flex-row"} items-center gap-8 md:gap-12`}>
                  <div className="flex-shrink-0 relative">
                    <div className="h-32 w-32 md:h-40 md:w-40 rounded-2xl bg-[#C8FF00] flex items-center justify-center">
                      <step.icon className="h-14 w-14 md:h-16 md:w-16 text-black" strokeWidth={2} />
                    </div>
                    <div className="absolute -top-3 -right-3 h-12 w-12 rounded-full bg-[#0A0A0A] border-2 border-[#C8FF00] flex items-center justify-center">
                      <span className="font-display text-xl text-[#C8FF00]">0{i + 1}</span>
                    </div>
                  </div>
                  <div className={`flex-1 text-center ${reversed ? "md:text-right" : "md:text-left"}`}>
                    <h3 className="font-display text-3xl md:text-5xl mb-3 tracking-wide">{step.title}</h3>
                    <p className="text-white/60 text-lg leading-relaxed max-w-xl mx-auto md:mx-0">{step.desc}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Packages({ packages }: { packages: Pkg[] }) {
  return (
    <section id="packages" className="py-20 md:py-32 bg-[#0A0A0A] border-t border-white/5 relative">
      <div className="absolute inset-0 bg-noise opacity-50 pointer-events-none" />
      <div className="container mx-auto px-4 md:px-6 relative">
        <Reveal>
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-20">
            <p className="text-[#C8FF00] font-bold uppercase tracking-[0.2em] text-sm mb-4">Investment</p>
            <h2 className="font-display text-5xl md:text-7xl leading-none">PICK YOUR PLAN</h2>
            <p className="mt-6 text-white/60 text-lg">Simple pricing. No hidden fees. Just results.</p>
          </div>
        </Reveal>

        <div className="grid gap-6 md:gap-8 md:grid-cols-2 max-w-4xl mx-auto">
          {(packages.length === 0
            ? [
                { id: "p1", name: "Starter", sessions: 5, price: "175.00", description: "Perfect for trying personal training" },
                { id: "p2", name: "Commitment", sessions: 10, price: "300.00", description: "Best value — most popular choice" },
              ]
            : packages
          ).map((pkg, i) => {
            const featured = i === 1;
            return (
              <Reveal key={pkg.id} delay={i * 0.1}>
                <div
                  className={`relative h-full rounded-3xl p-8 md:p-10 transition-all duration-300 ${
                    featured
                      ? "bg-[#C8FF00] text-black border-2 border-[#C8FF00]"
                      : "bg-white/[0.03] border border-white/10 text-white hover:border-[#C8FF00]/40"
                  }`}
                >
                  {featured && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black text-[#C8FF00] text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full">
                      Most Popular
                    </div>
                  )}
                  <h3 className="font-display text-3xl md:text-4xl mb-2 tracking-wide">{pkg.name}</h3>
                  <p className={`text-sm mb-6 ${featured ? "text-black/70" : "text-white/60"}`}>
                    {pkg.sessions} personal training sessions
                  </p>
                  <div className="flex items-baseline gap-1 mb-8">
                    <span className="font-display text-6xl md:text-7xl leading-none">£{Math.round(Number(pkg.price))}</span>
                  </div>
                  <ul className="space-y-3 mb-10">
                    {[
                      `${pkg.sessions} x 60-minute sessions`,
                      "Personalised training plan",
                      "Nutrition guidance included",
                      "WhatsApp support between sessions",
                    ].map((feat) => (
                      <li key={feat} className="flex items-start gap-3">
                        <CheckCircle2 className={`h-5 w-5 flex-shrink-0 mt-0.5 ${featured ? "text-black" : "text-[#C8FF00]"}`} />
                        <span className={`text-sm ${featured ? "text-black/80" : "text-white/80"}`}>{feat}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href="#contact"
                    className={`block w-full text-center font-bold uppercase tracking-wider text-sm py-4 rounded-full transition-colors ${
                      featured
                        ? "bg-black text-[#C8FF00] hover:bg-black/80"
                        : "bg-[#C8FF00] text-black hover:bg-white"
                    }`}
                  >
                    Get Started
                  </a>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const [active, setActive] = useState(0);
  return (
    <section className="py-20 md:py-32 bg-[#0A0A0A] border-t border-white/5">
      <div className="container mx-auto px-4 md:px-6">
        <Reveal>
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-20">
            <p className="text-[#C8FF00] font-bold uppercase tracking-[0.2em] text-sm mb-4">Real People. Real Results.</p>
            <h2 className="font-display text-5xl md:text-7xl leading-none">WHAT CLIENTS SAY</h2>
          </div>
        </Reveal>

        {/* Desktop grid */}
        <div className="hidden md:grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.1}>
              <TestimonialCard t={t} />
            </Reveal>
          ))}
        </div>

        {/* Mobile carousel */}
        <div className="md:hidden">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${active * 100}%)` }}
            >
              {TESTIMONIALS.map((t) => (
                <div key={t.name} className="w-full flex-shrink-0 px-1">
                  <TestimonialCard t={t} />
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center gap-2 mt-6">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                aria-label={`Go to testimonial ${i + 1}`}
                className={`h-2 rounded-full transition-all ${active === i ? "bg-[#C8FF00] w-8" : "bg-white/20 w-2"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ t }: { t: (typeof TESTIMONIALS)[number] }) {
  return (
    <div className="h-full border border-white/10 rounded-2xl p-8 bg-white/[0.02]">
      <div className="flex gap-1 mb-6">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="h-5 w-5 fill-[#C8FF00] text-[#C8FF00]" />
        ))}
      </div>
      <p className="text-white/80 leading-relaxed mb-6 text-lg">&ldquo;{t.quote}&rdquo;</p>
      <div className="border-t border-white/10 pt-4">
        <div className="font-bold text-white">{t.name}</div>
        <div className="text-sm text-white/50">{t.detail}</div>
      </div>
    </div>
  );
}

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="py-20 md:py-32 bg-[#0A0A0A] border-t border-white/5">
      <div className="container mx-auto px-4 md:px-6">
        <Reveal>
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
            <p className="text-[#C8FF00] font-bold uppercase tracking-[0.2em] text-sm mb-4">Questions</p>
            <h2 className="font-display text-5xl md:text-7xl leading-none">FAQ</h2>
          </div>
        </Reveal>
        <div className="max-w-3xl mx-auto space-y-3">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={f.q} delay={i * 0.04}>
                <div className="border border-white/10 rounded-xl overflow-hidden bg-white/[0.02]">
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-4 p-5 md:p-6 text-left hover:bg-white/[0.03] transition-colors"
                    aria-expanded={isOpen}
                  >
                    <span className="font-bold text-base md:text-lg">{f.q}</span>
                    <ChevronDown
                      className={`h-5 w-5 text-[#C8FF00] flex-shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  <div
                    className={`grid transition-all duration-300 ease-out ${
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 md:px-6 pb-5 md:pb-6 text-white/70 leading-relaxed">{f.a}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      phone: String(fd.get("phone") || ""),
      message: `Goal: ${String(fd.get("goal") || "Not specified")}\n\n${String(fd.get("message") || "")}`,
      source: "landing",
    };
    try {
      await apiPost("/api/enquiries", payload);
      setSuccess(true);
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      setError(err?.message || "Something went wrong. Please try again or call directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 md:py-32 bg-[#0A0A0A] border-t border-white/5">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 max-w-6xl mx-auto">
          <div>
            <Reveal>
              <p className="text-[#C8FF00] font-bold uppercase tracking-[0.2em] text-sm mb-4">Get In Touch</p>
              <h2 className="font-display text-5xl md:text-7xl leading-none mb-6">
                READY TO
                <br />
                <span className="text-[#C8FF00]">START?</span>
              </h2>
              <p className="text-white/70 text-lg leading-relaxed mb-8">
                Send a message and I'll reply within 24 hours to book your free consultation. No pressure, no spam.
              </p>

              <div className="space-y-4 mb-8">
                <a href="mailto:hello@jaymacfitness.co.uk" className="flex items-center gap-4 text-white/80 hover:text-[#C8FF00] transition-colors">
                  <div className="h-10 w-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-[#C8FF00]" />
                  </div>
                  <span>hello@jaymacfitness.co.uk</span>
                </a>
                <a href="tel:+447700900000" className="flex items-center gap-4 text-white/80 hover:text-[#C8FF00] transition-colors">
                  <div className="h-10 w-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                    <Phone className="h-5 w-5 text-[#C8FF00]" />
                  </div>
                  <span>+44 7700 900000</span>
                </a>
                <div className="flex items-center gap-4 text-white/80">
                  <div className="h-10 w-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-[#C8FF00]" />
                  </div>
                  <span>Foundry Gym, Kings Heath, Birmingham</span>
                </div>
              </div>

              <div className="rounded-2xl overflow-hidden border border-white/10 aspect-video bg-white/5 flex items-center justify-center">
                <iframe
                  title="Foundry Gym Kings Heath"
                  src="https://www.google.com/maps?q=Foundry+Gym+Kings+Heath+Birmingham&output=embed"
                  className="w-full h-full grayscale contrast-125"
                  loading="lazy"
                />
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <form
              onSubmit={onSubmit}
              className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 md:p-8 space-y-5"
            >
              {success ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-[#C8FF00]/10 border border-[#C8FF00]/30 mb-6">
                    <CheckCircle2 className="h-8 w-8 text-[#C8FF00]" />
                  </div>
                  <h3 className="font-display text-3xl md:text-4xl mb-3">MESSAGE SENT</h3>
                  <p className="text-white/70 mb-6">
                    Thanks for reaching out. I'll be in touch within 24 hours to book your free consultation.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSuccess(false)}
                    className="text-[#C8FF00] font-bold uppercase tracking-wider text-sm hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <>
                  <div>
                    <label htmlFor="c-name" className="block text-xs font-bold uppercase tracking-wider text-white/50 mb-2">
                      Name
                    </label>
                    <input
                      id="c-name"
                      name="name"
                      required
                      placeholder="Your full name"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#C8FF00] transition-colors min-h-[44px]"
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="c-email" className="block text-xs font-bold uppercase tracking-wider text-white/50 mb-2">
                        Email
                      </label>
                      <input
                        id="c-email"
                        name="email"
                        type="email"
                        required
                        placeholder="you@example.com"
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#C8FF00] transition-colors min-h-[44px]"
                      />
                    </div>
                    <div>
                      <label htmlFor="c-phone" className="block text-xs font-bold uppercase tracking-wider text-white/50 mb-2">
                        Phone
                      </label>
                      <input
                        id="c-phone"
                        name="phone"
                        type="tel"
                        placeholder="+44 ..."
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#C8FF00] transition-colors min-h-[44px]"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="c-goal" className="block text-xs font-bold uppercase tracking-wider text-white/50 mb-2">
                      Primary Goal
                    </label>
                    <div className="relative">
                      <select
                        id="c-goal"
                        name="goal"
                        required
                        defaultValue=""
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 pr-10 text-white focus:outline-none focus:border-[#C8FF00] transition-colors appearance-none min-h-[44px]"
                      >
                        <option value="" disabled>
                          Select your goal
                        </option>
                        <option value="Lose Weight">Lose Weight</option>
                        <option value="Build Muscle">Build Muscle</option>
                        <option value="Improve Fitness">Improve Fitness</option>
                        <option value="Sport Specific">Sport Specific</option>
                        <option value="Other">Other</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="c-message" className="block text-xs font-bold uppercase tracking-wider text-white/50 mb-2">
                      Message
                    </label>
                    <textarea
                      id="c-message"
                      name="message"
                      required
                      rows={4}
                      placeholder="Tell me a bit about where you are now and what you want to achieve..."
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#C8FF00] transition-colors resize-none"
                    />
                  </div>
                  {error && (
                    <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">{error}</div>
                  )}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#C8FF00] text-black font-bold uppercase tracking-wider py-4 rounded-full hover:scale-[1.01] transition-transform disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                  >
                    {submitting ? "Sending..." : "Send Message"}
                    {!submitting && <ArrowRight className="h-4 w-4" />}
                  </button>
                  <p className="text-xs text-white/40 text-center">By submitting, you agree to be contacted by Jay Mac Fitness about your enquiry.</p>
                </>
              )}
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
          <div>
            <a href="#top" className="font-display text-2xl tracking-wider text-white inline-block mb-4">
              JAYMAC<span className="text-[#C8FF00]">FITNESS</span>
            </a>
            <p className="text-white/50 text-sm leading-relaxed">
              Personal training in Birmingham — online and in-person. Built for results that last.
            </p>
          </div>
          <div>
            <h4 className="font-bold uppercase tracking-wider text-sm text-white mb-4">Explore</h4>
            <nav className="flex flex-col gap-2">
              {[
                ["#services", "Services"],
                ["#how", "How It Works"],
                ["#packages", "Packages"],
                ["#faq", "FAQ"],
                ["#contact", "Contact"],
              ].map(([href, label]) => (
                <a key={href} href={href} className="text-white/60 hover:text-[#C8FF00] text-sm transition-colors">
                  {label}
                </a>
              ))}
            </nav>
          </div>
          <div>
            <h4 className="font-bold uppercase tracking-wider text-sm text-white mb-4">Follow</h4>
            <div className="flex gap-3 mb-4">
              <a
                href="https://instagram.com/jaymacjm"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram @jaymacjm"
                className="h-10 w-10 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:bg-[#C8FF00] hover:text-black hover:border-[#C8FF00] transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://facebook.com/JayPT"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook Jay PT"
                className="h-10 w-10 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:bg-[#C8FF00] hover:text-black hover:border-[#C8FF00] transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
            <p className="text-white/40 text-xs">Instagram @jaymacjm · Facebook Jay PT</p>
          </div>
        </div>
        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row gap-4 items-center justify-between text-xs text-white/40">
          <p>&copy; 2026 JayMacFitness. All rights reserved.</p>
          <p>Foundry Gym, Kings Heath, Birmingham</p>
        </div>
      </div>
    </footer>
  );
}
