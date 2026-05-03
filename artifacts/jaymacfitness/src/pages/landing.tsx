import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { apiGet, apiPost } from "../lib/api";
import amyTransformation from "@assets/amy_trasnformation_1777814405343.jpg";
import dannyJenTransformation from "@assets/dannyandjen_progress_pic_1777814405345.jpg";
import elaineTransformation from "@assets/elaine_transformation_1777814405346.jpg";
import {
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

type PackageType = "IN_PERSON" | "ONLINE" | "GROUP";
type Pkg = {
  id: string;
  name: string;
  type?: PackageType;
  sessions: number;
  price: string;
  pricePerSession?: string | null;
  description?: string;
  highlights?: string[];
  isActive?: boolean;
  featured?: boolean;
};

const PACKAGE_TYPE_LABEL: Record<PackageType, string> = {
  IN_PERSON: "In-Person",
  ONLINE: "Online",
  GROUP: "Group",
};

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
    queryKey: ["packages", "public"],
    queryFn: () => apiGet("/api/packages") as Promise<Pkg[]>,
    staleTime: 60_000,
  });

  return (
    <div className="font-body bg-[#0D1B2A] text-white min-h-screen overflow-x-hidden">
      <Nav />
      <Hero />
      <SocialProof />
      <Results />
      <Services />
      {/* Anchor target for the nav "About" link — points at the process section */}
      <div id="about" aria-hidden="true" />
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
  const [logoFailed, setLogoFailed] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile drawer is open — preserve and restore prior value
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  const links = [
    { href: "#about", label: "About" },
    { href: "#services", label: "Services" },
    { href: "#results", label: "Results" },
    { href: "#packages", label: "Packages" },
    { href: "#faq", label: "FAQ" },
  ];

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={
        scrolled
          ? {
              backgroundColor: "rgba(10,22,40,0.92)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              borderBottom: "1px solid rgba(30,144,255,0.2)",
            }
          : { backgroundColor: "transparent" }
      }
    >
      <div className="container mx-auto px-4 md:px-6 h-16 lg:h-20 flex items-center justify-between">
        {/* Logo */}
        <a href="#top" className="flex items-center gap-2 shrink-0" aria-label="Jay Mac Fitness — Home">
          {!logoFailed ? (
            <img
              src="/images/logo.png"
              alt="Jay Mac Fitness"
              style={{ height: "36px", width: "auto" }}
              onError={() => setLogoFailed(true)}
            />
          ) : (
            <span
              className="text-xl md:text-2xl tracking-wider text-white font-bold italic"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900 }}
            >
              JAYMAC<span style={{ color: "var(--brand-blue, #1E90FF)" }}>FITNESS</span>
            </span>
          )}
        </a>

        {/* Desktop nav links */}
        <nav className="hidden lg:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="nav-link relative text-[13px] uppercase tracking-widest transition-colors"
              style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 600, color: "#C8D8E8" }}
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Right cluster */}
        <div className="hidden lg:flex items-center gap-4 shrink-0">
          <Link
            to="/login"
            className="text-[13px] uppercase tracking-widest transition-colors hover:text-white"
            style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 600, color: "#C8D8E8" }}
          >
            Login
          </Link>
          <a href="#contact" className="btn-primary" style={{ padding: "12px 24px", fontSize: "13px" }}>
            Free Consultation
          </a>
        </div>

        {/* Mobile / tablet hamburger */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden p-2 text-white relative z-50"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile / tablet drawer — animated max-height */}
      <div
        id="mobile-menu"
        className="lg:hidden overflow-hidden transition-[max-height] duration-300 ease-out"
        style={{
          maxHeight: open ? "70vh" : "0px",
          backgroundColor: "rgba(10,22,40,0.98)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        <nav className="container mx-auto px-4 py-2 flex flex-col">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="py-4 text-base uppercase tracking-widest text-white"
              style={{
                fontFamily: "'Barlow', sans-serif",
                fontWeight: 600,
                borderBottom: "1px solid rgba(30,144,255,0.2)",
              }}
            >
              {l.label}
            </a>
          ))}
          <Link
            to="/login"
            onClick={() => setOpen(false)}
            className="py-4 text-base uppercase tracking-widest text-white"
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontWeight: 600,
              borderBottom: "1px solid rgba(30,144,255,0.2)",
            }}
          >
            Login
          </Link>
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="btn-primary mt-4 mb-4 w-full text-center"
            style={{ padding: "14px 24px" }}
          >
            Book Free Consult
          </a>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  const [heroImgFailed, setHeroImgFailed] = useState(false);
  // Fallback to the existing portrait image if hero-training.jpg isn't uploaded yet
  const heroImgSrc = heroImgFailed ? "/images/jay-portrait.jpeg" : "/images/hero-training.jpg";

  return (
    <section
      id="top"
      className="relative w-full overflow-hidden"
      style={{ minHeight: "100dvh", backgroundColor: "var(--brand-navy, #0D1B2A)" }}
    >
      {/* Mobile-only background image with overlay */}
      <div className="absolute inset-0 lg:hidden pointer-events-none">
        <img
          src={heroImgSrc}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover opacity-40"
          onError={() => !heroImgFailed && setHeroImgFailed(true)}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(13,27,42,0.85) 0%, rgba(13,27,42,0.92) 60%, rgba(13,27,42,1) 100%)",
          }}
        />
      </div>

      <div
        className="relative z-10 container mx-auto px-4 md:px-6 grid lg:grid-cols-[55fr_45fr] gap-8 lg:gap-12 items-center"
        style={{ minHeight: "100dvh", paddingTop: "96px", paddingBottom: "64px" }}
      >
        {/* LEFT — text */}
        <div className="flex flex-col justify-center">
          <p
            className="fade-up uppercase mb-5 md:mb-6"
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontWeight: 600,
              fontSize: "13px",
              letterSpacing: "0.18em",
              color: "var(--brand-blue, #1E90FF)",
            }}
          >
            Personal Training · UK &amp; Worldwide
          </p>

          <h1
            className="fade-up delay-1 text-white"
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 900,
              fontStyle: "italic",
              fontSize: "clamp(58px, 9vw, 88px)",
              lineHeight: 0.95,
              letterSpacing: "-0.01em",
              textTransform: "uppercase",
            }}
          >
            The person<br />
            you want<br />
            to become<br />
            <span style={{ color: "var(--brand-blue, #1E90FF)" }}>exists.</span>
          </h1>

          <p
            className="fade-up delay-2 mt-6 md:mt-8"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "18px",
              lineHeight: 1.6,
              color: "#C8D8E8",
              maxWidth: "480px",
            }}
          >
            13 years. 200+ transformations. One trainer who actually gives a damn about your results — in the gym, online, or anywhere in the world.
          </p>

          <div className="fade-up delay-3 mt-8 flex flex-wrap items-center" style={{ gap: "16px" }}>
            <a
              href="#contact"
              className="btn-primary inline-flex items-center justify-center"
              style={{ padding: "16px 32px", fontSize: "15px" }}
            >
              Start Your Transformation
            </a>
            <a
              href="#results"
              className="btn-ghost inline-flex items-center justify-center gap-2"
              style={{ padding: "16px 28px", fontSize: "15px" }}
            >
              See Real Results
              <ChevronDown className="h-4 w-4" />
            </a>
          </div>

          <ul
            className="fade-up delay-4 mt-8 flex flex-wrap items-center"
            style={{
              gap: "24px",
              fontFamily: "'Inter', sans-serif",
              fontSize: "13px",
              color: "#C8D8E8",
              listStyle: "none",
              padding: 0,
            }}
          >
            {[
              "Free first consultation",
              "No contracts",
              "100+ five-star reviews",
            ].map((item) => (
              <li key={item} className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" style={{ color: "var(--brand-blue, #1E90FF)" }} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* RIGHT — image area (desktop only; mobile uses background above) */}
        <div className="hidden lg:flex items-center justify-center fade-up delay-2">
          <div className="relative w-full" style={{ aspectRatio: "4 / 5", maxWidth: "520px" }}>
            {/* Floating blue glow behind image */}
            <div
              aria-hidden="true"
              className="absolute pointer-events-none"
              style={{
                width: "600px",
                height: "600px",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                background:
                  "radial-gradient(circle, rgba(30,144,255,0.25) 0%, rgba(30,144,255,0) 70%)",
                zIndex: 0,
              }}
            />
            <div
              className="relative w-full h-full overflow-hidden"
              style={{
                backgroundColor: "#112240",
                border: "1px solid rgba(30,144,255,0.3)",
                borderRadius: "4px",
                zIndex: 1,
              }}
            >
              {!heroImgFailed || heroImgSrc !== "/images/hero-training.jpg" ? (
                <img
                  src={heroImgSrc}
                  alt="Jay Mac in personal training session"
                  className="w-full h-full object-cover"
                  style={{ borderRadius: "4px" }}
                  onError={() => !heroImgFailed && setHeroImgFailed(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-center px-6">
                  <span
                    style={{
                      fontFamily: "'Barlow', sans-serif",
                      fontWeight: 600,
                      fontSize: "13px",
                      letterSpacing: "0.18em",
                      color: "rgba(200,216,232,0.6)",
                      textTransform: "uppercase",
                    }}
                  >
                    Hero image — upload /images/hero-training.jpg
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bouncing chevron — scrolls to #proof */}
      <a
        href="#proof"
        aria-label="Scroll to social proof"
        className="hero-chevron absolute left-1/2 -translate-x-1/2 z-10"
        style={{ bottom: "24px", color: "var(--brand-blue, #1E90FF)" }}
      >
        <ChevronDown className="h-7 w-7" />
      </a>
    </section>
  );
}

function useCountUp(target: number, durationMs = 1500) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    let rafId = 0;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting || startedRef.current) return;
          startedRef.current = true;
          obs.disconnect();

          if (reduceMotion) {
            setValue(target);
            return;
          }
          const start = performance.now();
          const tick = (now: number) => {
            const t = Math.min(1, (now - start) / durationMs);
            // ease-out cubic
            const eased = 1 - Math.pow(1 - t, 3);
            setValue(Math.round(target * eased));
            if (t < 1) rafId = requestAnimationFrame(tick);
            else setValue(target);
          };
          rafId = requestAnimationFrame(tick);
        });
      },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [target, durationMs]);

  return { ref, value };
}

