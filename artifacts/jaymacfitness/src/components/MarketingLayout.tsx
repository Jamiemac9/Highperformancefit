import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Instagram, Facebook } from "lucide-react";
import { Footer } from "./Footer";

const NAV_LINKS = [
  { href: "/personal-training-birmingham", label: "Personal Training" },
  { href: "/online-coaching", label: "Online Coaching" },
  { href: "/group-training", label: "Group Training" },
  { href: "/outdoor-training", label: "Outdoor Training" },
  { href: "/about-jay", label: "About Jay" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export function MarketingLayout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#0A1628]">
      {/* Top navigation bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A1628]/90 backdrop-blur-md border-b border-white/5">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16">
            <a href="/" className="headline text-xl tracking-wider text-white">
              HP<span className="text-[#1E90FF]">FIT</span>
            </a>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-6">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${
                    location.pathname === link.href ? "text-[#1E90FF]" : "text-[#C8D8E8]/70 hover:text-white"
                  }`}
                >
                  {link.label}
                </a>
              ))}
              <a
                href="tel:+447753226214"
                className="bg-[#1E90FF] text-white text-sm font-bold uppercase tracking-wider px-4 py-2 rounded-full hover:bg-[#4DAAFF] transition-all"
              >
                Call Jay
              </a>
            </nav>

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden h-10 w-10 flex items-center justify-center text-white/80"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {menuOpen && (
          <div className="lg:hidden border-t border-white/10 bg-[#0A1628]/95 backdrop-blur-md">
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-3">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`text-base font-medium py-2 transition-colors ${
                    location.pathname === link.href ? "text-[#1E90FF]" : "text-[#C8D8E8]/70 hover:text-white"
                  }`}
                >
                  {link.label}
                </a>
              ))}
              <a
                href="tel:+447753226214"
                className="bg-[#1E90FF] text-white font-bold uppercase tracking-wider px-6 py-3 rounded-full hover:bg-[#4DAAFF] transition-all text-center mt-2"
              >
                Call 07753 226 214
              </a>
            </nav>
          </div>
        )}
      </header>

      {/* Spacer for fixed header */}
      <div className="h-16" />

      {/* Page content */}
      {children}

      {/* Footer */}
      <Footer />
    </div>
  );
}
