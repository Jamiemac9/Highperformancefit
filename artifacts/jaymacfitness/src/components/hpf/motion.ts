import { useEffect } from "react";
import { onScreen } from "./useInView";

/**
 * Site motion layer (pattern borrowed from the Cogent site, restyled for HPF):
 *  · Lenis smooth scroll driven by the GSAP ticker, anchor links glide.
 *  · Hero drifts back as you scroll; statement words light up as you read.
 *  · Results rail pins and scrolls sideways on desktop (native swipe on mobile).
 *  · Reveals + staggers, image parallax, final CTA scale-in.
 *  · Tilt cards and magnetic buttons for mouse users only.
 *  · Scroll-spy for the nav.
 * Libraries load after first paint (separate chunk) and nothing runs when the
 * visitor prefers reduced motion. Content is never hidden without JS.
 */

type Lenis = import("lenis").default;
declare global {
  interface Window {
    __hpfLenis?: Lenis | null;
  }
}

const NAV_OFFSET = -88;

export function scrollToTarget(target: Element) {
  const lenis = window.__hpfLenis;
  if (lenis) lenis.scrollTo(target as HTMLElement, { offset: NAV_OFFSET, duration: 1.3 });
  else target.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function lockScroll(locked: boolean) {
  const lenis = window.__hpfLenis;
  if (!lenis) return;
  if (locked) lenis.stop();
  else lenis.start();
}

/** `page` is a key: change it (e.g. per route) to re-initialise the effects. */
export function useSiteMotion(page: string) {
  useEffect(() => {
    const html = document.documentElement;
    html.classList.add("hpf-js");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const cleanups: Array<() => void> = [];
    let cancelled = false;

    // Hero intro: masked lines rise once fonts are ready (no loader screen).
    const intro = () => requestAnimationFrame(() => requestAnimationFrame(() => html.classList.add("hpf-intro")));
    if (document.fonts?.ready) document.fonts.ready.then(intro);
    else intro();
    // Never leave the headline masked (e.g. tab opened in the background, where rAF pauses).
    const introFallback = window.setTimeout(() => html.classList.add("hpf-intro"), 900);
    cleanups.push(() => window.clearTimeout(introFallback));

    // Anchor links glide (works with or without Lenis).
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute("href") || "";
      const hash = href.startsWith("#") ? href : href.startsWith("/#") && location.pathname === "/" ? href.slice(1) : "";
      if (hash.length < 2) return;
      const target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      history.replaceState(null, "", hash);
      scrollToTarget(target);
    };
    document.addEventListener("click", onClick);
    cleanups.push(() => document.removeEventListener("click", onClick));

    // Scroll-spy: highlight the nav link for the section in the middle of the screen.
    const spyLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>(".hpf-nav__links a[href*='#']"));
    if (spyLinks.length && "IntersectionObserver" in window) {
      const spy = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (!en.isIntersecting) return;
            spyLinks.forEach((l) => l.classList.toggle("is-active", l.getAttribute("href")?.endsWith(`#${en.target.id}`) ?? false));
          });
        },
        { rootMargin: "-48% 0px -48% 0px" },
      );
      spyLinks.forEach((l) => {
        const id = l.getAttribute("href")?.split("#")[1];
        const el = id ? document.getElementById(id) : null;
        if (el) spy.observe(el);
      });
      cleanups.push(() => spy.disconnect());
    }

    if (reduce) {
      return () => cleanups.forEach((fn) => fn());
    }

    // Generic focus-pull for any [data-motion-split] block (used on inner pages).
    const splits = Array.from(document.querySelectorAll<HTMLElement>("[data-motion-split]"));
    if (splits.length && "IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (!en.isIntersecting) return;
            (en.target as HTMLElement).dataset.in = "true";
            io.unobserve(en.target);
          });
        },
        { rootMargin: "0px 0px -10% 0px", threshold: 0.12 },
      );
      splits.forEach((el) => {
        el.classList.add("hpf-reveal");
        io.observe(el);
      });
      // Safety net: never leave on-screen content blurred if the observer is slow.
      const fallback = window.setTimeout(() => {
        splits.forEach((el) => {
          if (onScreen(el)) el.dataset.in = "true";
        });
      }, 1000);
      cleanups.push(() => {
        io.disconnect();
        window.clearTimeout(fallback);
      });
    }
    html.classList.add("hpf-motion");
    cleanups.push(() => html.classList.remove("hpf-motion"));

    // Tilt + magnetic: mouse/trackpad only.
    if (fine) {
      document.querySelectorAll<HTMLElement>("[data-tilt]").forEach((el) => {
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width;
          const py = (e.clientY - r.top) / r.height;
          el.classList.add("is-tilting");
          el.style.setProperty("--ry", `${((px - 0.5) * 8).toFixed(2)}deg`);
          el.style.setProperty("--rx", `${((0.5 - py) * 6).toFixed(2)}deg`);
          el.style.setProperty("--gx", `${(px * 100).toFixed(1)}%`);
          el.style.setProperty("--gy", `${(py * 100).toFixed(1)}%`);
        };
        const leave = () => {
          el.classList.remove("is-tilting");
          el.style.setProperty("--rx", "0deg");
          el.style.setProperty("--ry", "0deg");
        };
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        cleanups.push(() => {
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerleave", leave);
        });
      });
      document.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((b) => {
        const move = (e: PointerEvent) => {
          const r = b.getBoundingClientRect();
          const x = e.clientX - r.left - r.width / 2;
          const y = e.clientY - r.top - r.height / 2;
          b.style.translate = `${(x * 0.16).toFixed(1)}px ${(y * 0.26).toFixed(1)}px`;
        };
        const leave = () => {
          b.style.translate = "";
        };
        b.addEventListener("pointermove", move);
        b.addEventListener("pointerleave", leave);
        cleanups.push(() => {
          b.removeEventListener("pointermove", move);
          b.removeEventListener("pointerleave", leave);
        });
      });
    }

    // Split statement text into words for the read-along effect.
    document.querySelectorAll<HTMLElement>("[data-words]").forEach((p) => {
      if (p.dataset.split) return;
      p.dataset.split = "1";
      const frag = document.createDocumentFragment();
      Array.from(p.childNodes).forEach((node) => {
        const hl = node.nodeType === 1;
        (node.textContent || "").split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) return void frag.appendChild(document.createTextNode(" "));
          const s = document.createElement("span");
          s.className = hl ? "w hl" : "w";
          s.textContent = part;
          frag.appendChild(s);
        });
      });
      p.textContent = "";
      p.appendChild(frag);
    });

    // GSAP + Lenis: load after first paint so they never delay the hero.
    const start = async () => {
      const [{ default: gsap }, { ScrollTrigger }, { default: LenisCtor }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
        import("lenis"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      ScrollTrigger.config({ ignoreMobileResize: true });

      const lenis = new LenisCtor({ lerp: 0.1, smoothWheel: true });
      window.__hpfLenis = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      const tick = (t: number) => lenis.raf(t * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      cleanups.push(() => {
        gsap.ticker.remove(tick);
        lenis.destroy();
        window.__hpfLenis = null;
      });

      const mm = gsap.matchMedia();
      mm.add({ desk: "(min-width: 60rem)", mob: "(max-width: 59.99rem)" }, (ctx) => {
        const desk = !!ctx.conditions?.desk;

        // Hero drifts back and fades as the page moves on.
        const hero = document.querySelector(".hpf-hero");
        if (hero) {
          gsap.fromTo(".hpf-hero__text", { yPercent: 0, autoAlpha: 1 }, {
            yPercent: -10,
            autoAlpha: 0.15,
            ease: "none",
            scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true },
          });
          gsap.fromTo(".hpf-hero__media img", { scale: 1, yPercent: 0 }, {
            scale: 1.08,
            yPercent: desk ? 6 : 4,
            ease: "none",
            scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true },
          });
        }

        // Statement: words light up as you read; pinned on desktop.
        document.querySelectorAll<HTMLElement>("[data-statement]").forEach((sec) => {
          const words = sec.querySelectorAll(".w");
          if (!words.length) return;
          gsap.set(words, { opacity: 0.14 });
          const tl = gsap.timeline({
            scrollTrigger: desk
              ? { trigger: sec, start: "top top", end: "+=120%", pin: true, scrub: 0.6, anticipatePin: 1 }
              : { trigger: sec, start: "top 80%", end: "bottom 60%", scrub: 0.6 },
          });
          tl.to(words, { opacity: 1, ease: "none", stagger: 0.06, duration: 0.4 });
          const after = sec.querySelector("[data-statement-after]");
          if (after) tl.from(after, { autoAlpha: 0.15, y: 24, duration: 0.8, ease: "power2.out" }, "-=0.2");
        });

        // Results rail: pinned sideways scroll on desktop only.
        const pinned: HTMLElement[] = [];
        document.querySelectorAll<HTMLElement>("[data-rail]").forEach((sec) => {
          if (!desk) return;
          pinned.push(sec);
          const track = sec.querySelector<HTMLElement>("[data-rail-track]");
          const vp = sec.querySelector<HTMLElement>("[data-rail-viewport]");
          const bar = sec.querySelector<HTMLElement>("[data-rail-progress]");
          if (!track || !vp) return;
          sec.classList.add("is-pinned");
          vp.scrollLeft = 0;
          const dist = () => Math.max(0, track.scrollWidth - vp.clientWidth);
          const tween = gsap.to(track, {
            x: () => -dist(),
            ease: "none",
            scrollTrigger: { trigger: sec, start: "top top", end: () => `+=${dist()}`, pin: true, scrub: 0.6, invalidateOnRefresh: true, anticipatePin: 1 },
          });
          if (bar)
            gsap.fromTo(bar, { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: sec, start: "top top", end: () => `+=${dist()}`, scrub: true, invalidateOnRefresh: true } });
          track.querySelectorAll<HTMLElement>("[data-rail-card]").forEach((card) => {
            gsap.fromTo(
              card,
              { y: 60, rotate: 2, autoAlpha: 0.4 },
              { y: 0, rotate: 0, autoAlpha: 1, ease: "none", scrollTrigger: { trigger: card, containerAnimation: tween, start: "left 100%", end: "left 65%", scrub: true } },
            );
          });
        });

        // Reveals and staggered lists.
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) =>
          gsap.from(el, { y: 40, autoAlpha: 0.2, duration: 1.1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%", once: true } }),
        );
        gsap.utils.toArray<HTMLElement>("[data-motion-stagger]").forEach((g) =>
          gsap.from(g.children, { y: 36, autoAlpha: 0.2, duration: 0.9, stagger: 0.08, ease: "power3.out", scrollTrigger: { trigger: g, start: "top 86%", once: true } }),
        );

        // Photo parallax inside its frame.
        gsap.utils.toArray<HTMLElement>("[data-parallax-img]").forEach((img) =>
          gsap.fromTo(img, { yPercent: -8, scale: 1.12 }, { yPercent: 8, scale: 1.12, ease: "none", scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: true } }),
        );

        // Final call to action scales into place.
        gsap.utils.toArray<HTMLElement>("[data-final]").forEach((el) =>
          gsap.fromTo(el, { scale: 0.86, autoAlpha: 0.3 }, { scale: 1, autoAlpha: 1, ease: "none", scrollTrigger: { trigger: el, start: "top 92%", end: "top 55%", scrub: true } }),
        );

        return () => pinned.forEach((sec) => sec.classList.remove("is-pinned"));
      });
      cleanups.push(() => mm.revert());

      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener("load", refresh);
      document.fonts?.ready.then(refresh);
      cleanups.push(() => window.removeEventListener("load", refresh));
    };

    const idle = (window as any).requestIdleCallback as ((cb: () => void, o?: { timeout: number }) => number) | undefined;
    if (idle) idle(() => void start(), { timeout: 1200 });
    else window.setTimeout(() => void start(), 200);

    return () => {
      cancelled = true;
      cleanups.reverse().forEach((fn) => fn());
    };
  }, [page]);
}
