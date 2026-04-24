// Adds the 'visible' class to any element with class 'reveal' when it enters
// the viewport. Runs once per element (does not toggle back on scroll up).
//
// Usage:
//   import { initScrollReveal } from "./utils/scrollReveal";
//   useEffect(() => initScrollReveal(), []);
//
// Then in JSX:
//   <div className="reveal">Animates in</div>
//   <div className="reveal" style={{ transitionDelay: "0.1s" }}>Staggered</div>
//
// For grids, you can stagger via CSS nth-child:
//   .grid > .reveal:nth-child(2) { transition-delay: 0.1s }

let observer: IntersectionObserver | null = null;

function bindObserver(root: ParentNode = document) {
  if (!observer) return;
  root.querySelectorAll<HTMLElement>(".reveal:not(.visible)").forEach((el) => {
    observer!.observe(el);
  });
}

export function initScrollReveal(): () => void {
  if (typeof window === "undefined" || typeof IntersectionObserver === "undefined") {
    return () => {};
  }

  // Reuse a single observer across calls so re-mounts don't leak.
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer!.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.08 },
    );
  }

  bindObserver();

  // Watch the DOM so reveal elements added later (route changes, async data)
  // are picked up automatically.
  const mutation = new MutationObserver((mutations) => {
    for (const m of mutations) {
      m.addedNodes.forEach((node) => {
        if (node.nodeType !== 1) return;
        const el = node as HTMLElement;
        if (el.classList?.contains("reveal") && !el.classList.contains("visible")) {
          observer!.observe(el);
        }
        bindObserver(el);
      });
    }
  });
  mutation.observe(document.body, { childList: true, subtree: true });

  return () => {
    mutation.disconnect();
  };
}
