import { useEffect, useRef, useState } from "react";

/** True if any part of the element is inside the viewport right now. */
export function onScreen(el: Element) {
  const r = el.getBoundingClientRect();
  return r.bottom > 0 && r.top < window.innerHeight;
}

/**
 * Marks an element as "in view" once (drives the focus-pull reveal).
 * Also tags <html> with `hpf-js` so reveal styles only apply when JS runs —
 * prerendered HTML without JS shows everything. A short fallback reveals
 * anything already on screen in case the observer is slow to report.
 */
export function useInView<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add("hpf-js");
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" },
    );
    obs.observe(el);
    const fallback = window.setTimeout(() => {
      if (onScreen(el)) {
        setInView(true);
        obs.disconnect();
      }
    }, 1000);
    return () => {
      obs.disconnect();
      window.clearTimeout(fallback);
    };
  }, [threshold]);

  return { ref, inView };
}