function ProofStat({
  target,
  suffix = "",
  label,
}: {
  target: number;
  suffix?: string;
  label: string;
}) {
  const { ref, value } = useCountUp(target);
  return (
    <div className="flex flex-col items-center justify-center text-center px-4 py-2">
      <span
        ref={ref}
        style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontStyle: "italic",
          fontWeight: 900,
          fontSize: "clamp(48px, 7vw, 68px)",
          lineHeight: 1,
          color: "var(--brand-blue, #1E90FF)",
          letterSpacing: "-0.01em",
        }}
      >
        {value}
        {suffix}
      </span>
      <span
        className="mt-2 uppercase text-white"
        style={{
          fontFamily: "'Barlow', sans-serif",
          fontWeight: 600,
          fontSize: "13px",
          letterSpacing: "0.12em",
        }}
      >
        {label}
      </span>
    </div>
  );
}

function SocialProof() {
  const stats = [
    { target: 13, suffix: "+", label: "Years Experience" },
    { target: 200, suffix: "+", label: "Clients Transformed" },
    { target: 100, suffix: "+", label: "Five-Star Reviews" },
    { target: 3, suffix: "", label: "Training Formats" },
  ];
  return (
    <section
      id="proof"
      className="w-full"
      style={{
        background: "linear-gradient(135deg, #112240 0%, #0D1B2A 100%)",
        borderTop: "1px solid rgba(30,144,255,0.2)",
        borderBottom: "1px solid rgba(30,144,255,0.2)",
      }}
    >
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-10 lg:gap-y-0">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={i > 0 ? "lg:border-l" : ""}
              style={i > 0 ? { borderColor: "rgba(30,144,255,0.3)" } : undefined}
            >
              <ProofStat target={s.target} suffix={s.suffix} label={s.label} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  // Uses the global scroll-reveal observer in src/utils/scrollReveal.ts which
  // adds the `visible` class to any `.reveal` element when it enters viewport.
  return (
    <div className="reveal" style={{ transitionDelay: `${delay}s` }}>
      {children}
    </div>
  );
}

const WHAT_I_DO = [
  {
    title: "1-2-1 Personal Training",
    body:
      "You get my full attention. Every session is built around you — your body, your pace, your goals. No programme pulled from a shelf. If it doesn't challenge you, it changes.",
    href: "#packages",
  },
  {
    title: "Group Training",
    body:
      "Accountability multiplied. My small-group sessions bring the intensity of personal training with the energy of a team around you. Cheaper than 1-2-1. More powerful than a gym class.",
    href: "#packages",
  },
  {
    title: "Outdoor Training",
    body:
      "Fresh air, no machines, zero excuses. Outdoor sessions use your environment as the gym. It's harder, it's different, and it works when the walls of a gym start feeling like a cage.",
    href: "#contact",
  },
  {
    title: "Online Coaching",
    body:
      "Time zones don't matter. If you have a phone and 45 minutes, I can train you. Custom plans, video check-ins, and a WhatsApp line to me directly. I've transformed clients in five countries.",
    href: "#contact",
  },
];

type Transformation = {
  name: string;
  result: string;
  detail: string;
  quote: string;
  image: string;
};

const TRANSFORMATIONS: Transformation[] = [
  {
    name: "Amy K.",
    result: "LOST 3 STONE",
    detail: "14 weeks · 1-2-1 Training",
    quote:
      "I'd tried every diet and every gym. Jay was the first person who actually listened, built a plan around my life, and held me to it. Three stone down and I've kept it off.",
    image: amyTransformation,
  },
  {
    name: "Danny & Jen",
    result: "6 STONE BETWEEN THEM",
    detail: "6 months · Couples Training",
    quote:
      "Training together with Jay changed our marriage. We pushed each other, we got fitter together, and six stone later we're stronger than we've ever been — in every sense.",
    image: dannyJenTransformation,
  },
  {
    name: "Elaine T.",
    result: "BACK STRONGER THAN EVER",
    detail: "Post-injury rehab & training",
    quote:
      "After my injury I thought I was finished with the gym. Jay rebuilt me from the ground up — patient, methodical, never rushed. I'm lifting more now than before I got hurt.",
    image: elaineTransformation,
  },
];

function TransformationCard({
  t,
  index,
}: {
  t: Transformation;
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <article
      className="results-card reveal flex flex-col h-full"
      style={{
        transitionDelay: `${index * 0.08}s`,
        backgroundColor: "#112240",
        border: "1px solid #1A3A5C",
        borderRadius: "4px",
        overflow: "hidden",
      }}
    >
      {/* Before / after composite photo */}
      <div
        className="relative w-full"
        style={{ height: "320px", backgroundColor: "#0A1628" }}
      >
        <img
          src={t.image}
          alt={`${t.name} — before and after transformation`}
          loading="lazy"
          className="absolute inset-0 w-full h-full"
          style={{ objectFit: "cover", objectPosition: "center top" }}
        />
        {/* Top-left BEFORE / top-right AFTER labels for clarity */}
        <span
          aria-hidden="true"
          className="absolute"
          style={{
            top: "12px",
            left: "12px",
            fontFamily: "'Barlow', sans-serif",
            fontWeight: 700,
            fontSize: "10px",
            letterSpacing: "0.18em",
            color: "#FFFFFF",
            backgroundColor: "rgba(13,27,42,0.78)",
            padding: "4px 8px",
            borderRadius: "2px",
            textTransform: "uppercase",
          }}
        >
          Before
        </span>
        <span
          aria-hidden="true"
          className="absolute"
          style={{
            top: "12px",
            right: "12px",
            fontFamily: "'Barlow', sans-serif",
            fontWeight: 700,
            fontSize: "10px",
            letterSpacing: "0.18em",
            color: "#FFFFFF",
            backgroundColor: "rgba(30,144,255,0.92)",
            padding: "4px 8px",
            borderRadius: "2px",
            textTransform: "uppercase",
            boxShadow: "0 0 12px rgba(30,144,255,0.4)",
          }}
        >
          After
        </span>
      </div>

      {/* Card body */}
      <div
        className="flex flex-col flex-1"
        style={{ padding: "24px" }}
      >
        <h3
          className="text-white"
          style={{
            fontFamily: "'Barlow', sans-serif",
            fontWeight: 700,
            fontSize: "18px",
            lineHeight: 1.25,
            marginBottom: "8px",
          }}
        >
          {t.name}
        </h3>
        <p
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 900,
            fontStyle: "italic",
            fontSize: "32px",
            lineHeight: 1.05,
            color: "var(--brand-blue, #1E90FF)",
            textTransform: "uppercase",
            letterSpacing: "-0.005em",
          }}
        >
          {t.result}
        </p>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "13px",
            lineHeight: 1.5,
            color: "#C8D8E8",
            marginTop: "6px",
          }}
        >
          {t.detail}
        </p>
        <div
          className="flex items-center gap-1"
          aria-label="5 out of 5 stars"
          style={{ marginTop: "12px" }}
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className="h-4 w-4"
              style={{
                color: "var(--brand-blue, #1E90FF)",
                fill: "var(--brand-blue, #1E90FF)",
              }}
              aria-hidden="true"
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className={expanded ? "" : "clamp-2"}
          style={{
            fontFamily: "'Inter', sans-serif",
            fontStyle: "italic",
            fontSize: "14px",
            lineHeight: 1.6,
            color: "#C8D8E8",
            marginTop: "14px",
            background: "transparent",
            border: "none",
            padding: 0,
            textAlign: "left",
            cursor: "pointer",
            width: "100%",
          }}
        >
          “{t.quote}”
        </button>
      </div>
    </article>
  );
}

