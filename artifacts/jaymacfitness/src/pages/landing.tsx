import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { apiGet, apiPost } from "../lib/api";
import { SITE_CONFIG } from "../config";
import { trackBookingClick } from "../lib/tracking";
import { Footer } from "../components/Footer";
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
  XCircle,
  Minus,
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
  stripeLink?: string | null;
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
  { icon: Trophy, title: "Keep the results", desc: "Stronger, fitter, leaner — and the habits to hold it long after we're done. That's the whole point." },
];

type Review = {
  name: string;
  photo: string | null;
  text: string;
  relativePublishTimeDescription: string;
  rating: number;
};

type ReviewsResponse = {
  rating: number;
  userRatingCount: number;
  reviews: Review[];
  live: boolean;
};

const FAQS = [
  { q: "What areas do you cover?", a: "I'm based at Foundry Gym in Kings Heath and primarily coach clients across South and Central Birmingham. Online coaching is available worldwide." },
  { q: "I'm really unfit. Will I embarrass myself?", a: "The first session's the hardest part — after that it's just progress. Meeting you where you are is literally the job." },
  { q: "Do you offer online training?", a: "Yes. Online clients get a fully bespoke training programme, weekly video check-ins and direct WhatsApp access to me between sessions." },
  { q: "How do I get started?", a: "Book a free chat or send me an enquiry. We'll talk through your goals, training history and what has held you back, then choose a sensible starting point." },
  { q: "What should I bring to a session?", a: "Comfortable training kit, indoor trainers, a water bottle and a towel. That's it — everything else is provided at the gym." },
  { q: "Are nutrition plans included?", a: "Monthly 1-2-1 coaching includes bespoke nutrition guidance. Every other option gets practical guidance that fits your day-to-day life." },
  { q: "How do I pay?", a: "Fresh Start and blocks are paid up-front. Monthly coaching is direct debit, with no contract and 14 days' notice to pause." },
  { q: "What if I'm on holiday or miss a session?", a: "Life happens. Reschedule with notice, pause the direct debit, shift your sessions. It's training, not a subscription trap." },
  { q: "Do I need a Foundry Gym membership?", a: "[Jay to confirm: add the Foundry Gym membership requirement here before publishing.]" },
  { q: "I've got an old injury.", a: "Rehab-aware programming is a big part of what I do — happy to work alongside your physio. We'll cover it properly in your free chat." },
  { q: "What happens when a block ends?", a: "Carry on monthly, drop to maintenance, or take the habits and fly. Either way the results are yours to keep." },
];

