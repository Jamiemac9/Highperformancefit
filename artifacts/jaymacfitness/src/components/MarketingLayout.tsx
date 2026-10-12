import { useLocation } from "react-router-dom";
import { Footer } from "./Footer";
import { SiteNav } from "./hpf/SiteNav";
import { useSiteMotion } from "./hpf/motion";
import "../styles/hpf.css";

/** Shared chrome for the inner marketing pages: same pill nav + letter-close footer as the homepage. */
export function MarketingLayout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  useSiteMotion(`inner:${pathname}`);
  return (
    <div className="hpf min-h-screen">
      <SiteNav stickyBar />
      <div className="hpf-nav-spacer" aria-hidden="true" />
      {children}
      <Footer />
    </div>
  );
}
