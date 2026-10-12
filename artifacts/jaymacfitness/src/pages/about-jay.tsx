import { useEffect } from "react";
import { ArrowRight, MapPin, MessageCircle, Phone, Mail, Instagram } from "lucide-react";
import { SITE_CONFIG } from "../config";
import { trackBookingClick } from "../lib/tracking";
import { bookingHref } from "../components/hpf/SiteNav";
import "../styles/hpf.css";

const CREDENTIALS: [string, string][] = [
  ["Level 4", "Strength & Conditioning Coach"],
  ["Level 4", "Advanced Personal Trainer"],
  ["Level 4", "Certificate in Weight Management through Exercise for obese clients (RQF)"],
  ["Level 4", "Obesity & Diabetes"],
  ["Advanced", "Nutrition"],
  ["REPs", "Registered member"],
];

const BELIEFS: [string, string][] = [
  ["No templates", "Your body, your schedule, your goal. If I gave you the same plan as the last person, I’d be doing you a disservice."],
  ["Consistency beats talent", "The people who get there aren’t the most gifted. They’re the ones who keep turning up. My job is to make turning up easier than giving up."],
  ["Results over hype", "No 30-day challenges, no detox teas, no magic. Progressive training, honest nutrition and the patience to see it through."],
];

function srcSet(slug: string, widths: number[]) {
  return widths.map((w) => `/images/site/${slug}-${w}.webp ${w}w`).join(", ");
}