export default function Landing() {
  const { data: packages = [] } = useQuery<Pkg[]>({
    queryKey: ["packages", "public"],
    queryFn: () => apiGet("/api/packages") as Promise<Pkg[]>,
    staleTime: 60_000,
  });

  const [paidBanner, setPaidBanner] = useState<string | null>(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("paid") === "1") {
      const raw = params.get("pkg") || "your package";
      // Cap length to keep the banner sane even if the URL is tampered with.
      // (React already escapes the value, so it's safe text — this is just UX.)
      setPaidBanner(raw.slice(0, 60));
      const url = new URL(window.location.href);
      url.searchParams.delete("paid");
      url.searchParams.delete("pkg");
      window.history.replaceState({}, "", url.toString());
    }
  }, []);

  return (
    <>
    <main className="font-body bg-[#0D1B2A] text-white min-h-screen overflow-x-hidden">
      {paidBanner && (
        <div
          role="status"
          style={{
            position: "fixed",
            top: 16,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 100,
            background: "#112240",
            border: "1px solid #1E90FF",
            color: "#fff",
            padding: "14px 22px",
            borderRadius: 10,
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
            maxWidth: "90vw",
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <span>
            ✅ Payment received for <strong>{paidBanner}</strong>. Jay will be
            in touch shortly to schedule your sessions.
          </span>
          <button
            type="button"
            onClick={() => setPaidBanner(null)}
            aria-label="Dismiss"
            style={{
              background: "transparent",
              color: "#9fb6cf",
              border: "none",
              cursor: "pointer",
              fontSize: 18,
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>
      )}
      <Nav />
      <Hero />
      <SocialProof />
      <Results />
      <AboutJaySection />
      <Services />
      <BootcampWaitlist />
      {/* Anchor target for the nav "About" link — points at the process section */}
      <div id="about" aria-hidden="true" />
      <HowItWorks />
      <Packages packages={packages} />
      <ReviewsWall />
      <ComparisonTables />
      <FAQ />
      <Contact />
    </main>
    <Footer />
    </>
  );
}

function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile drawer is open — preserve and restore prior value
  useEffect(() => {
    if (typeof document === "undefined") return;
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
        <a href="#top" className="flex items-center gap-2 shrink-0" aria-label="High Performance Fit — Home">
          {!logoFailed ? (
            <img
              src="/images/hpf-logo.png"
              alt="High Performance Fit"
              style={{ height: "44px", width: "66px", objectFit: "contain" }}
              onError={() => setLogoFailed(true)}
            />
          ) : (
            <span
              className="text-xl md:text-2xl tracking-wider text-white font-bold italic"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900 }}
            >
              HP<span style={{ color: "var(--brand-blue, #1E90FF)" }}>FIT</span>
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
          <a href={SITE_CONFIG.BOOKING_URL} onClick={() => trackBookingClick("Free consultation", "navigation")} className="btn-primary" style={{ padding: "12px 24px", fontSize: "13px" }}>
            Book a free chat
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
            href={SITE_CONFIG.BOOKING_URL}
            onClick={() => {
              trackBookingClick("Book a free chat", "mobile-navigation");
              setOpen(false);
            }}
            className="btn-primary mt-4 mb-4 w-full text-center"
            style={{ padding: "14px 24px" }}
          >
            Book a free chat
          </a>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  const { data: reviewData } = useQuery<ReviewsResponse>({
    queryKey: ["reviews", "public"],
    queryFn: () => apiGet("/api/reviews") as Promise<ReviewsResponse>,
    staleTime: 12 * 60 * 60 * 1000,
  });
  const rating = reviewData?.rating ?? SITE_CONFIG.GOOGLE_RATING_FALLBACK;
  const reviewCount = reviewData?.userRatingCount ?? SITE_CONFIG.GOOGLE_REVIEW_COUNT_FALLBACK;
  const heroImgSrc = "/images/hero-coaching.jpg";

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
            Personal training in Kings Heath · online worldwide
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
            Tried it all<br />
            before? Good.<br />
            You're exactly<br />
            <span style={{ color: "var(--brand-blue, #1E90FF)" }}>who I train.</span>
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
            Diets, apps, gym guilt — most people who train with me have been let down by all three. Real coaching, built round your life, and results that don't reverse the moment things get busy. 13 years. 200+ locals trained. Rated {rating.toFixed(1)}★ from {reviewCount}+ Google reviews.
          </p>

          <div className="fade-up delay-3 mt-8 flex flex-wrap items-center" style={{ gap: "16px" }}>
            <a
              href={SITE_CONFIG.BOOKING_URL}
              onClick={() => trackBookingClick("Book a free chat", "hero")}
              className="btn-primary inline-flex items-center justify-center"
              style={{ padding: "16px 32px", fontSize: "15px" }}
            >
              Book a free chat
            </a>
            <a
              href="#reviews"
              className="btn-ghost inline-flex items-center justify-center gap-2"
              style={{ padding: "16px 28px", fontSize: "15px" }}
            >
              Read the Google reviews
              <ChevronDown className="h-4 w-4" />
            </a>
          </div>

          <p className="fade-up delay-4 mt-4" style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "#C8D8E8" }}>
            30 minutes at Foundry Gym or on the phone. No contract, no hard sell.
          </p>

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
              `${reviewCount}+ Google reviews`,
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
              <img
                src={heroImgSrc}
                alt="Jay coaching a 1-2-1 personal training session at Foundry Gym, Kings Heath, Birmingham."
                className="w-full h-full object-cover"
                style={{ borderRadius: "4px" }}
              />
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
    { target: 4, suffix: "", label: "Ways to Train" },
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
              {s.label === "Five-Star Reviews" ? (
                <a href="#reviews" className="block hover:opacity-80 transition-opacity" aria-label="Read Google reviews">
                  <ProofStat target={s.target} suffix={s.suffix} label={s.label} />
                </a>
              ) : (
                <ProofStat target={s.target} suffix={s.suffix} label={s.label} />
              )}
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
    body: "The fastest route. Every session built around your body, your schedule, your goal.",
  },
  {
    title: "Small Group (max 4)",
    body: "PT-level programming with people who notice when you don't show up.",
  },
  {
    title: "Outdoor Training",
    body: "Kings Heath Park, Cannon Hill Park, or your local green space. No machines, no hiding.",
  },
  {
    title: "Online Coaching",
    body: "Same coach, same standards. If you've got a phone and 45 minutes, I can train you.",
  },
];

type Transformation = {
  name: string;
  result: string;
  detail: string;
  quote: string;
  image: string;
  /** When true, the composite image reads after-on-the-left / before-on-the-right,
   *  so the corner pill labels are swapped to match. */
  swapBeforeAfter?: boolean;
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
    swapBeforeAfter: true,
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
        {/* Corner pill labels — swap when the source composite reads after-left / before-right. */}
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
            backgroundColor: t.swapBeforeAfter
              ? "rgba(30,144,255,0.92)"
              : "rgba(13,27,42,0.78)",
            padding: "4px 8px",
            borderRadius: "2px",
            textTransform: "uppercase",
            boxShadow: t.swapBeforeAfter ? "0 0 12px rgba(30,144,255,0.4)" : "none",
          }}
        >
          {t.swapBeforeAfter ? "After" : "Before"}
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
            backgroundColor: t.swapBeforeAfter
              ? "rgba(13,27,42,0.78)"
              : "rgba(30,144,255,0.92)",
            padding: "4px 8px",
            borderRadius: "2px",
            textTransform: "uppercase",
            boxShadow: t.swapBeforeAfter ? "none" : "0 0 12px rgba(30,144,255,0.4)",
          }}
        >
          {t.swapBeforeAfter ? "Before" : "After"}
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
              href={SITE_CONFIG.BOOKING_URL}
              onClick={() => trackBookingClick("I'm ready — let's go", "results")}
              className="btn-primary"
              style={{ whiteSpace: "nowrap", fontSize: "15px", padding: "16px 36px" }}
            >
              Book a free chat
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutJaySection() {
  const moments = [
    { src: "/images/jay-programming.jpg", caption: "Planning the next block.", alt: "Jay planning a client programme" },
    { src: "/images/jay-session.jpg", caption: "Tuesday 6am, Kings Heath Park.", alt: "Jay mid-session with a client" },
    { src: "/images/jay-outdoors.jpg", caption: "Small group. Proper coaching.", alt: "Jay with a small group outdoors" },
  ];
  return (
    <section id="about-jay" className="py-20 md:py-28 bg-[#0D1B2A] border-t border-white/5">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-10 lg:gap-16 items-start max-w-6xl mx-auto">
          <Reveal>
            <p className="text-[#1E90FF] font-bold uppercase tracking-[0.2em] text-sm mb-4">The person behind the plan</p>
            <h2 className="headline text-5xl md:text-7xl leading-none mb-6">WHO'S ACTUALLY COACHING YOU?</h2>
            <p className="text-[#C8D8E8]/80 text-lg leading-relaxed">
              Fair question. I'm Jay. I've been training people round here for 13 years — post-injury comebacks in Kings Heath, online clients who've never met me in person. There's no sales team, no junior PTs, no app you get lost in. You train with me. I'll push you harder than you'd push alone — and I'll meet you exactly where you are on day one. Both, always.
            </p>
          </Reveal>
          <div className="grid sm:grid-cols-3 gap-4">
            {moments.map((moment, index) => (
              <Reveal key={moment.alt} delay={index * 0.08}>
                <figure>
                  <div className="aspect-[4/5] overflow-hidden border border-white/10 bg-[#112240]">
                    <img src={moment.src} alt={moment.alt} loading="lazy" className="w-full h-full object-cover" />
                  </div>
                  <figcaption className="text-[#C8D8E8]/65 text-sm leading-relaxed mt-3">{moment.caption}</figcaption>
                </figure>
              </Reveal>
            ))}
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
            Four ways to train. One standard.
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
            Where we train is your choice. How we train never changes: a plan built around your life, coached hard, adjusted every week.
          </p>
        </div>

        {/* 2x2 service cards */}
        <div className="grid gap-5 md:gap-6 md:grid-cols-2 max-w-5xl mx-auto">
          {WHAT_I_DO.map((s, i) => {
            const num = String(i + 1).padStart(2, "0");
            return (
              <div
                key={s.title}
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
                   {s.title}
                </span>
              </div>
            );
          })}
        </div>
        <div className="text-center mt-10">
          <a href={SITE_CONFIG.BOOKING_URL} onClick={() => trackBookingClick("Book a free chat", "services")} className="btn-primary">
            Book a free chat
          </a>
        </div>
      </div>
    </section>
  );
}

