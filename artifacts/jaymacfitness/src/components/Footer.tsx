import { Instagram, Facebook } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#08111E] border-t border-white/10 py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
          <div>
            <a href="/" className="headline text-2xl tracking-wider text-white inline-block mb-4">
              HP<span className="text-[#1E90FF]">FIT</span>
            </a>
            <p className="text-[#C8D8E8]/55 text-sm leading-relaxed">
              Personal training in Birmingham — online and in-person. Built for results that last.
            </p>
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
          <p>Foundry Gym, Kings Heath, Birmingham</p>
        </div>
      </div>
    </footer>
  );
}