export default function AboutJay() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const book = bookingHref(false);

  return (
    <main>
      <section className="hpf-section" aria-labelledby="about-title" style={{ paddingTop: "var(--space-xl)" }}>
        <div className="hpf-wrap">
          <div className="hpf-split" data-motion-split>
            <div>
              <h1 id="about-title" className="hpf-h1" data-motion-title>
                I’m Jay. I’ll be the one coaching you.
              </h1>
              <p className="hpf-lede">
                I’ve trained myself for 17 years and coached for 13. I work from Foundry Gym in Kings Heath, outdoors in the
                local parks, and online with clients in five countries.
              </p>
              <div className="hpf-hero__cta">
                <a className="hpf-btn hpf-btn--fill" data-magnetic href={book} onClick={() => trackBookingClick("Book a free chat", "about-hero")}>
                  Book a free chat
                </a>
                <a className="hpf-link" href="https://instagram.com/jaymacjm" target="_blank" rel="noopener noreferrer">
                  <Instagram aria-hidden="true" strokeWidth={2} />
                  @jaymacjm
                </a>
              </div>
            </div>
            <figure className="hpf-figure" data-motion-media>
              <div className="hpf-figure__frame" style={{ aspectRatio: "1 / 1" }} data-tilt>
                <img
                  src="/images/site/jay-portrait-1000.webp"
                  srcSet={srcSet("jay-portrait", [600, 1000])}
                  sizes="(min-width: 60rem) 45vw, 100vw"
                  width={1000}
                  height={995}
                  fetchPriority="high"
                  decoding="async"
                  alt="Jay in the gym"
                />
              </div>
            </figure>
          </div>
        </div>
      </section>

      <section className="hpf-section hpf-section--tint" aria-labelledby="why-title">
        <div className="hpf-wrap">
          <div className="hpf-split hpf-split--flip" data-motion-split>
            <figure className="hpf-figure">
              <div className="hpf-figure__frame" style={{ aspectRatio: "3 / 2" }}>
                <img
                  src="/images/site/consultation-phone-800.webp"
                  srcSet={srcSet("consultation-phone", [800, 1242])}
                  sizes="(min-width: 60rem) 45vw, 100vw"
                  width={1242}
                  height={837}
                  loading="lazy"
                  decoding="async"
                  alt="Jay going through a plan with a client on his phone"
                />
              </div>
            </figure>
            <div>
              <h2 id="why-title" className="hpf-h2">Why High Performance Fit exists.</h2>
              <p className="hpf-lede">
                I started it because I was tired of watching people spend money on plans that were never built for them.
              </p>
              <p className="hpf-body">
                My approach is simple. Find out where you are, build a plan that fits your actual week, and hold you to it.
                There’s no sales team and no junior trainers. You train with me, and I’ll start from wherever you are on day one.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="hpf-section" aria-labelledby="creds-title">
        <div className="hpf-wrap">
          <div className="hpf-split" data-motion-split>
            <div>
              <h2 id="creds-title" className="hpf-h2">Qualifications.</h2>
              <p className="hpf-lede">Specialist training in weight management, obesity and diabetes, on top of strength and conditioning.</p>
              <ul className="hpf-creds" aria-label="Qualifications" data-motion-stagger>
                {CREDENTIALS.map(([level, name]) => (
                  <li key={name}>
                    <b>{level}</b>
                    <span>{name}</span>
                  </li>
                ))}
              </ul>
            </div>
            <figure className="hpf-figure">
              <div className="hpf-figure__frame" style={{ aspectRatio: "4 / 5" }} data-tilt>
                <img
                  src="/images/site/jay-sandbag-600.webp"
                  srcSet={srcSet("jay-sandbag", [600, 1000])}
                  sizes="(min-width: 60rem) 40vw, 100vw"
                  width={1000}
                  height={1507}
                  loading="lazy"
                  decoding="async"
                  alt="Jay training with a sandbag across his shoulders"
                  style={{ objectPosition: "50% 20%" }}
                />
              </div>
            </figure>
          </div>
        </div>
      </section>

      <section className="hpf-section hpf-section--tint" aria-labelledby="beliefs-title">
        <div className="hpf-wrap">
          <div className="hpf-head">
            <h2 id="beliefs-title" className="hpf-h2">What I believe.</h2>
          </div>
          <ul className="hpf-ways" data-motion-stagger>
            {BELIEFS.map(([title, text]) => (
              <li key={title} style={{ padding: "var(--space-sm) 0" }}>
                <strong className="hpf-h3" style={{ display: "block" }}>{title}</strong>
                <p className="hpf-body">{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="hpf-section" aria-labelledby="where-title">
        <div className="hpf-wrap">
          <div className="hpf-split" data-motion-split>
            <div>
              <h2 id="where-title" className="hpf-h2">Where I coach.</h2>
              <ul className="hpf-contact-lines">
                <li>
                  <a href="https://www.google.com/maps/search/?api=1&query=Foundry+Gym+Kings+Heath+Birmingham" target="_blank" rel="noopener noreferrer">
                    <MapPin aria-hidden="true" strokeWidth={2} />
                    Foundry Gym, Kings Heath, Birmingham B14 7JZ
                  </a>
                </li>
                <li>
                  <span>
                    <MapPin aria-hidden="true" strokeWidth={2} />
                    Outdoors: Kings Heath Park, Cannon Hill Park or a green space near you
                  </span>
                </li>
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
              </ul>
              <div className="hpf-hero__cta">
                <a className="hpf-btn hpf-btn--fill" data-magnetic href={book} onClick={() => trackBookingClick("Book a free chat", "about-where")}>
                  Book a free chat
                </a>
                <a className="hpf-link" href="/#prices">
                  See prices <ArrowRight aria-hidden="true" strokeWidth={2} />
                </a>
              </div>
            </div>
            <figure className="hpf-figure">
              <div className="hpf-figure__frame" style={{ aspectRatio: "3 / 2" }}>
                <img
                  src="/images/site/jay-gym-floor-800.webp"
                  srcSet={srcSet("jay-gym-floor", [800, 1242])}
                  sizes="(min-width: 60rem) 45vw, 100vw"
                  width={1242}
                  height={837}
                  loading="lazy"
                  decoding="async"
                  alt="Jay on the gym floor"
                />
              </div>
            </figure>
          </div>
        </div>
      </section>
    </main>
  );
}