function BootcampWaitlist() {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    try {
      await apiPost("/api/waitlist", {
        firstName: String(form.get("firstName") || ""),
        email: String(form.get("waitlistEmail") || ""),
        whatsapp: String(form.get("whatsapp") || ""),
      });
      setSubmitted(true);
      e.currentTarget.reset();
    } catch (err: any) {
      setError(err?.message || "I couldn't add you just now. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="waitlist" className="py-20 md:py-28 bg-[#0A1628] border-t border-white/5">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-5xl mx-auto rounded-2xl overflow-hidden border border-[#1E90FF]/35 bg-gradient-to-br from-[#112240] to-[#0D1B2A]">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr]">
            <div className="p-7 md:p-12">
              <p className="text-[#1E90FF] font-bold uppercase tracking-[0.2em] text-sm mb-4">Marvel The Studio</p>
              <h2 className="headline text-5xl md:text-7xl leading-none mb-5">BOOTCAMPS ARE COMING SOON.</h2>
              <p className="text-[#C8D8E8]/80 text-lg leading-relaxed max-w-2xl">
                Small-group bootcamps, proper coaching, capped numbers so nobody gets lost in the crowd. Doors open soon — join the founding list and you get first pick of spaces and the founding rate, locked for as long as you stay.
              </p>
              <p className="text-[#C8D8E8]/60 text-sm mt-5">20 founding spaces. No payment now, just first dibs.</p>
              <a href={SITE_CONFIG.MARVEL_URL} target="_blank" rel="noopener noreferrer" className="inline-flex text-[#4DAAFF] text-sm mt-4 hover:text-white transition-colors">
                Visit Marvel The Studio <ArrowRight className="h-4 w-4 ml-2" />
              </a>
            </div>
            <div className="p-7 md:p-12 bg-black/15 border-t lg:border-t-0 lg:border-l border-white/10">
              {submitted ? (
                <div className="h-full flex flex-col justify-center">
                  <CheckCircle2 className="h-10 w-10 text-[#1E90FF] mb-5" />
                  <h3 className="headline text-4xl mb-3">YOU'RE ON THE LIST.</h3>
                  <p className="text-[#C8D8E8]/75">I'll WhatsApp you the moment spaces open — Jay.</p>
                </div>
              ) : !open ? (
                <div className="h-full flex flex-col justify-center">
                  <p className="text-white text-xl font-bold mb-5">Want first pick of the founding spaces?</p>
                  <button type="button" onClick={() => setOpen(true)} className="btn-primary w-full">Join the founding list</button>
                </div>
              ) : (
                <form onSubmit={submit} className="space-y-4">
                  <h3 className="headline text-3xl mb-4">COUNT ME IN.</h3>
                  <input name="firstName" required maxLength={100} placeholder="First name" className="site-input" />
                  <input name="waitlistEmail" required type="email" placeholder="Email" className="site-input" />
                  <input name="whatsapp" required type="tel" placeholder="Best number for WhatsApp" className="site-input" />
                  {error && <p className="text-red-300 text-sm">{error}</p>}
                  <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60">
                    {submitting ? "Saving your spot…" : "Count me in"}
                  </button>
                  <p className="text-xs text-white/45 text-center">No payment now. I’ll only message you about the bootcamp.</p>
                </form>
              )}
            </div>
          </div>
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

function Packages({ packages: _packages }: { packages: Pkg[] }) {
  const pricing = [
    {
      name: "Marvel Bootcamp",
      badge: "Founding rate",
      price: "£50",
      cadence: "/ month",
      label: "Capped spaces at Marvel The Studio.",
      body: "Small-group bootcamps with proper coaching and the founding rate locked while you stay.",
      waitlist: true,
    },
    {
      name: "Fresh Start",
      badge: "Best for testing the water",
      price: "£250",
      cadence: "one-off",
      label: "5 × 1-2-1 sessions · £50/session",
      body: "Movement and posture assessment, a personalised plan and WhatsApp support. Use within 8 weeks.",
    },
    {
      name: "1-2-1 Monthly",
      badge: "Most popular",
      price: "£280",
      cadence: "/ month",
      label: "8 sessions · £35/session",
      body: "Fresh Start plus bespoke nutrition guidance, monthly body composition tracking and direct WhatsApp access 7 days.",
    },
    {
      name: "Small Group Block",
      badge: "Accountability on a budget",
      price: "£200",
      cadence: "one-off",
      label: "8 sessions · £25/session",
      body: "Max 4 people per session, mixed abilities and weekly programmed sessions.",
    },
    {
      name: "Online Coaching",
      badge: "Rolling monthly",
      price: "£120",
      cadence: "/ month",
      label: "Train anywhere in the world.",
      body: "App-delivered programme, weekly video check-ins and a WhatsApp line direct to me.",
    },
  ];
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

        <div className="grid gap-5 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 max-w-7xl mx-auto items-stretch">
          {pricing.map((item, index) => (
            <Reveal key={item.name} delay={index * 0.06}>
              <article className={`relative h-full flex flex-col p-6 border ${item.badge === "Most popular" ? "border-[#1E90FF] shadow-[0_0_32px_rgba(30,144,255,0.18)]" : "border-white/10"} bg-[#112240]`}>
                <span className="text-[#4DAAFF] text-[11px] font-bold uppercase tracking-[0.12em] mb-4">{item.badge}</span>
                <h3 className="text-white text-xl font-bold leading-tight mb-5">{item.name}</h3>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="headline text-5xl text-white">{item.price}</span>
                  <span className="text-[#C8D8E8]/60 text-sm">{item.cadence}</span>
                </div>
                <p className="text-[#4DAAFF] text-sm mb-4">{item.label}</p>
                <p className="text-[#C8D8E8]/70 text-sm leading-relaxed flex-1 mb-7">{item.body}</p>
                {item.waitlist ? (
                  <a href="#waitlist" className="btn-ghost text-center text-sm">Join the founding list</a>
                ) : (
                  <a href={SITE_CONFIG.BOOKING_URL} onClick={() => trackBookingClick(`Claim your slot: ${item.name}`, "packages")} className="btn-ghost text-center text-sm">Claim your slot</a>
                )}
              </article>
            </Reveal>
          ))}
        </div>

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
              Most people start with a Fresh Start block, then move onto monthly once we've found our feet. That's the plan — no membership until you know it's for you.
            </p>
            <p className="mt-5 text-[#C8D8E8]/75 text-sm">
              <a
                href={SITE_CONFIG.BOOKING_URL}
                onClick={() => trackBookingClick("Book a free chat", "pricing")}
                style={{
                  color: "#1E90FF",
                  fontWeight: 600,
                  textDecoration: "underline",
                  textUnderlineOffset: "3px",
                }}
              >
                Book a free chat
              </a>
              <span className="text-[#C8D8E8]/60"> — worst case, you get 30 minutes of honest advice and a brew.</span>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ReviewsWall() {
  const { data, isLoading } = useQuery<ReviewsResponse>({
    queryKey: ["reviews", "public"],
    queryFn: () => apiGet("/api/reviews") as Promise<ReviewsResponse>,
    staleTime: 12 * 60 * 60 * 1000,
  });
  const reviews = data?.reviews || [];
  return (
    <section id="reviews" className="py-20 md:py-32 bg-[#0D1B2A] border-t border-white/5">
      <div className="container mx-auto px-4 md:px-6">
        <Reveal>
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-20">
            <p className="text-[#1E90FF] font-bold uppercase tracking-[0.2em] text-sm mb-4">Google reviews</p>
            <h2 className="headline text-5xl md:text-7xl leading-none">
              <a href={SITE_CONFIG.GOOGLE_REVIEWS_URL} target="_blank" rel="noopener noreferrer" className="hover:text-[#4DAAFF] transition-colors">
                STRAIGHT FROM GOOGLE. UNEDITED. LIVE.
              </a>
            </h2>
            <p className="text-[#C8D8E8]/70 text-lg leading-relaxed mt-6">
              I don't hand-pick quotes. This pulls from my Google reviews as they land — the gushing ones and the honest ones.
            </p>
          </div>
        </Reveal>
        {isLoading && <p className="text-center text-[#C8D8E8]/60">Loading the latest reviews…</p>}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {reviews.map((review, index) => (
            <Reveal key={`${review.name}-${index}`} delay={index * 0.06}>
              <article className="h-full border border-white/10 p-6 bg-white/[0.02]">
                <div className="flex items-center justify-between gap-4 mb-5">
                  <div className="flex items-center gap-3 min-w-0">
                    {review.photo ? (
                      <img src={review.photo} alt="" className="h-10 w-10 rounded-full object-cover" loading="lazy" />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-[#1E90FF]/15 flex items-center justify-center text-[#4DAAFF] font-bold">
                        {review.name.charAt(0)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-bold text-white truncate">{review.name}</p>
                      <p className="text-white/45 text-xs">{review.relativePublishTimeDescription}</p>
                    </div>
                  </div>
                  <span className="text-[#4DAAFF] text-xs font-bold shrink-0">via Google</span>
                </div>
                <div className="flex gap-1 mb-4" aria-label={`${review.rating} out of 5 stars`}>
                  {[...Array(Math.round(review.rating))].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-[#1E90FF] text-[#1E90FF]" />
                  ))}
                </div>
                <p className="text-[#C8D8E8]/80 leading-relaxed">“{review.text}”</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ComparisonTables() {
  const tables = [
    {
      title: "High Performance Fit vs. Gym Membership",
      cols: ["Feature", "High Performance Fit", "Standard Gym Membership"],
      rows: [
        ["Personalised programme", "yes", "no", "Bespoke for you", "Generic app or none"],
        ["Accountability", "yes", "no", "Direct trainer contact", "Self-motivated"],
        ["Form correction", "yes", "no", "Real-time feedback", "None"],
        ["Nutrition guidance", "yes", "no", "Included", "Extra cost or none"],
        ["Price", "neutral", "neutral", "\u00a3\u00a3\u00a3", "\u00a3\u00a3 (but often wasted)"],
        ["Results timeline", "yes", "no", "Faster", "Slower or none"],
        ["Contract", "yes", "no", "No contracts", "Often 12-month lock-in"],
      ],
      context: `A gym membership is a great tool \u2014 but it's only useful if you know how to use it. Most people join in January, go twice, and don't return. You're paying for access, not outcomes. A personal trainer gives you a programme built for your body, accountability that keeps you showing up, and the expertise to avoid wasted effort or injury. If you already love the gym and know exactly what you're doing, a membership might be enough. If you need direction, a PT is the faster route to results.`,
    },
    {
      title: "High Performance Fit vs. Fitness Apps",
      cols: ["Feature", "High Performance Fit", "Fitness App"],
      rows: [
        ["Personalisation", "yes", "no", "Human-adjusted", "Algorithm-only"],
        ["Form checks", "yes", "no", "Video reviews", "None"],
        ["Accountability", "yes", "no", "Real person", "Notification-only"],
        ["Adaptation", "yes", "no", "Changed weekly", "Static programme"],
        ["Price", "neutral", "neutral", "\u00a3\u00a3\u00a3", "\u00a3 or free"],
      ],
      context: `Fitness apps are brilliant for motivated people who already know good form and can stick to a plan without external accountability. The problem is that most people aren't that person \u2014 and an algorithm can't tell when your squat depth is off or when your back is rounding on a deadlift. It also can't adjust your programme when you're stressed, sleep-deprived or dealing with a niggle. Apps work for some; coaching works for most.`,
    },
    {
      title: "High Performance Fit vs. Other Birmingham Personal Trainers",
      cols: ["Feature", "High Performance Fit", "Typical Birmingham PT"],
      rows: [
        ["Experience", "yes", "neutral", "13 years", "2\u20135 years average"],
        ["Transformations", "yes", "neutral", "200+", "Unknown or fewer"],
        ["Online option", "yes", "no", "Available", "Often not offered"],
        ["Nutrition included", "yes", "no", "Yes", "Often extra"],
        ["No contracts", "yes", "neutral", "Yes", "Varies"],
      ],
      context: `Birmingham has plenty of personal trainers, and many are excellent at what they do. The difference with High Performance Fit is the depth of experience \u2014 13 years, 200+ documented transformations \u2014 and the range of options. Most Birmingham PTs focus purely on in-person sessions. Here you get in-person, online, group and outdoor options, all with nutrition guidance included rather than sold separately. The best PT for you is the one whose approach matches your goals and lifestyle; this comparison simply shows where the offering differs.`,
    },
  ];

  const Cell = ({ val }: { val: string }) => {
    if (val === "yes") return <CheckCircle2 className="h-5 w-5 text-[#1E90FF]" />;
    if (val === "no") return <XCircle className="h-5 w-5 text-white/20" />;
    if (val === "neutral") return <Minus className="h-5 w-5 text-white/30" />;
    return <span className="text-[#C8D8E8]/80 text-sm">{val}</span>;
  };

  return (
    <section id="compare" className="py-20 md:py-32 bg-[#0D1B2A] border-t border-white/5">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-20">
          <Reveal>
            <p className="text-[#1E90FF] font-bold uppercase tracking-[0.2em] text-sm mb-4">Compare</p>
            <h2 className="headline text-4xl md:text-6xl leading-none">HOW WE COMPARE</h2>
            <p className="text-[#C8D8E8]/70 text-lg mt-5 leading-relaxed">
              See how High Performance Fit stacks up against gym memberships, fitness apps and other personal trainers in Birmingham.
            </p>
          </Reveal>
        </div>

        <div className="space-y-16 md:space-y-24">
          {tables.map((t, ti) => (
            <Reveal key={t.title} delay={ti * 0.1}>
              <article>
                <h3 className="headline text-2xl md:text-3xl mb-6">{t.title}</h3>
                <div className="overflow-x-auto rounded-xl border border-[#1A3A5C]">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#112240]">
                      {t.cols.map((col, ci) => (
                        <th
                          key={col}
                          className={`px-4 md:px-6 py-4 text-sm font-bold uppercase tracking-wider ${
                            ci === 0 ? "text-[#C8D8E8]/60" : "text-white"
                          } ${ci === 1 ? "text-[#1E90FF]" : ""}`}
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {t.rows.map((row, ri) => (
                      <tr
                        key={row[0] as string}
                        className={ri % 2 === 0 ? "bg-white/[0.01]" : "bg-transparent"}
                      >
                        <td className="px-4 md:px-6 py-4 text-sm font-medium text-[#C8D8E8]/80 border-t border-white/5">
                          {row[0]}
                        </td>
                        <td className="px-4 md:px-6 py-4 text-sm border-t border-white/5">
                          <div className="flex items-center gap-3">
                            <Cell val={row[1] as string} />
                            <span className="text-[#EAF2FB] text-sm">{row[3]}</span>
                          </div>
                        </td>
                        <td className="px-4 md:px-6 py-4 text-sm border-t border-white/5">
                          <div className="flex items-center gap-3">
                            <Cell val={row[2] as string} />
                            <span className="text-[#C8D8E8]/60 text-sm">{row[4]}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-6 text-[#C8D8E8]/70 text-base leading-relaxed max-w-4xl">
                {t.context.split("\n\n").map((p, i) => (
                  <p key={i} className={i > 0 ? "mt-4" : ""}>{p}</p>
                ))}
              </div>
            </article>
          </Reveal>
          ))}
        </div>
      </div>
    </section>
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
              <h2 className="headline text-5xl md:text-7xl leading-none mb-6">
                RIGHT, ENOUGH
                <br />
                <span className="text-[#1E90FF]">READING.</span>
              </h2>
              <p className="text-[#C8D8E8]/75 text-lg leading-relaxed mb-8">
                The free chat costs 30 minutes and could save you years of starting over. Grab a slot or WhatsApp me — I reply between sessions, usually same day.
              </p>

              <div className="space-y-4 mb-8">
                <a href={SITE_CONFIG.BOOKING_URL} onClick={() => trackBookingClick("Book a free chat", "contact")} className="btn-primary inline-flex">
                  Book a free chat
                </a>
                <a href={SITE_CONFIG.WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn-ghost inline-flex">
                  WhatsApp me
                </a>
                <a href={`mailto:${SITE_CONFIG.EMAIL}`} className="flex items-center gap-4 text-white/80 hover:text-[#1E90FF] transition-colors">
                  <div className="h-10 w-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-[#1E90FF]" />
                  </div>
                  <span>{SITE_CONFIG.EMAIL}</span>
                </a>
                <a href="tel:+447753226214" className="flex items-center gap-4 text-white/80 hover:text-[#1E90FF] transition-colors">
                  <div className="h-10 w-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                    <Phone className="h-5 w-5 text-[#1E90FF]" />
                  </div>
                  <span>{SITE_CONFIG.PHONE}</span>
                </a>
                <div className="flex items-center gap-4 text-white/80">
                  <div className="h-10 w-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-[#1E90FF]" />
                  </div>
                  <span>{SITE_CONFIG.ADDRESS}</span>
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
                     Thanks for reaching out. I’ll reply personally, usually within a couple of hours.
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
                  <div>
                      <label htmlFor="c-phone" className="block text-xs font-bold uppercase tracking-wider text-white/50 mb-2">
                        Best number for WhatsApp
                      </label>
                      <input
                        id="c-phone"
                        name="phone"
                        type="tel"
                        required
                        placeholder="+44 ..."
                        className="site-input"
                      />
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
                      rows={4}
                      placeholder="Tell me a bit about where you are now and what you want to achieve..."
                      className="site-input resize-none"
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
                    {submitting ? "Sending…" : "Send it"}
                    {!submitting && <ArrowRight className="h-4 w-4" />}
                  </button>
                  <p className="text-xs text-white/40 text-center">Goes straight to my phone. I’ll reply personally — usually within a couple of hours.</p>
                </>
              )}
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}