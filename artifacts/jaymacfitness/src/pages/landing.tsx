import { useEffect, useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, MessageCircle, Phone, Mail, MapPin, ChevronDown, Plus } from "lucide-react";
import { apiGet, apiPost } from "../lib/api";
import { SITE_CONFIG } from "../config";
import { PRICES } from "../data/packages";
import { trackBookingClick } from "../lib/tracking";
import { Footer } from "../components/Footer";
import { SiteNav } from "../components/hpf/SiteNav";
import { GoogleG } from "../components/hpf/GoogleG";
import { useInView } from "../components/hpf/useInView";
import { useSiteMotion } from "../components/hpf/motion";
import "../styles/hpf.css";

/* ───────── data ───────── */

type Review = {
  name: string;
  photo: string | null;
  text: string;
  relativePublishTimeDescription: string;
  rating: number;
};
type ReviewsResponse = { rating: number; userRatingCount: number; reviews: Review[]; live: boolean };

// The three reviews on Jay's Google profile today. Shown in the prerendered
// HTML and until /api/reviews answers with the live list.
const FALLBACK_REVIEWS: Review[] = [
  {
    name: "876 Collective",
    photo: null,
    rating: 5,
    relativePublishTimeDescription: "",
    text: "This is not just a PT service - it’s a whole lifestyle education service, Jay finds what your values are to motivate you and works with that to get results and leverage that you will really buy into, he’s not just a coach he helps gently change your whole outlook on your lifestyle choices, forceful when needed but supportive and effectively mentors all the way through- he comes highly recommended by anyone that chooses his services.",
  },
  {
    name: "Muhamed Alhariri",
    photo: null,
    rating: 5,
    relativePublishTimeDescription: "",
    text: "Really good experience with High Performance Fitness. The sessions are always well planned and tailored to what you need, and you can genuinely see the progress over time. Good atmosphere, no pressure, and the support is spot on. Would definitely recommend giving them a try.",
  },
  {
    name: "Jack Deen",
    photo: null,
    rating: 5,
    relativePublishTimeDescription: "",
    text: "I've been training with Jay for the past couple of months and noticed massive improvements in my health choices and also my shape. Highly recommend.",
  },
];

const CASES = [
  {
    name: "Amy K.",
    result: "Lost 3 stone",
    meta: "14 weeks · 1-2-1 training",
    quote: "I’d tried every diet and every gym. Jay was the first person who actually listened, built a plan around my life, and held me to it. Three stone down and I’ve kept it off.",
    img: "amy-before-after-400",
    ratio: "400 / 396",
    alt: "Amy K. before (left) and after (right)",
    afterOnLeft: false,
  },
  {
    name: "Danny & Jen",
    result: "6 stone between them",
    meta: "6 months · couples training",
    quote: "Training together with Jay changed our marriage. We pushed each other, we got fitter together, and six stone later we’re stronger than we’ve ever been, in every sense.",
    img: "danny-jen-before-after-400",
    ratio: "400 / 396",
    alt: "Danny and Jen before (left) and after (right)",
    afterOnLeft: false,
  },
  {
    name: "Elaine T.",
    result: "Back stronger than before",
    meta: "Post-injury rehab and training",
    quote: "After my injury I thought I was finished with the gym. Jay rebuilt me from the ground up: patient, methodical, never rushed. I’m lifting more now than before I got hurt.",
    img: "elaine-after-before-459",
    ratio: "459 / 300",
    alt: "Elaine T. after (left) and before (right)",
    afterOnLeft: true,
  },
];

const CREDENTIALS: [string, string][] = [
  ["Level 4", "Strength & Conditioning Coach"],
  ["Level 4", "Advanced Personal Trainer"],
  ["Level 4", "Certificate in Weight Management through Exercise for obese clients (RQF)"],
  ["Level 4", "Obesity & Diabetes"],
  ["Advanced", "Nutrition"],
  ["REPs", "Registered member"],
];

const STEPS: [string, string][] = [
  ["A free chat", "Your goals, your training history and what’s held you back before. No pressure either way."],
  ["Your plan", "A programme built around your body, your schedule and the result you want."],
  ["Train and track", "We train, we measure, we adjust. Every week has a point to it."],
  ["Keep the results", "Stronger, fitter, leaner, with the habits to hold on to it long after we’re done."],
];

