import { useEffect, useState } from "react";
import { Menu, X, MessageCircle } from "lucide-react";
import { SITE_CONFIG } from "../../config";
import { trackBookingClick } from "../../lib/tracking";
import { lockScroll } from "./motion";

/** Booking link that works from any page while BOOKING_URL is still the #contact anchor. */
export function bookingHref(onHome: boolean) {
  const url = SITE_CONFIG.BOOKING_URL;
  if (!url.startsWith("#")) return url;
  return onHome ? url : `/${url}`;
}

type NavProps = {
  /** Landing page uses in-page anchors; other pages link back to them. */
  onHome?: boolean;
  /** Show the mobile sticky booking bar (hidden while the contact section is on screen). */
  stickyBar?: boolean;
};

export function SiteNav({ onHome = false, stickyBar = false }: NavProps) {
  const [open, setOpen] = useState(false);
  const [showBar, setShowBar] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const home = onHome ? "" : "/";
  const book = bookingHref(onHome);

  const primary = [
    { href: `${home}#results`, label: "Results" },
    { href: `${home}#coaching`, label: "How I coach" },
    { href: `${home}#prices`, label: "Prices" },
    { href: "/online-coaching", label: "Online coaching" },
    { href: `${home}#reviews`, label: "Reviews" },
    { href: "/about-jay", label: "About" },
  ];
  const sheet = [
    ...primary.slice(0, 5),
    { href: "/personal-training-birmingham", label: "1-2-1 training" },
    { href: "/group-training", label: "Small group" },
    { href: "/about-jay", label: "About Jay" },
    { href: "/blog", label: "Blog" },
    { href: `${home}#faq`, label: "FAQ" },
  ];

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    lockScroll(true);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      lockScroll(false);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    // The bar hides while a form (or anything marked data-mcta-hide) is on screen.
    const hideAt = Array.from(document.querySelectorAll<HTMLElement>("[data-mcta-hide]"));
    const update = () => {
      const y = window.scrollY;
      setScrolled(y > 30);
      if (!stickyBar) return;
      const covered = hideAt.some((el) => {
        const r = el.getBoundingClientRect();
        return r.top < window.innerHeight * 0.85 && r.bottom > 0;
      });
      setShowBar(y > window.innerHeight * 0.7 && !covered);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [stickyBar]);

  return (
    <>
      <header className="hpf-nav" aria-label="Site" data-scrolled={scrolled}>
        <a className="hpf-nav__brand" href={onHome ? "#top" : "/"} aria-label="High Performance Fit, home">
          <img src="/images/site/hpf-logo-96.webp" srcSet="/images/site/hpf-logo-96.webp 1x, /images/site/hpf-logo-192.webp 2x" width={35} height={36} alt="" />
          <span className="hpf-nav__word">High Performance Fit</span>
        </a>
        <nav aria-label="Primary">
          <ul className="hpf-nav__links">
            {primary.map((l) => (
              <li key={l.href}>
                <a href={l.href}>{l.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <a className="hpf-btn hpf-btn--fill hpf-nav__book" data-magnetic href={book} onClick={() => trackBookingClick("Book a free chat", "nav")}>
          Book a free chat
        </a>
        <button
          type="button"
          className="hpf-nav__menu"
          aria-expanded={open}
          aria-controls="hpf-sheet"
          onClick={() => setOpen(true)}
        >
          <Menu aria-hidden="true" strokeWidth={2} />
          Menu
        </button>
      </header>

      <div id="hpf-sheet" className="hpf-sheet" data-open={open} role="dialog" aria-modal="true" aria-label="Menu" hidden={!open}>
        <button type="button" className="hpf-nav__menu hpf-sheet__close" onClick={() => setOpen(false)}>
          <X aria-hidden="true" strokeWidth={2} />
          Close
        </button>
        <nav aria-label="Menu">
          {sheet.map((l) => (
            <a key={l.href + l.label} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
        </nav>
        <div className="hpf-sheet__foot">
          <a
            className="hpf-btn hpf-btn--fill hpf-btn--wide"
            href={book}
            onClick={() => {
              trackBookingClick("Book a free chat", "menu");
              setOpen(false);
            }}
          >
            Book a free chat
          </a>
          <a className="hpf-btn hpf-btn--line hpf-btn--wide" href={SITE_CONFIG.WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
            WhatsApp {SITE_CONFIG.PHONE}
          </a>
        </div>
      </div>

      {stickyBar && (
        <div className="hpf-bar" data-show={showBar && !open} aria-hidden={!showBar}>
          <span className="hpf-bar__text">
            Free 30-minute chat
            <small>No contract · I reply the same day</small>
          </span>
          <a
            className="hpf-btn hpf-btn--fill"
            href={book}
            tabIndex={showBar ? 0 : -1}
            onClick={() => trackBookingClick("Book a free chat", "sticky-bar")}
          >
            Book
          </a>
          <a
            className="hpf-bar__wa"
            href={SITE_CONFIG.WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={showBar ? 0 : -1}
            aria-label="WhatsApp Jay"
          >
            <MessageCircle aria-hidden="true" strokeWidth={2} />
          </a>
        </div>
      )}
    </>
  );
}