function Results() {
  return (
    <section
      id="results"
      className="py-20 md:py-28"
      style={{ backgroundColor: "#0A1628" }}
    >
      <div className="container mx-auto px-4 md:px-6">
        {/* Section header */}
        <div className="max-w-4xl mb-12 md:mb-16 reveal text-center md:text-left mx-auto md:mx-0">
          <p
            className="uppercase mb-4"
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontWeight: 600,
              fontSize: "13px",
              letterSpacing: "0.2em",
              color: "var(--brand-blue, #1E90FF)",
            }}
          >
            Transformations
          </p>
          <h2
            className="text-white"
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 900,
              fontStyle: "italic",
              fontSize: "clamp(52px, 7.2vw, 72px)",
              lineHeight: 1.0,
              letterSpacing: "-0.005em",
              textTransform: "uppercase",
            }}
          >
            200+ People Who
            <br />
            Thought They
            <br />
            Couldn't.
          </h2>
          <p
            className="mt-5"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "17px",
              lineHeight: 1.6,
              color: "#C8D8E8",
              maxWidth: "620px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Real clients. Real timelines. Real results — built one honest session at a time.
          </p>
        </div>

        {/* Three transformation cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {TRANSFORMATIONS.map((t, i) => (
            <TransformationCard key={t.name} t={t} index={i} />
          ))}
        </div>

        {/* Full-width CTA band */}
        <div
          className="reveal results-cta"
          style={{
            transitionDelay: `${TRANSFORMATIONS.length * 0.08}s`,
            marginTop: "48px",
            padding: "40px",
            borderRadius: "4px",
            border: "1px solid rgba(30,144,255,0.25)",
            backgroundImage:
              "linear-gradient(135deg, rgba(30,144,255,0.18) 0%, rgba(17,34,64,0.6) 60%, rgba(10,22,40,0.6) 100%)",
          }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="text-center md:text-left">
              <p
                className="text-white"
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 900,
                  fontStyle: "italic",
                  fontSize: "clamp(30px, 4.2vw, 38px)",
                  lineHeight: 1.05,
                  letterSpacing: "-0.005em",
                  textTransform: "uppercase",
                }}
              >
                Your Name Could Be Here.
              </p>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "15px",
                  lineHeight: 1.6,
                  color: "#C8D8E8",
                  marginTop: "8px",
                }}
              >
                Free consultation. No pressure. Just a plan that actually works.
              </p>
            </div>
            <a
              href="#contact"
              className="btn-primary"
              style={{ whiteSpace: "nowrap", fontSize: "15px", padding: "16px 36px" }}
            >
              I'm Ready — Let's Go
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section
      id="services"
      className="py-20 md:py-28"
      style={{ backgroundColor: "#0A1628" }}
    >
      <div className="container mx-auto px-4 md:px-6">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16 reveal">
          <p
            className="uppercase mb-4"
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontWeight: 600,
              fontSize: "13px",
              letterSpacing: "0.2em",
              color: "var(--brand-blue, #1E90FF)",
            }}
          >
            The Service
          </p>
          <h2
            className="text-white"
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 900,
              fontStyle: "italic",
              fontSize: "clamp(40px, 6vw, 64px)",
              lineHeight: 1.02,
              letterSpacing: "-0.005em",
              textTransform: "uppercase",
            }}
          >
            How We Train Together
          </h2>
          <p
            className="mt-5 mx-auto"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "16px",
              lineHeight: 1.6,
              color: "#C8D8E8",
              maxWidth: "560px",
            }}
          >
            In the gym. Outside. Online. No matter where you are — there's no excuse not to start.
          </p>
        </div>

        {/* 2x2 service cards */}
        <div className="grid gap-5 md:gap-6 md:grid-cols-2 max-w-5xl mx-auto">
          {WHAT_I_DO.map((s, i) => {
            const num = String(i + 1).padStart(2, "0");
            return (
              <a
                key={s.title}
                href={s.href}
                className="service-card reveal block h-full"
                style={{
                  transitionDelay: `${i * 0.08}s`,
                  backgroundColor: "#112240",
                  border: "1px solid #1A3A5C",
                  borderRadius: "4px",
                  padding: "32px",
                  textDecoration: "none",
                }}
              >
                <span
                  aria-hidden="true"
                  className="block"
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 900,
                    fontStyle: "italic",
                    fontSize: "48px",
                    lineHeight: 1,
                    color: "var(--brand-blue, #1E90FF)",
                    opacity: 0.4,
                    marginBottom: "16px",
                  }}
                >
                  {num}
                </span>
                <h3
                  className="text-white"
                  style={{
                    fontFamily: "'Barlow', sans-serif",
                    fontWeight: 700,
                    fontSize: "22px",
                    lineHeight: 1.25,
                    marginBottom: "12px",
                  }}
                >
                  {s.title}
                </h3>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "15px",
                    lineHeight: 1.65,
                    color: "#C8D8E8",
                    marginBottom: "20px",
                  }}
                >
                  {s.body}
                </p>
                <span
                  className="service-card__cta inline-flex items-center gap-2"
                  style={{
                    fontFamily: "'Barlow', sans-serif",
                    fontWeight: 700,
                    fontSize: "14px",
                    color: "var(--brand-blue, #1E90FF)",
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                  }}
                >
                  Find Out More
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="how" className="py-20 md:py-32 bg-[#0D1B2A] border-t border-white/5">
      <div className="container mx-auto px-4 md:px-6">
        <Reveal>
          <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
            <p className="text-[#1E90FF] font-bold uppercase tracking-[0.2em] text-sm mb-4">The Process</p>
            <h2 className="headline text-5xl md:text-7xl leading-none">HOW IT WORKS</h2>
          </div>
        </Reveal>

        <div className="max-w-5xl mx-auto space-y-12 md:space-y-20">
          {STEPS.map((step, i) => {
            const reversed = i % 2 === 1;
            return (
              <Reveal key={step.title} delay={i * 0.05}>
                <div className={`flex flex-col ${reversed ? "md:flex-row-reverse" : "md:flex-row"} items-center gap-8 md:gap-12`}>
                  <div className="flex-shrink-0 relative">
                    <div className="h-32 w-32 md:h-40 md:w-40 rounded-2xl bg-[#1E90FF] flex items-center justify-center shadow-[0_8px_32px_rgba(30,144,255,0.25)]">
                      <step.icon className="h-14 w-14 md:h-16 md:w-16 text-white" strokeWidth={2} />
                    </div>
                    <div className="absolute -top-3 -right-3 h-12 w-12 rounded-full bg-[#0D1B2A] border-2 border-[#1E90FF] flex items-center justify-center">
                      <span className="headline text-xl text-[#1E90FF]">0{i + 1}</span>
                    </div>
                  </div>
                  <div className={`flex-1 text-center ${reversed ? "md:text-right" : "md:text-left"}`}>
                    <h3 className="headline text-3xl md:text-5xl mb-3 tracking-wide">{step.title}</h3>
                    <p className="text-[#C8D8E8]/70 text-lg leading-relaxed max-w-xl mx-auto md:mx-0">{step.desc}</p>
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

function formatGbp(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === "") return "—";
  const n = Number(value);
  if (!Number.isFinite(n)) return "—";
  return Number.isInteger(n) ? `£${n}` : `£${n.toFixed(2)}`;
}

function PackageCard({ pkg, index }: { pkg: Pkg; index: number }) {
  const featured = !!pkg.featured;
  const typeLabel = pkg.type ? PACKAGE_TYPE_LABEL[pkg.type] : "In-Person";
  const highlights =
    pkg.highlights && pkg.highlights.length > 0
      ? pkg.highlights
      : [`${pkg.sessions} x 60-minute sessions`, "Personalised training plan", "Nutrition guidance included"];
  const perSession = pkg.pricePerSession ?? (pkg.sessions > 0 ? Number(pkg.price) / pkg.sessions : null);

  return (
    <Reveal delay={index * 0.08}>
      <div
        className="relative h-full flex flex-col"
        style={{
          background: featured
            ? "linear-gradient(160deg, #112240 0%, #1A3A5C 100%)"
            : "#112240",
          border: featured ? "2px solid #1E90FF" : "1px solid #1A3A5C",
          borderRadius: "4px",
          padding: "28px",
          boxShadow: featured
            ? "0 0 40px rgba(30,144,255,0.25), inset 0 0 0 1px rgba(30,144,255,0.15)"
            : "none",
          transition: "transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease",
        }}
      >
        {featured && (
          <div
            className="absolute"
            style={{
              top: "-14px",
              left: "50%",
              transform: "translateX(-50%)",
              background: "#1E90FF",
              color: "#fff",
              fontFamily: "'Barlow', sans-serif",
              fontWeight: 700,
              fontSize: "11px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              padding: "6px 14px",
              borderRadius: "2px",
              boxShadow: "0 4px 16px rgba(30,144,255,0.45)",
              whiteSpace: "nowrap",
            }}
          >
            Most Popular
          </div>
        )}

        {/* Header: name + type pill */}
        <div className="flex items-start justify-between gap-3 mb-5">
          <h3
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontWeight: 700,
              fontSize: "20px",
              lineHeight: 1.2,
              color: "#fff",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            {pkg.name}
          </h3>
          <span
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontWeight: 700,
              fontSize: "11px",
              color: "#1E90FF",
              border: "1px solid rgba(30,144,255,0.5)",
              padding: "4px 10px",
              borderRadius: "2px",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              whiteSpace: "nowrap",
            }}
          >
            {typeLabel}
          </span>
        </div>

        {/* Price block */}
        <div className="mb-2">
          <span
            className="headline"
            style={{
              fontSize: featured ? "60px" : "52px",
              lineHeight: 1,
              color: featured ? "#1E90FF" : "#fff",
              display: "inline-block",
            }}
          >
            {formatGbp(pkg.price)}
          </span>
        </div>
        <div
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "13px",
            color: "#C8D8E8",
            opacity: 0.85,
            marginBottom: "4px",
          }}
        >
          {perSession != null ? `${formatGbp(perSession)} per session` : "\u00A0"}
        </div>
        <div
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "13px",
            color: "#C8D8E8",
            opacity: 0.7,
            marginBottom: "20px",
          }}
        >
          {pkg.sessions} {pkg.sessions === 1 ? "session" : "sessions"}
        </div>

        <div
          style={{
            height: "1px",
            background: "rgba(30,144,255,0.18)",
            marginBottom: "20px",
          }}
        />

        {/* Highlights */}
        <ul className="space-y-3 mb-8 flex-1">
          {highlights.map((h) => (
            <li key={h} className="flex items-start gap-3">
              <CheckCircle2
                className="h-4 w-4 flex-shrink-0"
                style={{ color: "#1E90FF", marginTop: "3px" }}
                aria-hidden="true"
              />
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "14px",
                  lineHeight: 1.55,
                  color: "#C8D8E8",
                }}
              >
                {h}
              </span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <a
          href="#contact"
          className={featured ? "btn-primary" : "btn-ghost"}
          style={{ display: "block", width: "100%", textAlign: "center" }}
        >
          {featured ? "Start Transforming" : "Get Started"}
        </a>

        {featured && (
          <div
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "12px",
              color: "#4DAAFF",
              textAlign: "center",
              marginTop: "12px",
              letterSpacing: "0.02em",
            }}
          >
            Next available slot: this week
          </div>
        )}
      </div>
    </Reveal>
  );
}

