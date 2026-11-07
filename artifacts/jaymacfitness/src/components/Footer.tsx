import { SITE_CONFIG } from "../config";
import "../styles/hpf.css";

const PAGES: [string, string][] = [
  ["/personal-training-birmingham", "1-2-1 training"],
  ["/group-training", "Small group"],
  ["/online-coaching", "Online coaching"],
  ["/about-jay", "About Jay"],
  ["/faq", "FAQ"],
  ["/blog", "Blog"],
  ["/contact", "Contact"],
];

const AREAS: [string, string][] = [
  ["/personal-trainer-kings-heath", "Kings Heath"],
  ["/personal-trainer-moseley", "Moseley"],
  ["/personal-trainer-edgbaston", "Edgbaston"],
  ["/personal-trainer-harborne", "Harborne"],
  ["/personal-trainer-selly-oak", "Selly Oak"],
];

/** Ft6 · letter close — the page signs off from Jay, links sit underneath. */
export function Footer() {
  return (
    <footer className="hpf hpf-foot">
      <div className="hpf-wrap">
        <p className="hpf-foot__close">
          Speak soon,
          <br />
          Jay
        </p>
        <p className="hpf-foot__ps">
          P.S. WhatsApp is the quickest way to reach me:{" "}
          <a href={SITE_CONFIG.WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
            {SITE_CONFIG.PHONE}
          </a>
          . I reply between sessions. You can also email{" "}
          <a href={`mailto:${SITE_CONFIG.EMAIL}`}>{SITE_CONFIG.EMAIL}</a>.
        </p>

        <ul className="hpf-foot__nav" aria-label="Site pages">
          {PAGES.map(([href, label]) => (
            <li key={href}>
              <a href={href}>{label}</a>
            </li>
          ))}
          <li>
            <a href="https://instagram.com/jaymacjm" target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
          </li>
          <li>
            <a href="https://www.facebook.com/jay.pt.58" target="_blank" rel="noopener noreferrer">
              Facebook
            </a>
          </li>
          <li>
            <a href={SITE_CONFIG.GOOGLE_REVIEWS_URL} target="_blank" rel="noopener noreferrer">
              Google reviews
            </a>
          </li>
        </ul>

        <p className="hpf-foot__areas">
          Coaching across South Birmingham:{" "}
          {AREAS.map(([href, label], i) => (
            <span key={href}>
              <a href={href}>{label}</a>
              {i < AREAS.length - 1 ? " · " : ""}
            </span>
          ))}
          , and online anywhere.
        </p>

        <p className="hpf-foot__legal">
          © {new Date().getFullYear()} High Performance Fit · {SITE_CONFIG.ADDRESS}, West Midlands B14 7JZ
        </p>
      </div>
    </footer>
  );
}
