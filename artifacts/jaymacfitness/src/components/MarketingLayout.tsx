import { Footer } from "./Footer";
import { SiteNav } from "./hpf/SiteNav";
import "../styles/hpf.css";

/** Shared chrome for the inner marketing pages: same pill nav + letter-close footer as the homepage. */
export function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="hpf min-h-screen">
      <SiteNav stickyBar />
      <div className="hpf-nav-spacer" aria-hidden="true" />
      {children}
      <Footer />
    </div>
  );
}