function Packages({ packages }: { packages: Pkg[] }) {
  // Featured first, then by session count. Cap to 4 cards per the brief.
  const ordered = [...packages]
    .sort((a, b) => {
      if (!!b.featured !== !!a.featured) return b.featured ? 1 : -1;
      return a.sessions - b.sessions;
    })
    .slice(0, 4);

  return (
    <section id="packages" className="py-20 md:py-32 bg-[#0D1B2A] border-t border-white/5 relative">
      <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none" />
      <div className="container mx-auto px-4 md:px-6 relative">
        <Reveal>
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-20">
            <p className="text-[#1E90FF] font-bold uppercase tracking-[0.2em] text-sm mb-4">
              Invest In Yourself
            </p>
            <h2 className="headline text-5xl md:text-7xl leading-none">CHOOSE YOUR STARTING POINT.</h2>
            <p
              className="mt-6"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "16px",
                lineHeight: 1.6,
                color: "#C8D8E8",
                opacity: 0.85,
              }}
            >
              Real coaching. Real plans. Real results — pick the package that fits where you are right now.
            </p>
          </div>
        </Reveal>

        {ordered.length === 0 ? (
          <p className="text-center text-[#C8D8E8]/60">Packages coming soon.</p>
        ) : (
          <div className="grid gap-6 md:gap-7 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto items-stretch">
            {ordered.map((pkg, i) => (
              <PackageCard key={pkg.id} pkg={pkg} index={i} />
            ))}
          </div>
        )}

        <Reveal delay={0.2}>
          <div className="text-center mt-14 md:mt-20 max-w-2xl mx-auto">
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "16px",
                color: "#C8D8E8",
                opacity: 0.85,
              }}
            >
              Not sure which is right for you?{" "}
              <a
                href="#contact"
                style={{
                  color: "#1E90FF",
                  fontWeight: 600,
                  textDecoration: "underline",
                  textUnderlineOffset: "3px",
                }}
              >
                Book a free consultation first — zero pressure, zero commitment.
              </a>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Testimonials() {
  const [active, setActive] = useState(0);
  return (
    <section className="py-20 md:py-32 bg-[#0D1B2A] border-t border-white/5">
      <div className="container mx-auto px-4 md:px-6">
        <Reveal>
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-20">
            <p className="text-[#1E90FF] font-bold uppercase tracking-[0.2em] text-sm mb-4">Real People. Real Results.</p>
            <h2 className="headline text-5xl md:text-7xl leading-none">WHAT CLIENTS SAY</h2>
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
                className={`h-2 rounded-full transition-all ${active === i ? "bg-[#1E90FF] w-8" : "bg-white/20 w-2"}`}
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
    <div className="h-full border border-white/10 rounded-2xl p-8 bg-white/[0.02] hover:border-[#1E90FF]/30 transition-colors">
      <div className="flex gap-1 mb-6">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="h-5 w-5 fill-[#1E90FF] text-[#1E90FF]" />
        ))}
      </div>
      <p className="text-white/85 leading-relaxed mb-6 text-lg">&ldquo;{t.quote}&rdquo;</p>
      <div className="border-t border-white/10 pt-4">
        <div className="font-bold text-white">{t.name}</div>
        <div className="text-sm text-[#C8D8E8]/60">{t.detail}</div>
      </div>
    </div>
  );
}

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="py-20 md:py-32 bg-[#0A1628] border-t border-white/5">
      <div className="container mx-auto px-4 md:px-6">
        <Reveal>
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
            <p className="text-[#1E90FF] font-bold uppercase tracking-[0.2em] text-sm mb-4">Questions</p>
            <h2 className="headline text-5xl md:text-7xl leading-none">FAQ</h2>
          </div>
        </Reveal>
        <div className="max-w-3xl mx-auto space-y-3">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={f.q} delay={i * 0.04}>
                <div className={`border rounded-xl overflow-hidden bg-white/[0.02] transition-colors ${isOpen ? "border-[#1E90FF]/40" : "border-white/10"}`}>
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-4 p-5 md:p-6 text-left hover:bg-white/[0.03] transition-colors"
                    aria-expanded={isOpen}
                  >
                    <span className="font-bold text-base md:text-lg">{f.q}</span>
                    <ChevronDown
                      className={`h-5 w-5 text-[#1E90FF] flex-shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  <div
                    className={`grid transition-all duration-300 ease-out ${
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 md:px-6 pb-5 md:pb-6 text-[#C8D8E8]/75 leading-relaxed">{f.a}</p>
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
    <section id="contact" className="py-20 md:py-32 bg-[#0D1B2A] border-t border-white/5">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 max-w-6xl mx-auto">
          <div>
            <Reveal>
              <p className="text-[#1E90FF] font-bold uppercase tracking-[0.2em] text-sm mb-4">Get In Touch</p>
              <h2 className="headline text-5xl md:text-7xl leading-none mb-6">
                READY TO
                <br />
                <span className="text-[#1E90FF]">START?</span>
              </h2>
              <p className="text-[#C8D8E8]/75 text-lg leading-relaxed mb-8">
                Send a message and I'll reply within 24 hours to book your free consultation. No pressure, no spam.
              </p>

              <div className="space-y-4 mb-8">
                <a href="mailto:hello@jaymacfitness.co.uk" className="flex items-center gap-4 text-white/80 hover:text-[#1E90FF] transition-colors">
                  <div className="h-10 w-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-[#1E90FF]" />
                  </div>
                  <span>hello@jaymacfitness.co.uk</span>
                </a>
                <a href="tel:+447700900000" className="flex items-center gap-4 text-white/80 hover:text-[#1E90FF] transition-colors">
                  <div className="h-10 w-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                    <Phone className="h-5 w-5 text-[#1E90FF]" />
                  </div>
                  <span>+44 7700 900000</span>
                </a>
                <div className="flex items-center gap-4 text-white/80">
                  <div className="h-10 w-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-[#1E90FF]" />
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
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-[#1E90FF]/10 border border-[#1E90FF]/30 mb-6">
                    <CheckCircle2 className="h-8 w-8 text-[#1E90FF]" />
                  </div>
                  <h3 className="headline text-3xl md:text-4xl mb-3">MESSAGE SENT</h3>
                  <p className="text-[#C8D8E8]/75 mb-6">
                    Thanks for reaching out. I'll be in touch within 24 hours to book your free consultation.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSuccess(false)}
                    className="text-[#1E90FF] font-bold uppercase tracking-wider text-sm hover:underline"
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
                      className="w-full bg-[#0A1628]/70 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#1E90FF] transition-colors min-h-[44px]"
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
                        className="w-full bg-[#0A1628]/70 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#1E90FF] transition-colors min-h-[44px]"
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
                        className="w-full bg-[#0A1628]/70 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#1E90FF] transition-colors min-h-[44px]"
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
                        className="w-full bg-[#0A1628]/70 border border-white/10 rounded-xl px-4 py-3 pr-10 text-white focus:outline-none focus:border-[#1E90FF] transition-colors appearance-none min-h-[44px]"
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
                      className="w-full bg-[#0A1628]/70 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#1E90FF] transition-colors resize-none"
                    />
                  </div>
                  {error && (
                    <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">{error}</div>
                  )}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#1E90FF] text-white font-bold uppercase tracking-wider py-4 rounded-full hover:bg-[#4DAAFF] hover:shadow-[0_8px_32px_rgba(30,144,255,0.35)] transition-all disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
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
    <footer className="bg-[#08111E] border-t border-white/10 py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
          <div>
            <a href="#top" className="headline text-2xl tracking-wider text-white inline-block mb-4">
              JAYMAC<span className="text-[#1E90FF]">FITNESS</span>
            </a>
            <p className="text-[#C8D8E8]/55 text-sm leading-relaxed">
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
                <a key={href} href={href} className="text-[#C8D8E8]/65 hover:text-[#1E90FF] text-sm transition-colors">
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
                className="h-10 w-10 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:bg-[#1E90FF] hover:text-white hover:border-[#1E90FF] transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://facebook.com/JayPT"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook Jay PT"
                className="h-10 w-10 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:bg-[#1E90FF] hover:text-white hover:border-[#1E90FF] transition-colors"
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