const WAYS = [
  { href: "/online-coaching", name: "Online coaching", line: "Personal programming, weekly video check-ins and direct access to Jay — wherever you train.", price: "£120 a month" },
  { href: "/personal-training-birmingham", name: "1-2-1 personal training", line: "The fastest route. Every session is built around you.", price: "from £35 a session" },
  { href: "/group-training", name: "Small group, max 4", line: "Coached properly, with people who notice when you don’t turn up.", price: "£25 a session" },
];

const FAQS: [string, string][] = [
  ["I’m really unfit. Will I embarrass myself?", "The first session is the hardest part, and after that it’s just progress. Starting from where you are is the job."],
  ["Where do you train people?", "I’m based at Foundry Gym in Kings Heath and coach clients across South and Central Birmingham. Online coaching is available wherever you are."],
  ["I’ve got an old injury.", "Rehab-aware programming is a big part of what I do, and I’m happy to work alongside your physio. We’ll go through it properly on the free chat."],
  ["How does online coaching work?", "You get a fully bespoke programme, weekly video check-ins and WhatsApp access to me between sessions."],
  ["Is nutrition included?", "Monthly 1-2-1 coaching includes bespoke nutrition guidance. Every other option gets practical guidance that fits your normal day."],
  ["What if I’m on holiday or miss a session?", "Life happens. Reschedule with notice, pause the direct debit or move your sessions. It’s training, not a subscription trap."],
  ["How do I pay?", "Fresh Start and blocks are paid up front. Monthly coaching is direct debit, with no contract and 14 days’ notice to pause."],
  ["What happens when a block ends?", "Carry on monthly, drop to maintenance, or take the habits and go. Either way the results are yours to keep."],
  ["What should I bring?", "Comfortable kit, indoor trainers, a water bottle and a towel. Everything else is at the gym."],
];

/* ───────── small helpers ───────── */

function srcSet(slug: string, widths: number[]) {
  return widths.map((w) => `/images/site/${slug}-${w}.webp ${w}w`).join(", ");
}

