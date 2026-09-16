import { Instagram, Facebook, MapPin, Phone, Mail } from "lucide-react";
import { SITE_CONFIG } from "../config";

const AREA_LINKS: [string, string][] = [
  ["/personal-trainer-kings-heath", "Kings Heath"],
  ["/personal-trainer-moseley", "Moseley"],
  ["/personal-trainer-edgbaston", "Edgbaston"],
  ["/personal-trainer-harborne", "Harborne"],
  ["/personal-trainer-selly-oak", "Selly Oak"],
];

export function Footer() {
  return (
    <footer className="bg-[#08111E] border-t border-white/10 py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
          <div>
            <a href="/" className="inline-block mb-4" aria-label="High Performance Fit — home">
              <img src="/images/hpf-logo.png" alt="High Performance Fit" className="h-12 w-[78px] object-contain" />
            </a>
            <p className="text-[#C8D8E8]/55 text-sm leading-relaxed mb-5">
              Personal training in Birmingham — online and in-person. Built for results that last.
            </p>
            <address className="not-italic space-y-2 text-sm text-[#C8D8E8]/65">
              <p className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-[#1E90FF] flex-shrink-0 mt-0.5" />
                <span>{SITE_CONFIG.ADDRESS},<br />West Midlands B14 7JZ</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#1E90FF] flex-shrink-0" />
                <a href="tel:+447753226214" className="hover:text-[#1E90FF] transition-colors">{SITE_CONFIG.PHONE}</a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#1E90FF] flex-shrink-0" />
                <a href={`mailto:${SITE_CONFIG.EMAIL}`} className="hover:text-[#1E90FF] transition-colors">{SITE_CONFIG.EMAIL}</a>
              </p>
            </address>
          </div>
          <div>
            <h4 className="font-bold uppercase tracking-wider text-sm text-white mb-4">Explore</h4>
            <nav className="flex flex-col gap-2">
              {[
                ["/personal-training-birmingham", "Personal Training"],
                ["/online-coaching", "Online Coaching"],
                ["/group-training", "Group Training"],
                ["/outdoor-training", "Outdoor Training"],
                ["/about-jay", "About Jay"],
                ["/faq", "FAQ"],
                ["/contact", "Contact"],
                ["/blog", "Blog"],
              ].map(([href, label]) => (
                <a key={href} href={href} className="text-[#C8D8E8]/65 hover:text-[#1E90FF] text-sm transition-colors">
                  {label}
                </a>
              ))}
            </nav>
          </div>
          <div>
            <h4 className="font-bold uppercase tracking-wider text-sm text-white mb-4">Areas We Cover</h4>
            <nav className="flex flex-col gap-2">
              {AREA_LINKS.map(([href, label]) => (
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
                href="https://www.facebook.com/jay.pt.58"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook — HP Fit"
                className="h-10 w-10 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:bg-[#1E90FF] hover:text-white hover:border-[#1E90FF] transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
            <p className="text-white/40 text-xs">Instagram @jaymacjm · Facebook jay.pt.58</p>
          </div>
        </div>
        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row gap-4 items-center justify-between text-xs text-white/40">
          <p>&copy; 2026 High Performance Fit. All rights reserved.</p>
          <p>Foundry Gym, Kings Heath, Birmingham, West Midlands B14 7JZ</p>
        </div>
      </div>
    </footer>
  );
}
