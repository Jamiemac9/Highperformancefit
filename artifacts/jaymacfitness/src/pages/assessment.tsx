import { useEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from "react";
import { ArrowLeft, ArrowRight, Check, MessageCircle, Phone, TriangleAlert } from "lucide-react";
import { apiPost } from "../lib/api";
import { SITE_CONFIG } from "../config";
import { packageById, type PricePackage } from "../data/packages";
import "../styles/hpf.css";
import "../styles/assessment.css";

/* ───────── questions ───────── */

type Flag = "warn" | "stop";
type Opt = { value: string; label: string; hint?: string; mod?: number; say?: string; flag?: Flag };
type ChoiceId =
  | "goal" | "timeline"
  | "experience" | "pt" | "solo" | "equipment"
  | "stairs" | "sitting" | "exertion" | "medication"
  | "sleep" | "water" | "steps" | "nutrition";
type Question = { id: ChoiceId; legend: string; brief: string; opts: Opt[]; cols?: 2 | 3 | 4 };

const Q: Record<ChoiceId, Question> = {
  goal: {
    id: "goal", legend: "What do you most want from training?", brief: "Goal", cols: 2,
    opts: [
      { value: "fat-loss", label: "Lose fat", hint: "Drop body fat and keep your muscle" },
      { value: "muscle", label: "Build muscle", hint: "More size and shape" },
      { value: "strength", label: "Get stronger", hint: "Strength and conditioning, heavier lifts" },
      { value: "performance", label: "Sport and performance", hint: "Speed, power and fitness for your sport" },
      { value: "health", label: "Move better, feel better", hint: "Ease aches, fix posture, look after your joints" },
    ],
  },
  timeline: {
    id: "timeline", legend: "Over what timeframe?", brief: "Timeline", cols: 3,
    opts: [
      { value: "3", label: "3 months", hint: "A focused push" },
      { value: "6", label: "6 months", hint: "Steady and sustainable" },
      { value: "12", label: "12 months", hint: "A full lifestyle change" },
    ],
  },
  experience: {
    id: "experience", legend: "How much weight training have you done?", brief: "Experience", cols: 2,
    opts: [
      { value: "beginner", label: "Not much", hint: "Less than a year", mod: 0, say: "We’ll start with how to move well, then load it up." },
      { value: "intermediate", label: "Some", hint: "One to three years", mod: 5, say: "Enough of a base to add weight week by week." },
      { value: "advanced", label: "Plenty", hint: "Three years or more", mod: 10, say: "We’ll plan blocks of heavier and lighter weeks." },
      { value: "returning", label: "Coming back after a break", hint: "Trained before, stopped for a while", mod: 2, say: "It comes back quicker than you think. We’ll ease you back in." },
    ],
  },
  pt: {
    id: "pt", legend: "How many 1-2-1 sessions a week would you like?", brief: "1-2-1 sessions a week", cols: 4,
    opts: [
      { value: "0", label: "None", hint: "Online coaching only" },
      { value: "1", label: "One", hint: "Technique and a push" },
      { value: "2", label: "Two", hint: "The sweet spot for most" },
      { value: "3", label: "Three", hint: "Maximum accountability" },
    ],
  },
  solo: {
    id: "solo", legend: "And how many sessions on your own?", brief: "Solo sessions a week", cols: 4,
    opts: [
      { value: "0", label: "None", hint: "Just our sessions" },
      { value: "1", label: "One" },
      { value: "2", label: "Two" },
      { value: "3+", label: "Three or more" },
    ],
  },
  equipment: {
    id: "equipment", legend: "What can you train with outside our sessions?", brief: "Kit outside sessions", cols: 2,
    opts: [
      { value: "gym", label: "A full gym", hint: "Barbells, cables, cardio machines" },
      { value: "home", label: "A home set-up", hint: "Dumbbells, a bench, maybe a pull-up bar" },
      { value: "bands", label: "Bands and a mat", hint: "Minimal kit at home" },
      { value: "none", label: "Nothing", hint: "Bodyweight only" },
    ],
  },
  stairs: {
    id: "stairs", legend: "How do three flights of stairs with heavy shopping feel?", brief: "Stairs with shopping", cols: 3,
    opts: [
      { value: "easy", label: "Easy", hint: "I walk straight up", mod: 0, say: "Good engine. We can work harder sooner." },
      { value: "puffed", label: "I get out of breath", hint: "But I recover within a minute", mod: -5, say: "Normal for most people starting out. Fitness builds quickly." },
      { value: "chest", label: "Chest discomfort or pain", hint: "Or severe breathlessness", mod: -20, flag: "stop", say: "Please get this checked by your GP before we train hard." },
    ],
  },
  sitting: {
    id: "sitting", legend: "How do your back, knees and neck feel after sitting for four hours or more?", brief: "After 4+ hours sitting", cols: 3,
    opts: [
      { value: "fine", label: "Fine", hint: "No stiffness", mod: 0, say: "Good. Nothing to fix there." },
      { value: "stiff", label: "A bit stiff", hint: "Tight back or hips", mod: -5, say: "Common with desk days. Warm-ups will include hip and upper-back mobility." },
      { value: "pain", label: "Regular pain", hint: "Frequent back or joint ache", mod: -15, flag: "warn", say: "We’ll work around it and build strength there carefully." },
    ],
  },
  exertion: {
    id: "exertion", legend: "Have you ever felt dizzy, faint or had chest tightness while exercising?", brief: "Dizzy, faint or chest tightness on exertion", cols: 3,
    opts: [
      { value: "never", label: "Never", mod: 0, say: "Good. Nothing holding us back there." },
      { value: "rarely", label: "Rarely", hint: "Only in heat or when dehydrated", mod: -10, flag: "warn", say: "We’ll keep an eye on effort and build up gradually." },
      { value: "yes", label: "Yes, or a doctor has advised caution", mod: -25, flag: "stop", say: "Please see your GP first. I’ll ask for written clearance before anything intense." },
    ],
  },
  medication: {
    id: "medication", legend: "Are you on prescribed medication for blood pressure, your heart or your joints?", brief: "Medication (BP, heart, joints)", cols: 2,
    opts: [
      { value: "no", label: "No", mod: 0 },
      { value: "yes", label: "Yes", mod: -10, flag: "warn", say: "Some medication changes how you respond to exercise. We’ll go through it on the call." },
    ],
  },
  sleep: {
    id: "sleep", legend: "How much do you sleep on an average night?", brief: "Sleep", cols: 4,
    opts: [
      { value: "<6", label: "Under 6 hours", mod: -12, say: "Sleep will hold your progress back more than anything. We’ll work on it." },
      { value: "6-7", label: "6 to 7 hours", mod: -5, say: "Okay, with room to improve." },
      { value: "7-8", label: "7 to 8 hours", mod: 5, say: "That’s a good recovery base." },
      { value: "8+", label: "Over 8 hours", mod: 8, say: "Great. Recovery won’t be the problem." },
    ],
  },
  water: {
    id: "water", legend: "How much water do you drink a day?", brief: "Water", cols: 3,
    opts: [
      { value: "<1.5", label: "Under 1.5 litres" },
      { value: "1.5-2.5", label: "1.5 to 2.5 litres" },
      { value: "3+", label: "3 litres or more" },
    ],
  },
  steps: {
    id: "steps", legend: "Roughly how many steps do you do a day?", brief: "Daily steps", cols: 3,
    opts: [
      { value: "<5k", label: "Under 5,000", hint: "Mostly sitting", mod: -5, say: "An easy win. We’ll build your steps up gradually." },
      { value: "5-9k", label: "5,000 to 9,000", hint: "Some walking", mod: 0, say: "A decent base." },
      { value: "10k+", label: "10,000 or more", hint: "On my feet a lot", mod: 5, say: "Great. That’s a lot of extra movement every day." },
    ],
  },
  nutrition: {
    id: "nutrition", legend: "How do you eat at the moment?", brief: "Nutrition", cols: 2,
    opts: [
      { value: "tracking", label: "I track calories or macros" },
      { value: "portions", label: "I watch my portions" },
      { value: "fasting", label: "Intermittent fasting" },
      { value: "none", label: "No real structure" },
    ],
  },
};

const STEPS: { title: string; short: string; choices: ChoiceId[] }[] = [
  { title: "About you", short: "You", choices: ["goal", "timeline"] },
  { title: "Your training", short: "Training", choices: ["experience", "pt", "solo", "equipment"] },
  { title: "Health check", short: "Health", choices: ["stairs", "sitting", "exertion", "medication"] },
  { title: "Your week", short: "Your week", choices: ["sleep", "water", "steps", "nutrition"] },
];
const LAST = STEPS.length; // results live at LAST + 1

type Details = { name: string; email: string; phone: string; age: string; occupation: string; injuries: string };
type Choices = Partial<Record<ChoiceId, string>>;

const pick = (id: ChoiceId, v?: string) => Q[id].opts.find((o) => o.value === v);
const labelOf = (id: ChoiceId, v?: string) => pick(id, v)?.label ?? "Not answered";
const firstName = (n: string) => n.trim().split(/\s+/)[0] || "";

function readiness(c: Choices, stress: number) {
  let s = 100;
  let scored = false;
  (Object.keys(Q) as ChoiceId[]).forEach((id) => {
    const o = pick(id, c[id]);
    if (o?.mod !== undefined) {
      s += o.mod;
      scored = true;
    }
  });
  if (stress >= 8) s -= 10;
  else if (stress >= 6) s -= 5;
  return { score: Math.max(30, Math.min(100, s)), scored };
}

function band(score: number) {
  if (score >= 80) return { label: "Ready to push", line: "You’ve got a good base. We can build intensity fairly quickly." };
  if (score >= 65) return { label: "Solid base", line: "A few things to tidy up while we build. Very normal." };
  return { label: "Foundations first", line: "We start steadier and build up. That’s how it sticks." };
}

function suggested(c: Choices): PricePackage["id"] {
  if (c.pt === "0") return "online";
  if (c.pt === "1") return "fresh-start";
  return "monthly";
}

function flags(c: Choices) {
  const stop = c.exertion === "yes" || c.stairs === "chest";
  const warn = !stop && (c.exertion === "rarely" || c.medication === "yes" || c.sitting === "pain");
  return { stop, warn };
}

function focusPoints(c: Choices, d: Details, stress: number) {
  const out: { title: string; body: string }[] = [];
  if (c.sleep === "<6" || c.sleep === "6-7") {
    out.push({ title: "Sleep first", body: "Under seven hours slows recovery and makes hunger harder to manage. We’ll set up a simple wind-down routine you can actually keep." });
  } else {
    out.push({ title: "Recovery is on your side", body: "You sleep well, so we can push the training harder and progress faster." });
  }
  if (c.equipment === "none" || c.equipment === "bands") {
    out.push({ title: "Training without a gym", body: "Your solo workouts will use bodyweight and bands, with tempo and pauses to keep them hard enough to work." });
  } else if (c.equipment) {
    out.push({ title: "Using the kit you’ve got", body: "Your solo sessions will be written for your gym or set-up, so you know exactly what to do when I’m not there." });
  }
  if (stress >= 7) {
    out.push({ title: "Training that takes the edge off", body: "When work is heavy, we adjust the session on the day, so training lowers your stress rather than adding to it." });
  }
  if ((c.sitting && c.sitting !== "fine") || d.injuries.trim()) {
    out.push({ title: "Joints and posture", body: "Warm-ups will target the areas that bother you, and we’ll strengthen around old injuries rather than avoid them." });
  }
  if (c.nutrition === "none") {
    out.push({ title: "Simple nutrition", body: "No meal plans you’ll quit after a week. We start with a couple of habits that fit your normal day." });
  }
  if (c.steps === "<5k") {
    out.push({ title: "More steps", body: "We’ll build your daily steps up gradually. It’s the easiest win there is." });
  }
  return out;
}

/* ───────── page ───────── */

export default function Assessment() {
  const [step, setStep] = useState(0);
  const [details, setDetails] = useState<Details>({ name: "", email: "", phone: "", age: "", occupation: "", injuries: "" });
  const [choices, setChoices] = useState<Choices>({});
  const [stress, setStress] = useState(5);
  const [errors, setErrors] = useState<Set<string>>(new Set());
  const [invited, setInvited] = useState("");
  const [plan, setPlan] = useState<PricePackage["id"] | null>(null);
  const [send, setSend] = useState<"idle" | "sending" | "sent" | "failed">("idle");
  const sentRef = useRef(false);
  const headRef = useRef<HTMLHeadingElement>(null);

  // A link Jay sends can carry the client's name: /assessment?name=Sarah
  useEffect(() => {
    const n = new URLSearchParams(window.location.search).get("name")?.trim().slice(0, 60) ?? "";
    if (n) {
      setInvited(n);
      setDetails((d) => (d.name ? d : { ...d, name: n }));
    }
  }, []);

  const { score, scored } = useMemo(() => readiness(choices, stress), [choices, stress]);
  const planId = plan ?? suggested(choices);
  const results = step === LAST + 1;

  useEffect(() => {
    if (step === 0) return;
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    headRef.current?.focus({ preventScroll: true });
  }, [step]);

  useEffect(() => {
    if (results) celebrate();
  }, [results]);

  const setDetail = (k: keyof Details, v: string) => {
    setDetails((d) => ({ ...d, [k]: v }));
    if (errors.has(k)) setErrors((e) => new Set([...e].filter((x) => x !== k)));
  };
  const choose = (id: ChoiceId, v: string) => {
    setChoices((c) => ({ ...c, [id]: v }));
    if (id === "pt") setPlan(null);
    if (errors.has(id)) setErrors((e) => new Set([...e].filter((x) => x !== id)));
  };

  function validate(s: number) {
    const bad = new Set<string>();
    if (s === 1) {
      if (!details.name.trim()) bad.add("name");
      if (!/^\S+@\S+\.\S+$/.test(details.email.trim())) bad.add("email");
      if (details.phone.replace(/\D/g, "").length < 10) bad.add("phone");
    }
    STEPS[s - 1].choices.forEach((id) => !choices[id] && bad.add(id));
    setErrors(bad);
    if (bad.size) {
      const first = document.querySelector<HTMLElement>(`[data-field="${[...bad][0]}"]`);
      first?.scrollIntoView({ behavior: "smooth", block: "center" });
      first?.querySelector<HTMLElement>("input, textarea")?.focus({ preventScroll: true });
    }
    return bad.size === 0;
  }

  const brief = () => {
    const pkg = packageById(planId);
    const f = flags(choices);
    const lines = [
      `Goal: ${labelOf("goal", choices.goal)}`,
      `Timeline: ${labelOf("timeline", choices.timeline)}`,
      `Readiness score: ${score}/100 (${band(score).label})`,
      `Package that fits: ${pkg.name} (${pkg.price})${choices.pt === "3" ? " — wants 3 a week, price the extra on the call" : ""}`,
      f.stop ? "HEALTH FLAG: needs GP clearance before intense training" : f.warn ? "Health note: check on the call (see answers below)" : "",
      "",
      "ABOUT",
      `Name: ${details.name.trim()}`,
      `Phone: ${details.phone.trim()} · Email: ${details.email.trim()}`,
      `Age: ${details.age || "—"} · Occupation: ${details.occupation.trim() || "—"}`,
      "",
      "TRAINING",
      ...(["experience", "pt", "solo", "equipment"] as ChoiceId[]).map((id) => `${Q[id].brief}: ${labelOf(id, choices[id])}`),
      "",
      "HEALTH",
      ...(["stairs", "sitting", "exertion", "medication"] as ChoiceId[]).map((id) => `${Q[id].brief}: ${labelOf(id, choices[id])}`),
      `Injuries / surgeries: ${details.injuries.trim() || "None mentioned"}`,
      "",
      "WEEK",
      ...(["sleep", "water", "steps", "nutrition"] as ChoiceId[]).map((id) => `${Q[id].brief}: ${labelOf(id, choices[id])}`),
      `Stress: ${stress}/10`,
      invited ? "\nCame from a link Jay sent." : "",
    ];
    return lines.filter((l, i, a) => !(l === "" && a[i - 1] === "")).join("\n").trim();
  };

  async function submit() {
    if (sentRef.current) return;
    sentRef.current = true;
    setSend("sending");
    try {
      await apiPost("/api/enquiries", {
        name: details.name.trim(),
        email: details.email.trim(),
        phone: details.phone.trim(),
        message: brief(),
        source: invited ? "assessment (sent link)" : "assessment",
      });
      setSend("sent");
    } catch {
      sentRef.current = false;
      setSend("failed");
    }
  }

  function next() {
    if (step === 0) return setStep(1);
    if (!validate(step)) return;
    if (step === LAST) {
      setStep(LAST + 1);
      void submit();
      return;
    }
    setStep(step + 1);
  }
  const back = () => {
    setErrors(new Set());
    setStep((s) => Math.max(0, s - 1));
  };

  const pct = results ? 100 : step === 0 ? 0 : Math.round(((step - 1) / LAST) * 100);
  const first = firstName(details.name) || firstName(invited);

  return (
    <div className="hpf hpa">
      <header className="hpa-top">
        <div className="hpa-top__row">
          <a className="hpf-nav__brand hpa-brand" href="/" aria-label="High Performance Fit, home">
            <img src="/images/site/hpf-logo-96.webp" srcSet="/images/site/hpf-logo-96.webp 1x, /images/site/hpf-logo-192.webp 2x" width={35} height={36} alt="" />
            <span className="hpf-nav__word">High Performance Fit</span>
          </a>
          {step > 0 && (
            <div className="hpa-score" aria-live="polite" data-ready={scored}>
              <Ring value={scored ? score : 0} />
              <span>
                <span className="hpa-score__num">{scored ? score : "–"}</span>
                <span className="hpa-score__label">Readiness</span>
              </span>
            </div>
          )}
        </div>
        <div className="hpa-progress" role="progressbar" aria-label="Assessment progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
          <span style={{ scale: `${pct / 100} 1` }} />
        </div>
      </header>

      <main className="hpa-main">
        {step > 0 && (
          <ol className="hpa-chips" aria-label="Sections">
            {[...STEPS.map((s) => s.short), "Results"].map((label, i) => {
              const n = i + 1;
              const state = n < step ? "done" : n === step ? "now" : "todo";
              return (
                <li key={label} data-state={state} aria-current={state === "now" ? "step" : undefined}>
                  <span className="hpa-chips__dot">{state === "done" ? <Check aria-hidden="true" strokeWidth={3} /> : n}</span>
                  {label}
                </li>
              );
            })}
          </ol>
        )}

        {step === 0 && (
          <section className="hpa-intro hpa-panel" aria-labelledby="hpa-title">
            <div>
              <h1 id="hpa-title" className="hpf-h1">
                {first ? <>{first}, this is the assessment I mentioned.</> : <>Four minutes. Then we both know where you’re starting.</>}
              </h1>
              <p className="hpf-lede">
                A few questions about your goals, your training, your health and your week. At the end you’ll see your readiness
                score and the package that fits, and your answers come straight to me, so our first chat isn’t spent on forms.
              </p>
              <ul className="hpa-intro__facts">
                <li>Four short sections</li>
                <li>About four minutes</li>
                <li>Nothing to pay, no obligation</li>
              </ul>
              <button type="button" className="hpf-btn hpf-btn--fill hpa-intro__go" onClick={next}>
                Start the assessment <ArrowRight aria-hidden="true" strokeWidth={2} />
              </button>
              <p className="hpa-sign">
                <img src="/images/site/jay-portrait-600.webp" width={40} height={40} alt="" />
                Jay · Level 4 coach, Foundry Gym, Kings Heath
              </p>
            </div>
            <figure className="hpa-intro__img">
              <img
                src="/images/site/jay-portrait-600.webp"
                srcSet="/images/site/jay-portrait-600.webp 600w, /images/site/jay-portrait-1000.webp 1000w"
                sizes="(min-width: 60rem) 26rem, 100vw"
                width={600}
                height={750}
                alt="Jay, personal trainer at High Performance Fit"
              />
            </figure>
          </section>
        )}

        {step >= 1 && step <= LAST && (
          <form className="hpa-panel" key={step} noValidate onSubmit={(e) => { e.preventDefault(); next(); }} aria-labelledby="hpa-step-title">
            <p className="hpa-count">Step {step} of {LAST}</p>
            <h1 id="hpa-step-title" className="hpf-h2" ref={headRef} tabIndex={-1}>{STEPS[step - 1].title}</h1>

            {step === 1 && (
              <div className="hpa-grid">
                <Field id="name" label="Full name" error={errors.has("name") && "Tell me your name."}>
                  <input id="name" className="hpf-input" autoComplete="name" value={details.name} onChange={(e) => setDetail("name", e.target.value)} aria-invalid={errors.has("name")} />
                </Field>
                <Field id="email" label="Email" error={errors.has("email") && "That email doesn’t look right."}>
                  <input id="email" type="email" inputMode="email" className="hpf-input" autoComplete="email" value={details.email} onChange={(e) => setDetail("email", e.target.value)} aria-invalid={errors.has("email")} />
                </Field>
                <Field id="phone" label="Mobile" note="for WhatsApp" error={errors.has("phone") && "I’ll need a number to reach you."}>
                  <input id="phone" type="tel" inputMode="tel" className="hpf-input" autoComplete="tel" value={details.phone} onChange={(e) => setDetail("phone", e.target.value)} aria-invalid={errors.has("phone")} />
                </Field>
                <div className="hpa-grid hpa-grid--pair">
                  <Field id="age" label="Age" note="optional">
                    <input id="age" type="number" inputMode="numeric" min={16} max={90} className="hpf-input" value={details.age} onChange={(e) => setDetail("age", e.target.value)} />
                  </Field>
                  <Field id="occupation" label="Job" note="optional">
                    <input id="occupation" className="hpf-input" autoComplete="organization-title" value={details.occupation} onChange={(e) => setDetail("occupation", e.target.value)} />
                  </Field>
                </div>
              </div>
            )}

            {STEPS[step - 1].choices.map((id) => (
              <Choice key={id} q={Q[id]} value={choices[id]} onPick={choose} error={errors.has(id)} />
            ))}

            {step === 3 && (
              <Field id="injuries" label="Injuries, operations or anything I should know about" note="optional">
                <textarea id="injuries" className="hpf-input" rows={3} value={details.injuries} onChange={(e) => setDetail("injuries", e.target.value)} />
              </Field>
            )}

            {step === 4 && (
              <div className="hpa-q hpa-stress">
                <label htmlFor="stress" className="hpa-q__legend">
                  How stressful is your day-to-day, from 1 to 10?
                  <output htmlFor="stress" className="hpa-stress__val">{stress}</output>
                </label>
                <input id="stress" type="range" min={1} max={10} value={stress} onChange={(e) => setStress(Number(e.target.value))} />
                <div className="hpa-stress__scale" aria-hidden="true">
                  <span>Calm</span>
                  <span>Balanced</span>
                  <span>Running on empty</span>
                </div>
              </div>
            )}

            <div className="hpa-nav">
              <button type="button" className="hpf-btn hpf-btn--line" onClick={back}>
                <ArrowLeft aria-hidden="true" strokeWidth={2} /> Back
              </button>
              <button type="submit" className="hpf-btn hpf-btn--fill">
                {step === LAST ? "Send to Jay and see my results" : "Next"} <ArrowRight aria-hidden="true" strokeWidth={2} />
              </button>
            </div>
            {step === LAST && <p className="hpa-small">Your answers go to Jay only. They’re never shared or sold.</p>}
          </form>
        )}

        {results && (
          <Results
            first={first}
            score={score}
            choices={choices}
            details={details}
            stress={stress}
            planId={planId}
            setPlan={setPlan}
            send={send}
            retry={submit}
            headRef={headRef}
          />
        )}
      </main>
      <canvas className="hpa-confetti" aria-hidden="true" />
    </div>
  );
}

/* ───────── results ───────── */

function Results({
  first, score, choices, details, stress, planId, setPlan, send, retry, headRef,
}: {
  first: string;
  score: number;
  choices: Choices;
  details: Details;
  stress: number;
  planId: PricePackage["id"];
  setPlan: (id: PricePackage["id"]) => void;
  send: "idle" | "sending" | "sent" | "failed";
  retry: () => void;
  headRef: RefObject<HTMLHeadingElement | null>;
}) {
  const b = band(score);
  const f = flags(choices);
  const pkg = packageById(planId);
  const points = focusPoints(choices, details, stress);
  const options = (["online", "fresh-start", "monthly", "group"] as const).map(packageById);
  const wa =
    `Hi Jay, I’ve just done the assessment on your site.\n\n` +
    `Name: ${details.name.trim()}\n` +
    `Goal: ${labelOf("goal", choices.goal)}\n` +
    `Readiness score: ${score}/100\n` +
    `Interested in: ${pkg.name} (${pkg.price})\n\n` +
    `Can we book the free chat?`;

  return (
    <section className="hpa-panel hpa-results" aria-labelledby="hpa-res-title">
      <h1 id="hpa-res-title" className="hpf-h2" ref={headRef} tabIndex={-1}>
        {first ? `${first}, here’s where you’re starting.` : "Here’s where you’re starting."}
      </h1>
      <p className="hpa-sent" role="status" data-state={send}>
        {send === "sending" && "Sending your answers to me…"}
        {send === "sent" && (<><Check aria-hidden="true" strokeWidth={3} /> Your answers are with me. I usually reply the same day.</>)}
        {send === "failed" && (
          <>
            That didn’t send. Tap WhatsApp below and it comes straight to me, or{" "}
            <button type="button" className="hpa-linkbtn" onClick={retry}>try again</button>.
          </>
        )}
      </p>

      <div className="hpa-board">
        <div className="hpa-board__score">
          <Ring value={score} big />
          <div>
            <p className="hpa-board__num"><span>{score}</span>/100</p>
            <p className="hpa-board__band">{b.label}</p>
            <p className="hpa-board__line">{b.line}</p>
          </div>
        </div>
        <dl className="hpa-board__facts">
          <div>
            <dt>Goal</dt>
            <dd>{labelOf("goal", choices.goal)}, {labelOf("timeline", choices.timeline).toLowerCase()}</dd>
          </div>
          <div>
            <dt>Your week</dt>
            <dd>
              {choices.pt === "0" ? "Online coaching" : `${labelOf("pt", choices.pt)} 1-2-1 a week`}
              {choices.solo && choices.solo !== "0" ? ` + ${labelOf("solo", choices.solo).toLowerCase()} on your own` : ""}
            </dd>
          </div>
          <div>
            <dt>Training kit</dt>
            <dd>{labelOf("equipment", choices.equipment)}</dd>
          </div>
        </dl>
      </div>
      <p className="hpa-small">The score is a rough guide from your answers, not a medical assessment.</p>

      {(f.stop || f.warn) && (
        <div className="hpa-flag" data-level={f.stop ? "stop" : "warn"}>
          <TriangleAlert aria-hidden="true" strokeWidth={2} />
          <div>
            <p className="hpa-flag__title">{f.stop ? "See your GP before we train hard" : "Something to talk through first"}</p>
            <p>
              {f.stop
                ? "Chest discomfort, dizziness or fainting during exercise needs checking by a doctor first. I’ll ask for written GP clearance before anything intense. We can still have the free chat in the meantime."
                : "Some of your answers mean we’ll start steadier, with extra mobility work and closer monitoring. We’ll go through it properly on the free chat."}
            </p>
          </div>
        </div>
      )}

      <h2 className="hpf-h3 hpa-sub">What I’d focus on</h2>
      <ol className="hpa-focus">
        {points.map((p) => (
          <li key={p.title}>
            <p className="hpa-focus__title">{p.title}</p>
            <p>{p.body}</p>
          </li>
        ))}
      </ol>

      <h2 className="hpf-h3 hpa-sub">The package that fits</h2>
      <fieldset className="hpa-plans">
        <legend className="hpf-sr">Choose a package</legend>
        {options.map((o) => (
          <label key={o.id} className="hpa-plan" data-checked={o.id === planId}>
            <input type="radio" name="plan" value={o.id} checked={o.id === planId} onChange={() => setPlan(o.id)} />
            <span className="hpa-plan__name">{o.name}</span>
            <span className="hpa-plan__price">{o.price}</span>
          </label>
        ))}
      </fieldset>
      <div className="hpa-pkg">
        <p className="hpa-pkg__head">
          <span className="hpf-h3">{pkg.name}</span>
          <span className="hpa-pkg__price">{pkg.price} <span>{pkg.per}</span></span>
        </p>
        <p>{pkg.detail}</p>
        {choices.pt === "3" && planId === "monthly" && (
          <p className="hpa-small">Three a week is more than the monthly package covers. I’ll price the extra sessions with you on the call.</p>
        )}
      </div>

      <div className="hpa-cta">
        <a className="hpf-btn hpf-btn--fill" href={`${SITE_CONFIG.WHATSAPP_URL}?text=${encodeURIComponent(wa)}`} target="_blank" rel="noopener noreferrer">
          <MessageCircle aria-hidden="true" strokeWidth={2} /> WhatsApp me to book the free chat
        </a>
        <a className="hpf-btn hpf-btn--line" href={`tel:${SITE_CONFIG.PHONE_TEL}`}>
          <Phone aria-hidden="true" strokeWidth={2} /> Call {SITE_CONFIG.PHONE}
        </a>
      </div>
      <p className="hpa-small"><a href="/">Back to the website</a></p>
    </section>
  );
}

/* ───────── bits ───────── */

function Field({ id, label, note, error, children }: { id: string; label: string; note?: string; error?: string | false; children: ReactNode }) {
  return (
    <div className="hpf-field" data-field={id}>
      <label htmlFor={id}>
        {label} {note && <span>({note})</span>}
      </label>
      {children}
      {error && <p className="hpa-err">{error}</p>}
    </div>
  );
}

function Choice({ q, value, onPick, error }: { q: Question; value?: string; onPick: (id: ChoiceId, v: string) => void; error: boolean }) {
  const said = pick(q.id, value);
  return (
    <fieldset className="hpa-q" data-field={q.id} aria-invalid={error || undefined}>
      <legend className="hpa-q__legend">{q.legend}</legend>
      <div className="hpa-opts" data-cols={q.cols ?? 2}>
        {q.opts.map((o) => (
          <label key={o.value} className="hpa-opt" data-checked={value === o.value} data-flag={o.flag}>
            <input type="radio" name={q.id} value={o.value} checked={value === o.value} onChange={() => onPick(q.id, o.value)} />
            <span className="hpa-opt__label">{o.label}</span>
            {o.hint && <span className="hpa-opt__hint">{o.hint}</span>}
          </label>
        ))}
      </div>
      <p className="hpa-say" aria-live="polite" data-flag={said?.flag}>{said?.say ?? ""}</p>
      {error && <p className="hpa-err">Pick one to carry on.</p>}
    </fieldset>
  );
}

function Ring({ value, big = false }: { value: number; big?: boolean }) {
  const r = 16;
  const c = 2 * Math.PI * r;
  return (
    <svg className="hpa-ring" data-big={big} viewBox="0 0 40 40" aria-hidden="true">
      <circle cx="20" cy="20" r={r} className="hpa-ring__track" />
      <circle cx="20" cy="20" r={r} className="hpa-ring__fill" strokeDasharray={c} strokeDashoffset={c * (1 - value / 100)} />
    </svg>
  );
}

/** A short burst of champagne confetti when the results open. Skipped for reduced motion. */
function celebrate() {
  if (typeof window === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const canvas = document.querySelector<HTMLCanvasElement>(".hpa-confetti");
  const ctx = canvas?.getContext("2d");
  if (!canvas || !ctx) return;
  const css = getComputedStyle(document.documentElement);
  const colours = ["--hpf-accent", "--hpf-accent-hover", "--hpf-ink", "--hpf-ink-2"].map((v) => css.getPropertyValue(v).trim() || "#c9a45c");
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  ctx.scale(dpr, dpr);
  const w = window.innerWidth;
  const h = window.innerHeight;
  const bits = Array.from({ length: w < 600 ? 50 : 90 }, () => ({
    x: Math.random() * w,
    y: -Math.random() * h * 0.6,
    s: Math.random() * 6 + 4,
    vy: Math.random() * 2.5 + 2,
    vx: Math.random() * 1.6 - 0.8,
    r: Math.random() * 360,
    c: colours[Math.floor(Math.random() * colours.length)],
  }));
  const start = performance.now();
  const frame = (t: number) => {
    ctx.clearRect(0, 0, w, h);
    const fade = Math.max(0, 1 - (t - start) / 3800);
    bits.forEach((p) => {
      p.y += p.vy;
      p.x += p.vx;
      p.r += 3;
      ctx.save();
      ctx.globalAlpha = fade;
      ctx.translate(p.x, p.y);
      ctx.rotate((p.r * Math.PI) / 180);
      ctx.fillStyle = p.c;
      ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2);
      ctx.restore();
    });
    if (fade > 0) requestAnimationFrame(frame);
    else ctx.clearRect(0, 0, w, h);
  };
  requestAnimationFrame(frame);
}