function Split({
  children,
  flip = false,
  wide = false,
  className = "",
  id,
}: {
  children: ReactNode;
  flip?: boolean;
  wide?: boolean;
  className?: string;
  id?: string;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      id={id}
      data-in={inView}
      className={`hpf-split hpf-reveal${flip ? " hpf-split--flip" : ""}${wide ? " hpf-split--wide-media" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

function BookButton({ where, label = "Book a free chat" }: { where: string; label?: string }) {
  return (
    <a className="hpf-btn hpf-btn--fill" data-magnetic href={SITE_CONFIG.BOOKING_URL} onClick={() => trackBookingClick(label, where)}>
      {label}
    </a>
  );
}

function useReviews() {
  const { data } = useQuery<ReviewsResponse>({
    queryKey: ["reviews", "public"],
    queryFn: () => apiGet("/api/reviews") as Promise<ReviewsResponse>,
    staleTime: 12 * 60 * 60 * 1000,
  });
  const reviews = data?.reviews?.length ? data.reviews : FALLBACK_REVIEWS;
  const rating = data?.rating ?? SITE_CONFIG.GOOGLE_RATING_FALLBACK;
  const count = data?.userRatingCount ?? SITE_CONFIG.GOOGLE_REVIEW_COUNT_FALLBACK;
  return { reviews, rating, count };
}

/* ───────── page ───────── */

export default function Landing() {
  useSiteMotion("home");
  const [paid, setPaid] = useState<string | null>(null);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("paid") === "1") {
      setPaid((params.get("pkg") || "your package").slice(0, 60));
      const url = new URL(window.location.href);
      url.searchParams.delete("paid");
      url.searchParams.delete("pkg");
      window.history.replaceState({}, "", url.toString());
    }
  }, []);

  return (
    <>
      <div className="hpf" id="top">
        <SiteNav onHome stickyBar />
        {paid && (
          <div role="status" className="hpf-wrap" style={{ paddingTop: "calc(var(--nav-h) + var(--space-md))" }}>
            <p className="hpf-body">
              Payment received for <strong>{paid}</strong>. I’ll be in touch shortly to book your sessions. Jay
            </p>
          </div>
        )}
        <main>
          <Hero />
          <Statement />
          <Results />
          <Coach />
          <figure className="hpf-fold">
            <div className="hpf-fold__frame">
              <img
                src="/images/site/pad-work-1280.webp"
                srcSet={srcSet("pad-work", [800, 1280, 1600])}
                sizes="100vw"
                width={1600}
                height={900}
                loading="lazy"
                decoding="async"
                data-parallax-img
                alt="Jay coaching a client through a boxing pad-work drill"
              />
            </div>
            <figcaption>Pad work during a 1-2-1 session.</figcaption>
          </figure>
          <Coaching />
          <Ways />
          <Prices />
          <Bootcamp />
          <Reviews />
          <Faq />
          <Contact />
        </main>
      </div>
      <Footer />
    </>
  );
}

/* ───────── sections ───────── */

function Hero() {
  const { rating, count } = useReviews();
  return (
    <section className="hpf-hero" aria-labelledby="hero-title">
      <div className="hpf-hero__text">
        <h1 id="hero-title" className="hpf-h1">
          <span className="hpf-line">
            <span>Tried it all before?</span>
          </span>
          <span className="hpf-line">
            <span>
              <span className="hpf-accent">Good.</span> You’re exactly
            </span>
          </span>
          <span className="hpf-line">
            <span>who I train.</span>
          </span>
        </h1>
        <p className="hpf-lede hpf-fade hpf-fade--1">
          Diets, apps, a gym membership that quietly stopped getting used. Most people who come to me have been through all
          three. I’m Jay, and I build the plan around the week you actually have — at Foundry Gym or online from anywhere.
        </p>
        <div className="hpf-hero__cta hpf-fade hpf-fade--2">
          <BookButton where="hero" />
          <a className="hpf-link" href={SITE_CONFIG.WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
            <MessageCircle aria-hidden="true" strokeWidth={2} />
            WhatsApp me
          </a>
        </div>
        <p className="hpf-small hpf-hero__micro hpf-fade hpf-fade--2">
          30-minute no-pressure chat at Foundry Gym or by phone.{" "}
          <a className="hpf-link" href="/online-coaching">Online coaching is £120/month.</a>
        </p>
        <ul className="hpf-proof hpf-fade hpf-fade--3">
          <li>
            <a href="#reviews">
              <GoogleG />
              <span className="hpf-tnum">
                {rating.toFixed(1)} <span className="hpf-stars" aria-hidden="true">★★★★★</span> from {count} Google{" "}
                {count === 1 ? "review" : "reviews"}
              </span>
            </a>
          </li>
          <li>Level 4 qualified</li>
          <li>13 years coaching</li>
        </ul>
      </div>
      <figure className="hpf-hero__media">
        <img
          src="/images/site/coaching-grip-1280.webp"
          srcSet={srcSet("coaching-grip", [800, 1280, 1600])}
          sizes="(min-width: 60rem) 55vw, 100vw"
          width={1600}
          height={900}
          fetchPriority="high"
          decoding="async"
          alt="Jay guiding a client through a dumbbell exercise"
        />
      </figure>
    </section>
  );
}

function Statement() {
  return (
    <section className="hpf-statement" data-statement aria-label="How I coach, in one line">
      <div className="hpf-wrap">
        <p className="hpf-statement__text" data-words>
          Most people don’t need more motivation. They need a <b>plan</b> that fits the week they actually have, and someone
          who <b>notices</b> when they start to drift.
        </p>
        <p className="hpf-body hpf-statement__after" data-statement-after>
          That’s the job. Training, food and the habits that hold it together, with me checking in the whole way.
        </p>
      </div>
    </section>
  );
}

function RailCard({ c }: { c: (typeof CASES)[number] }) {
  const { ref, inView } = useInView<HTMLElement>(0.25);
  return (
    <article ref={ref} data-in={inView} data-rail-card className="hpf-rcard hpf-reveal">
      <figure className="hpf-figure">
        <div className="hpf-figure__frame hpf-case__frame" style={{ ["--ratio" as string]: c.ratio }} data-tilt>
          <img src={`/images/site/${c.img}.webp`} alt={c.alt} loading="lazy" decoding="async" />
          <div className={`hpf-case__veil ${c.afterOnLeft ? "hpf-case__veil--left" : "hpf-case__veil--right"}`} aria-hidden="true" />
          <span className={`hpf-tag hpf-tag--l${c.afterOnLeft ? " hpf-tag--after" : ""}`}>{c.afterOnLeft ? "After" : "Before"}</span>
          <span className={`hpf-tag hpf-tag--r${c.afterOnLeft ? "" : " hpf-tag--after"}`}>{c.afterOnLeft ? "Before" : "After"}</span>
        </div>
      </figure>
      <div className="hpf-rcard__body">
        <p className="hpf-case__name">{c.name}</p>
        <h3 className="hpf-h2 hpf-case__result">{c.result}</h3>
        <p className="hpf-case__meta">{c.meta}</p>
        <blockquote className="hpf-quote">
          <p>“{c.quote}”</p>
        </blockquote>
      </div>
    </article>
  );
}

function Results() {
  return (
    <section id="results" className="hpf-rail hpf-section--tint" data-rail aria-labelledby="results-title">
      <div className="hpf-wrap">
        <div className="hpf-head" style={{ marginBottom: "var(--space-lg)" }}>
          <h2 id="results-title" className="hpf-h2">Three people who’d tried it all before.</h2>
          <p className="hpf-lede">Their results, their timelines and their words.</p>
        </div>
      </div>
      <div className="hpf-rail__viewport" data-rail-viewport>
        <div className="hpf-rail__track" data-rail-track>
          {CASES.map((c) => (
            <RailCard key={c.name} c={c} />
          ))}
          <article className="hpf-rcard hpf-rcard--cta" data-rail-card>
            <h3 className="hpf-h2">Your name could be here.</h3>
            <p className="hpf-body">Start with a free 30-minute chat. If it’s not a fit, you’ve lost nothing but half an hour.</p>
            <div className="hpf-hero__cta">
              <BookButton where="results" />
            </div>
          </article>
        </div>
      </div>
      <div className="hpf-wrap">
        <div className="hpf-rail__foot">
          <span className="hpf-rail__progress" aria-hidden="true">
            <i data-rail-progress />
          </span>
          <span className="hpf-rail__hint" aria-hidden="true">Swipe for more →</span>
        </div>
      </div>
    </section>
  );
}

function Coach() {
  return (
    <section id="jay" className="hpf-section" aria-labelledby="jay-title">
      <div className="hpf-wrap">
        <Split flip>
          <figure className="hpf-figure">
            <div className="hpf-figure__frame hpf-portrait" data-tilt>
              <img
                src="/images/site/jay-gym-floor-800.webp"
                srcSet={srcSet("jay-gym-floor", [800, 1242])}
                sizes="(min-width: 60rem) 40vw, 100vw"
                width={1242}
                height={837}
                loading="lazy"
                decoding="async"
                alt="Jay on the gym floor with his arms crossed"
              />
            </div>
          </figure>
          <div>
            <h2 id="jay-title" className="hpf-h2">Who’s actually coaching you?</h2>
            <p className="hpf-lede">
              I’m Jay. I’ve trained for 17 years and coached for 13, in Kings Heath, across South Birmingham
              and online with people who’ve never met me in person.
            </p>
            <p className="hpf-body">
              There’s no sales team and no junior trainers. You train with me. I’ll push you harder than you’d push yourself,
              and I’ll start from wherever you are on day one.
            </p>
            <ul className="hpf-creds" aria-label="Qualifications" data-motion-stagger>
              {CREDENTIALS.map(([level, name]) => (
                <li key={name}>
                  <b>{level}</b>
                  <span>{name}</span>
                </li>
              ))}
            </ul>
            <p style={{ marginTop: "var(--space-md)" }}>
              <a className="hpf-link" href="/about-jay">
                More about me <ArrowRight aria-hidden="true" strokeWidth={2} />
              </a>
            </p>
          </div>
        </Split>
      </div>
    </section>
  );
}

function Coaching() {
  return (
    <section id="coaching" className="hpf-section" aria-labelledby="coaching-title">
      <div className="hpf-wrap">
        <Split>
          <figure className="hpf-figure">
            <div className="hpf-figure__frame" style={{ aspectRatio: "3 / 2" }}>
              <img
                src="/images/site/consultation-chat-800.webp"
                srcSet={srcSet("consultation-chat", [800, 1242])}
                sizes="(min-width: 60rem) 45vw, 100vw"
                width={1242}
                height={825}
                loading="lazy"
                decoding="async"
                alt="Jay talking a client through her plan at a table"
              />
            </div>
          </figure>
          <div>
            <h2 id="coaching-title" className="hpf-h2">It starts with a 30-minute chat.</h2>
            <p className="hpf-lede">
              We talk through what you’ve tried, what got in the way, and what you want this time. Worst case, you get half an
              hour of straight advice and a brew.
            </p>
            <ol className="hpf-steps" data-motion-stagger>
              {STEPS.map(([title, text]) => (
                <li key={title}>
                  <div>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="hpf-hero__cta">
              <BookButton where="process" />
            </div>
          </div>
        </Split>

        <Split flip>
          <figure className="hpf-figure">
            <div className="hpf-figure__frame" style={{ aspectRatio: "4 / 5" }}>
              <img
                src="/images/site/programming-laptop-900.webp"
                srcSet={srcSet("programming-laptop", [600, 900, 1200])}
                sizes="(min-width: 60rem) 40vw, 100vw"
                width={1200}
                height={1600}
                loading="lazy"
                decoding="async"
                alt="Jay reviewing a client’s training plan on his laptop and phone"
                style={{ objectPosition: "50% 35%" }}
              />
            </div>
          </figure>
          <div>
            <h2 className="hpf-h2">Between sessions, I’m a message away.</h2>
            <p className="hpf-lede">
              Most progress happens on the days we don’t train. You get WhatsApp access to me, check-ins on training and food,
              and a plan that changes when your week does.
            </p>
            <ul className="hpf-list" data-motion-stagger>
              <li>Nutrition guidance that fits a normal day, and bespoke guidance on 1-2-1 Monthly.</li>
              <li>Weekly video check-ins if you train online.</li>
              <li>Monthly body composition tracking on 1-2-1 Monthly.</li>
              <li>Rehab-aware programming, alongside your physio if you have one.</li>
              <li>Specialist Level 4 training in weight management, obesity and diabetes.</li>
            </ul>
          </div>
        </Split>
      </div>
    </section>
  );
}

function Ways() {
  return (
    <section className="hpf-section hpf-section--tint" aria-labelledby="ways-title">
      <div className="hpf-wrap">
        <Split wide>
          <figure className="hpf-figure">
            <div className="hpf-figure__frame" style={{ aspectRatio: "16 / 10" }}>
              <img
                src="/images/site/pushup-coaching-1280.webp"
                srcSet={srcSet("pushup-coaching", [800, 1280, 1600])}
                sizes="(min-width: 60rem) 55vw, 100vw"
                width={1600}
                height={900}
                loading="lazy"
                decoding="async"
                alt="Jay crouched beside a client, coaching her through a press-up"
              />
            </div>
          </figure>
          <div>
            <h2 id="ways-title" className="hpf-h2">Four ways to train with me.</h2>
            <p className="hpf-lede">Where we train is up to you. How I coach doesn’t change.</p>
            <ul className="hpf-ways" data-motion-stagger>
              {WAYS.map((w) => (
                <li key={w.href}>
                  <a href={w.href}>
                    <strong>{w.name}</strong>
                    <span className="hpf-ways__price">{w.price}</span>
                    <span className="hpf-ways__line">{w.line}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Split>
      </div>
    </section>
  );
}

function Prices() {
  return (
    <section id="prices" className="hpf-section" aria-labelledby="prices-title">
      <div className="hpf-wrap">
        <div className="hpf-head">
          <h2 id="prices-title" className="hpf-h2">Choose your coaching package.</h2>
          <p className="hpf-lede">
            Start with the support that fits your life: coached sessions in Birmingham or flexible online coaching with Jay.
            Clear prices, personal plans and no long-term contract.
          </p>
        </div>
        <table className="hpf-prices">
          <caption className="hpf-sr">Coaching packages and prices</caption>
          <thead>
            <tr>
              <th scope="col">Option</th>
              <th scope="col">What you get</th>
              <th scope="col">Price</th>
              <th scope="col">
                <span className="hpf-sr">Action</span>
              </th>
            </tr>
          </thead>
          <tbody data-motion-stagger>
            {PRICES.map((p) => (
              <tr key={p.name} data-popular={p.popular ? "true" : undefined}>
                <th scope="row">
                  <span className="hpf-prices__name">{p.name}</span>
                  <span className="hpf-prices__note">{p.note}</span>
                </th>
                <td>{p.detail}</td>
                <td className="hpf-prices__price">
                  <b>{p.price}</b>
                  {p.per}
                </td>
                <td className="hpf-prices__action">
                  {p.waitlist ? (
                    <a className="hpf-btn hpf-btn--line" href="#bootcamp">
                      Join the list
                    </a>
                  ) : (
                    <a
                      className={`hpf-btn ${p.popular ? "hpf-btn--fill" : "hpf-btn--line"}`}
                      href={SITE_CONFIG.BOOKING_URL}
                      onClick={() => trackBookingClick(`Claim your slot: ${p.name}`, "prices")}
                    >
                      Claim your slot
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="hpf-body" style={{ marginTop: "var(--space-lg)" }}>
          Not sure which fits? <a className="hpf-link" href={SITE_CONFIG.BOOKING_URL} onClick={() => trackBookingClick("Book a free chat", "prices-note")}>Book a free chat</a> and we’ll pick together.
        </p>
      </div>
    </section>
  );
}

function Bootcamp() {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setState("loading");
    setError("");
    try {
      await apiPost("/api/waitlist", {
        firstName: String(fd.get("firstName") || ""),
        email: String(fd.get("waitlistEmail") || ""),
        whatsapp: String(fd.get("whatsapp") || ""),
      });
      setState("done");
      form.reset();
    } catch (err: any) {
      setState("error");
      setError(err?.message ? `${err.message}. Try again, or WhatsApp me on ${SITE_CONFIG.PHONE}.` : `That didn’t save. Try again, or WhatsApp me on ${SITE_CONFIG.PHONE}.`);
    }
  }

  return (
    <section id="bootcamp" className="hpf-section hpf-section--tint" aria-labelledby="boot-title">
      <div className="hpf-wrap">
        <div className="hpf-boot" data-mcta-hide>
          <Split>
            <div>
              <h2 id="boot-title" className="hpf-h2">Bootcamps at Marvel The Studio, coming soon.</h2>
              <p className="hpf-lede">
                Small-group bootcamps with proper coaching and capped numbers, so nobody gets lost at the back. Join the
                founding list for first pick of spaces and the founding rate, kept for as long as you stay.
              </p>
              <p className="hpf-small" style={{ marginTop: "var(--space-sm)" }}>20 founding spaces. No payment now.</p>
              <p>
                <a className="hpf-link" href={SITE_CONFIG.MARVEL_URL} target="_blank" rel="noopener noreferrer">
                  Marvel The Studio <ArrowRight aria-hidden="true" strokeWidth={2} />
                </a>
              </p>
            </div>
            <div>
              {state === "done" ? (
                <div className="hpf-done" role="status">
                  <h3 className="hpf-h3">You’re on the list.</h3>
                  <p>I’ll WhatsApp you the moment spaces open. Jay</p>
                </div>
              ) : (
                <form className="hpf-form" onSubmit={submit} noValidate={false}>
                  <div className="hpf-field">
                    <label htmlFor="w-name">First name</label>
                    <input id="w-name" name="firstName" required maxLength={100} autoComplete="given-name" className="hpf-input" />
                  </div>
                  <div className="hpf-field">
                    <label htmlFor="w-email">Email</label>
                    <input id="w-email" name="waitlistEmail" type="email" required autoComplete="email" inputMode="email" className="hpf-input" />
                  </div>
                  <div className="hpf-field">
                    <label htmlFor="w-wa">Best number for WhatsApp</label>
                    <input id="w-wa" name="whatsapp" type="tel" required autoComplete="tel" inputMode="tel" className="hpf-input" />
                  </div>
                  <p className="hpf-help" data-tone={state === "error" ? "error" : undefined} role={state === "error" ? "alert" : undefined}>
                    {state === "error" ? error : "I’ll only message you about the bootcamp."}
                  </p>
                  <button type="submit" className="hpf-btn hpf-btn--fill hpf-btn--wide" disabled={state === "loading"} data-state={state === "loading" ? "loading" : undefined}>
                    {state === "loading" ? "Saving your place…" : "Count me in"}
                  </button>
                </form>
              )}
            </div>
          </Split>
        </div>
      </div>
    </section>
  );
}

function Reviews() {
  const { reviews, rating, count } = useReviews();
  const sorted = [...reviews].sort((a, b) => b.text.length - a.text.length);
  const [lead, ...rest] = sorted;
  return (
    <section id="reviews" className="hpf-section" aria-labelledby="reviews-title">
      <div className="hpf-wrap">
        <div className="hpf-head">
          <h2 id="reviews-title" className="hpf-h2">What clients say on Google.</h2>
          <p className="hpf-lede">Straight from my Google profile, unedited.</p>
        </div>
        <div className="hpf-reviews">
          {lead && (
            <figure className="hpf-pull" data-reveal>
              <blockquote>
                <p>“{lead.text}”</p>
              </blockquote>
              <figcaption>
                <b>{lead.name}</b> · Google review{lead.relativePublishTimeDescription ? ` · ${lead.relativePublishTimeDescription}` : ""}
              </figcaption>
            </figure>
          )}
          <div className="hpf-notes" data-motion-stagger>
            {rest.slice(0, 4).map((r, i) => (
              <figure className="hpf-note" key={`${r.name}-${i}`}>
                <blockquote>
                  <p>“{r.text}”</p>
                </blockquote>
                <figcaption>
                  <b>{r.name}</b> · Google review{r.relativePublishTimeDescription ? ` · ${r.relativePublishTimeDescription}` : ""}
                </figcaption>
              </figure>
            ))}
            <a className="hpf-google" href={SITE_CONFIG.GOOGLE_REVIEWS_URL} target="_blank" rel="noopener noreferrer">
              <GoogleG />
              <span className="hpf-tnum">
                {rating.toFixed(1)} <span className="hpf-stars" aria-hidden="true">★★★★★</span> · {count} {count === 1 ? "review" : "reviews"} on Google
              </span>
              <ArrowRight aria-hidden="true" strokeWidth={2} style={{ width: "1rem", height: "1rem" }} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section id="faq" className="hpf-section hpf-section--tint" aria-labelledby="faq-title">
      <div className="hpf-wrap">
        <div className="hpf-head">
          <h2 id="faq-title" className="hpf-h2">Questions people ask first.</h2>
        </div>
        <div className="hpf-faq" data-motion-stagger>
          {FAQS.map(([q, a], i) => (
            <details key={q} open={i === 0}>
              <summary>
                {q}
                <Plus aria-hidden="true" strokeWidth={2} />
              </summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setState("loading");
    setError("");
    try {
      await apiPost("/api/enquiries", {
        name: String(fd.get("name") || ""),
        phone: String(fd.get("phone") || ""),
        message: `Goal: ${String(fd.get("goal") || "Not specified")}\n\n${String(fd.get("message") || "")}`,
        source: "landing",
      });
      setState("done");
      form.reset();
    } catch (err: any) {
      setState("error");
      setError(
        err?.message
          ? `${err.message}. Try again, or WhatsApp me on ${SITE_CONFIG.PHONE}.`
          : `That didn’t send. Try again, or WhatsApp me on ${SITE_CONFIG.PHONE}.`,
      );
    }
  }

  return (
    <section id="contact" className="hpf-section" aria-labelledby="contact-title" data-mcta-hide>
      <div className="hpf-wrap">
        <Split>
          <div>
            <h2 id="contact-title" className="hpf-h2" data-final style={{ transformOrigin: "left center" }}>Right, enough reading.</h2>
            <p className="hpf-lede">
              The free chat takes 30 minutes and could save you years of starting over. Fill this in or WhatsApp me. I usually
              reply the same day.
            </p>
            <ul className="hpf-contact-lines">
              <li>
                <a href={SITE_CONFIG.WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                  <MessageCircle aria-hidden="true" strokeWidth={2} />
                  WhatsApp {SITE_CONFIG.PHONE}
                </a>
              </li>
              <li>
                <a href={`tel:${SITE_CONFIG.PHONE_TEL}`}>
                  <Phone aria-hidden="true" strokeWidth={2} />
                  Call {SITE_CONFIG.PHONE}
                </a>
              </li>
              <li>
                <a href={`mailto:${SITE_CONFIG.EMAIL}`}>
                  <Mail aria-hidden="true" strokeWidth={2} />
                  {SITE_CONFIG.EMAIL}
                </a>
              </li>
              <li>
                <a href="https://www.google.com/maps/search/?api=1&query=Foundry+Gym+Kings+Heath+Birmingham" target="_blank" rel="noopener noreferrer">
                  <MapPin aria-hidden="true" strokeWidth={2} />
                  {SITE_CONFIG.ADDRESS}
                </a>
              </li>
            </ul>
            <p className="hpf-assess-link">
              Rather answer a few questions first?{" "}
              <a href="/assessment">
                Take the four-minute assessment <ArrowRight aria-hidden="true" strokeWidth={2} />
              </a>
            </p>
          </div>
          <div className="hpf-formcard">
            {state === "done" ? (
              <div className="hpf-done" role="status">
                <h3 className="hpf-h3">Got it, thanks.</h3>
                <p>I’ll reply personally, usually within a couple of hours. Jay</p>
                <button type="button" className="hpf-btn hpf-btn--line" onClick={() => setState("idle")}>
                  Send another message
                </button>
              </div>
            ) : (
              <form className="hpf-form" onSubmit={onSubmit}>
                <div className="hpf-field">
                  <label htmlFor="c-name">Name</label>
                  <input id="c-name" name="name" required autoComplete="name" className="hpf-input" />
                </div>
                <div className="hpf-field">
                  <label htmlFor="c-phone">Best number for WhatsApp</label>
                  <input id="c-phone" name="phone" type="tel" required autoComplete="tel" inputMode="tel" className="hpf-input" />
                </div>
                <div className="hpf-field">
                  <label htmlFor="c-goal">Main goal</label>
                  <div className="hpf-select">
                    <select id="c-goal" name="goal" required defaultValue="" className="hpf-input">
                      <option value="" disabled>
                        Choose one
                      </option>
                      <option value="Lose Weight">Lose weight</option>
                      <option value="Build Muscle">Build muscle</option>
                      <option value="Improve Fitness">Improve fitness</option>
                      <option value="Sport Specific">Sport specific</option>
                      <option value="Other">Something else</option>
                    </select>
                    <ChevronDown aria-hidden="true" strokeWidth={2} />
                  </div>
                </div>
                <div className="hpf-field">
                  <label htmlFor="c-message">
                    Anything I should know? <span>(optional)</span>
                  </label>
                  <textarea id="c-message" name="message" rows={4} className="hpf-input" />
                </div>
                <p className="hpf-help" data-tone={state === "error" ? "error" : undefined} role={state === "error" ? "alert" : undefined}>
                  {state === "error" ? error : "Goes straight to my phone. I’ll reply personally."}
                </p>
                <button type="submit" className="hpf-btn hpf-btn--fill hpf-btn--wide" disabled={state === "loading"} data-state={state === "loading" ? "loading" : undefined}>
                  {state === "loading" ? "Sending…" : "Send it"}
                </button>
              </form>
            )}
          </div>
        </Split>
      </div>
    </section>
  );
}
