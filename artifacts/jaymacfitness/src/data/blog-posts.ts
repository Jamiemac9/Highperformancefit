// Blog content lives here so both the list page and the individual post pages
// share a single source of truth. Schema for prerendering is defined
// separately in prerender/run.mjs (which cannot import TypeScript).
import cmsPosts from "./blog-posts-cms.generated.json";

export type BlogSegment = string | { text: string; href?: string };
export type BlogParagraph = string | BlogSegment[];

export interface BlogSection {
  heading?: string;
  paragraphs?: BlogParagraph[];
  list?: string[];
}

export interface BlogFAQ {
  question: string;
  answer: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  dateModified?: string;
  readTime: string;
  tags: string[];
  metaTitle: string;
  metaDescription: string;
  relatedService: { href: string; label: string; blurb: string };
  intro: string;
  sections: BlogSection[];
  faq?: BlogFAQ[];
}

const HARDCODED_POSTS: BlogPost[] = [
  {
    slug: "best-personal-trainer-birmingham",
    title: "How to Find the Best Personal Trainer in Birmingham",
    excerpt:
      "Choosing a personal trainer is one of the most important fitness decisions you'll make. Here's exactly what to look for — and the questions that separate a great coach from an average one.",
    date: "2026-06-20",
    dateModified: "2026-06-20",
    readTime: "7 min read",
    tags: ["Personal Training", "Birmingham"],
    metaTitle:
      "How to Find the Best Personal Trainer in Birmingham | High Performance Fit",
    metaDescription:
      "Looking for the best personal trainer in Birmingham? Learn what qualifications, experience and questions actually matter before you book — from a coach with 13 years in the industry.",
    relatedService: {
      href: "/personal-training-birmingham",
      label: "1-to-1 Personal Training in Birmingham",
      blurb:
        "Ready to work with a qualified coach at Foundry Gym in Kings Heath? See how 1-to-1 personal training works and book a free consultation.",
    },
    intro:
      "Type \"best personal trainer Birmingham\" into Google and you'll get hundreds of results. Everyone claims to be the best. So how do you actually choose? After 13 years coaching clients across Birmingham, here's the honest checklist I'd use if I were hiring a trainer for myself.",
    sections: [
      {
        heading: "1. Check their qualifications — properly",
        paragraphs: [
          "A genuine personal trainer should hold at least a REPS or CIMSPA-recognised Level 3 Personal Trainer qualification. That's the baseline, not a badge of excellence. Anyone charging you to change your body should be able to show it without hesitation.",
          "Beyond the certificate, look at continued education. Fitness science moves fast. A coach who stopped learning in 2015 is coaching you with 2015 knowledge.",
        ],
      },
      {
        heading: "2. Experience beats enthusiasm",
        paragraphs: [
          "Passion matters, but you're paying for results. Ask how long they've been coaching full-time and how many clients they've worked with. A trainer who has guided hundreds of people through the same struggles you're facing has seen every plateau, injury and motivation dip before.",
          [
            "This is exactly why ",
            {
              text: "1-to-1 personal training in Birmingham",
              href: "/personal-training-birmingham",
            },
            " works best when your coach has a deep track record — every session is adjusted based on patterns they've learned across years of real clients.",
          ],
        ],
      },
      {
        heading: "3. Do they specialise in your goal?",
        paragraphs: [
          "Weight loss, strength, rehabilitation and athletic performance all require different approaches. A great generalist is fine, but if you have a specific goal — say, returning to training after an injury — you want someone who has done it repeatedly.",
        ],
      },
      {
        heading: "4. The questions to ask on a consultation call",
        list: [
          "How do you measure and track my progress?",
          "What happens if I stop seeing results?",
          "Can you work around my injury or medical condition?",
          "What does a typical week of training look like for someone like me?",
          "How do you handle nutrition alongside training?",
        ],
        paragraphs: [
          "A confident coach will answer these clearly and specifically. Vague answers are a red flag.",
        ],
      },
      {
        heading: "5. Location and logistics matter more than you think",
        paragraphs: [
          "The best coach in the world is useless if the gym is a 40-minute drive away and you skip half your sessions. Choose someone whose base fits your routine. If you're in South or Central Birmingham, training at a gym in Kings Heath keeps sessions realistic and consistent.",
          "Consistency is the real secret. Pick a trainer you'll actually turn up for, week after week.",
        ],
      },
    ],
  },
  {
    slug: "online-personal-training-cost-uk",
    title: "How Much Does Online Personal Training Cost in the UK?",
    excerpt:
      "Online coaching is often cheaper than in-person PT — but pricing varies wildly. Here's a clear breakdown of what you should expect to pay in the UK and what's actually included.",
    date: "2026-06-10",
    dateModified: "2026-06-10",
    readTime: "6 min read",
    tags: ["Online Coaching", "Pricing"],
    metaTitle:
      "How Much Does Online Personal Training Cost in the UK? | High Performance Fit",
    metaDescription:
      "A clear breakdown of online personal training cost in the UK in 2026 — typical monthly prices, what's included, and how to tell if a coach is worth it.",
    relatedService: {
      href: "/online-coaching",
      label: "Online Coaching Worldwide",
      blurb:
        "Custom programmes, weekly video check-ins, form reviews and direct WhatsApp support — wherever you are. See how online coaching works.",
    },
    intro:
      "One of the most common questions I get is \"how much does online personal training cost in the UK?\" The honest answer is: it depends on what's included. Prices range from £40 to over £300 a month, and the gap usually comes down to how much genuine coaching you actually receive. Here's how to make sense of it.",
    sections: [
      {
        heading: "The typical UK price range",
        paragraphs: [
          "Most reputable online coaches in the UK charge somewhere between £150 and £250 per month for a full service. Budget app-only plans can be as low as £40–£80, while premium coaching with weekly video calls can run £300+.",
        ],
        list: [
          "£40–£80/month — app-based programme, minimal personal contact",
          "£150–£250/month — custom programme, weekly check-ins, form reviews, messaging",
          "£300+/month — premium coaching with live video calls and full nutrition planning",
        ],
      },
      {
        heading: "What you should actually be paying for",
        paragraphs: [
          "Cheap plans usually give you a generic programme dressed up as personalised. Real online coaching means your training is built around your equipment, schedule and goals, and it changes as you progress.",
          [
            "Good ",
            { text: "online coaching", href: "/online-coaching" },
            " should include a bespoke programme, weekly check-ins where your coach reviews your data and adjusts the plan, video form reviews, and direct access between sessions. If a plan doesn't include those, you're paying for a PDF.",
          ],
        ],
      },
      {
        heading: "Why online is cheaper than in-person",
        paragraphs: [
          "Online coaching removes the biggest cost of in-person training: the coach's time in the room. Instead of paying for every hour of a coach's time in the room, you pay a flat monthly fee for ongoing programming and support across the whole week.",
          "For self-motivated people who can train independently, this is often better value — you get more frequent contact and structure for less money.",
        ],
      },
      {
        heading: "Is it worth it?",
        paragraphs: [
          "If you're disciplined enough to train on your own but want expert programming, accountability and someone in your corner, online coaching is excellent value. If you need someone physically correcting your form every rep, in-person is worth the premium.",
          "The cheapest plan is rarely the best value. The best value is the plan that gets you results you'd never reach alone.",
        ],
      },
    ],
  },
  {
    slug: "benefits-of-small-group-training",
    title: "Is Group Fitness Training Worth It? The Case for Small Group PT",
    excerpt:
      "Small group training gives you most of the benefits of 1-to-1 coaching at a fraction of the price. Here's why it works — and who it's best for.",
    date: "2026-05-28",
    dateModified: "2026-05-28",
    readTime: "5 min read",
    tags: ["Group Training", "Birmingham"],
    metaTitle:
      "Is Group Fitness Training Worth It? Small Group PT Explained | High Performance Fit",
    metaDescription:
      "Small group personal training in Birmingham blends affordability, accountability and expert coaching. Learn how it works, what it costs and who it suits best.",
    relatedService: {
      href: "/group-training",
      label: "Small Group Training in Birmingham",
      blurb:
        "Train with 4–6 people, split the cost and keep each other accountable. Your first group session is free — see how it works.",
    },
    intro:
      "There's a myth that you have to choose between an expensive personal trainer and a crowded, impersonal fitness class. Small group personal training sits in the sweet spot between the two. Here's why it's one of the fastest-growing ways to train in Birmingham.",
    sections: [
      {
        heading: "The accountability effect is real",
        paragraphs: [
          "Research consistently shows people train harder and more consistently when others are counting on them. When four or five people expect you at the 6:30pm session, skipping becomes much harder. That social pressure is a feature, not a bug.",
        ],
      },
      {
        heading: "You get real coaching, not a class",
        paragraphs: [
          [
            "A good ",
            { text: "small group training session", href: "/group-training" },
            " is capped at 4–6 people, so your coach can still correct form, scale exercises to your level and push you individually. That's completely different from a 30-person bootcamp where nobody's watching your technique.",
          ],
          "Every exercise has progressions and regressions, so beginners and intermediates can train side by side without anyone being held back or left behind.",
        ],
      },
      {
        heading: "The price is the headline",
        paragraphs: [
          "Group sessions typically cost 40–50% less per person than 1-to-1 training. You're sharing the coach's time, so you split the cost — while keeping most of the benefit. For a lot of people, that's what makes consistent, coached training affordable long-term.",
        ],
      },
      {
        heading: "Who it's best for",
        list: [
          "People motivated by energy and a bit of friendly competition",
          "Anyone who finds solo gym sessions boring or easy to skip",
          "Friends or couples who want to train together and split the cost",
          "Those who want expert coaching without a 1-to-1 budget",
        ],
      },
    ],
  },
  {
    slug: "personal-training-vs-online-coaching",
    title: "Personal Training vs Online Coaching: Which Is Right for You?",
    excerpt:
      "In-person and online coaching both get results — but they suit different people. Use this honest comparison to work out which one fits your goals, budget and personality.",
    date: "2026-04-30",
    dateModified: "2026-04-30",
    readTime: "6 min read",
    tags: ["Online Coaching", "Personal Training"],
    metaTitle:
      "Personal Training vs Online Coaching: Which Is Right for You? | High Performance Fit",
    metaDescription:
      "Personal training vs online coaching compared honestly — cost, accountability, flexibility and results — so you can choose the right option for your goals.",
    relatedService: {
      href: "/online-coaching",
      label: "Online Coaching Worldwide",
      blurb:
        "Prefer the flexibility of training on your own schedule with expert programming behind you? See how online coaching works.",
    },
    intro:
      "\"Should I get a personal trainer or an online coach?\" It's the question I hear more than any other. Both work — I offer both — but they work for different people. Here's an honest comparison to help you decide.",
    sections: [
      {
        heading: "In-person personal training: the strengths",
        paragraphs: [
          [
            "With ",
            {
              text: "in-person personal training in Birmingham",
              href: "/personal-training-birmingham",
            },
            ", your coach is in the room correcting every rep, adjusting weights in real time, and providing an accountability that's hard to replicate. For beginners, people recovering from injury, or anyone who struggles to push themselves, that hands-on presence is invaluable.",
          ],
          "The trade-off is cost and scheduling. You pay for the coach's time in the room, and sessions happen at fixed times and a fixed place.",
        ],
      },
      {
        heading: "Online coaching: the strengths",
        paragraphs: [
          [
            "With ",
            { text: "online coaching", href: "/online-coaching" },
            ", you train on your own schedule, anywhere, with a custom programme and weekly check-ins. You often get more frequent contact across the week and it typically costs less than in-person sessions.",
          ],
          "The catch is that you need to be self-motivated enough to train without someone standing next to you.",
        ],
      },
      {
        heading: "A simple way to choose",
        list: [
          "Choose in-person if: you're a beginner, need hands-on form correction, or struggle to stay accountable alone",
          "Choose online if: you're self-motivated, want flexibility, train around a busy schedule, or want better value",
          "Consider a hybrid: some clients start in-person, then move online once they're confident",
        ],
      },
      {
        heading: "You don't have to decide alone",
        paragraphs: [
          "The best way to choose is a quick, no-pressure conversation about your goals, experience and lifestyle. That usually makes the right option obvious within ten minutes.",
        ],
      },
    ],
  },
  {
    slug: "how-many-personal-training-sessions-per-week",
    title: "How Many Personal Training Sessions Do You Really Need Per Week?",
    excerpt:
      "More sessions isn't always better. Here's how to work out the right training frequency for your goal, budget and recovery — without wasting money.",
    date: "2026-04-16",
    dateModified: "2026-04-16",
    readTime: "5 min read",
    tags: ["Personal Training", "Training Tips"],
    metaTitle:
      "How Many Personal Training Sessions Per Week Do You Need? | High Performance Fit",
    metaDescription:
      "How many personal training sessions per week do you actually need? A practical guide to training frequency for beginners, weight loss and strength goals.",
    relatedService: {
      href: "/personal-training-birmingham",
      label: "1-to-1 Personal Training in Birmingham",
      blurb:
        "Not sure how often you should train? Book a free consultation and I'll build a schedule that fits your goal and your life.",
    },
    intro:
      "It's the classic question: how many personal training sessions do I actually need each week? Trainers who tell everyone \"the more the better\" are usually thinking about their own diary. The honest answer depends on your goal, your recovery and your budget. Here's how to work it out.",
    sections: [
      {
        heading: "The realistic starting point for most people",
        paragraphs: [
          [
            "A common pattern is two or three coached sessions a week with one or two independent sessions on top. For ",
            {
              text: "1-to-1 personal training",
              href: "/personal-training-birmingham",
            },
            ", two coached sessions a week is enough for the vast majority of people to make steady, visible progress — especially beginners.",
          ],
          [
            "If you're over 40 and new to strength work, read our ",
            {
              text: "sensible first 12-week strength training plan",
              href: "/blog/strength-training-after-40",
            },
            ".",
          ],
        ],
      },
      {
        heading: "It depends on your goal",
        list: [
          "General health and habit-building: 1–2 sessions a week",
          "Weight loss: 2–3 sessions plus daily movement and nutrition focus",
          "Strength and muscle: 2–4 well-programmed sessions with proper recovery",
          "Beginners: start with 2 and build the habit before adding more",
        ],
      },
      {
        heading: "Recovery is where progress actually happens",
        paragraphs: [
          "Your body gets stronger between sessions, not during them. Training seven days a week with no recovery is a fast route to burnout and injury. More sessions only help if you can recover from them — sleep, nutrition and rest days do the heavy lifting.",
        ],
      },
      {
        heading: "Quality over quantity",
        paragraphs: [
          "Two focused, well-coached sessions a week will always beat five aimless ones. A good coach makes each session count so you're not wasting time or money chasing volume for its own sake.",
        ],
      },
    ],
  },
  {
    slug: "strength-training-after-40",
    title: "Strength training after 40: a sensible first 12 weeks",
    excerpt:
      "If you're over 40 and new to strength training, aim for two sessions a week that work every major muscle group. That's the NHS guideline for adults, and it's a realistic place to start: two sessions, the same handful of movements, and slow, steady progress over 12 weeks.",
    date: "2026-11-16",
    dateModified: "2026-11-16",
    readTime: "5 min read",
    tags: ["Strength", "Beginners", "Over 40"],
    metaTitle:
      "Strength training after 40: a sensible first 12 weeks | High Performance Fit",
    metaDescription:
      "The NHS says adults should do strength work on at least 2 days a week. Here is a simple, safe way to build that habit after 40, from a Birmingham personal trainer.",
    relatedService: {
      href: "/personal-training-birmingham",
      label: "1-to-1 Personal Training in Birmingham",
      blurb:
        "Work with Jay at Foundry Gym in Kings Heath on a training plan built around your experience, goals and schedule.",
    },
    intro:
      "If you're over 40 and new to strength training, aim for two sessions a week that work every major muscle group. That's the NHS guideline for adults, and it's a realistic place to start: two sessions, the same handful of movements, and slow, steady progress over 12 weeks.",
    sections: [
      {
        heading: "What the guidelines say",
        paragraphs: [
          "The NHS physical activity guidelines for adults aged 19 to 64 say you should do strengthening activities that work all the major muscle groups (legs, hips, back, abdomen, chest, shoulders and arms) on at least 2 days a week. Alongside that, they recommend at least 150 minutes of moderate activity or 75 minutes of vigorous activity a week, and cutting down on long periods of sitting.",
          "For adults aged 65 and over, the NHS says to do activities that improve strength, balance and flexibility on at least 2 days a week.",
          "Strength work doesn't have to mean a gym. The NHS lists carrying heavy shopping, yoga, pilates, lifting weights, resistance bands and bodyweight exercises such as push-ups as examples.",
        ],
      },
      {
        heading: "Weeks 1 to 4: learn the movements",
        paragraphs: [
          "Two sessions a week, about 30 to 40 minutes each, with at least a day between them.",
        ],
        list: [
          "1. A squat to a chair or bench",
          "2. A push, such as a push-up against a wall or bench",
          "3. A hinge, such as a light deadlift or hip bridge",
          "4. A pull, such as a band row or dumbbell row",
          "5. A carry, such as walking with a dumbbell in each hand",
        ],
      },
      {
        paragraphs: [
          "Do 2 sets of 8 to 12 easy reps of each. Stop every set with a few good reps left in the tank. The goal this month is good form, not effort.",
        ],
      },
      {
        heading: "Weeks 5 to 8: add a little load",
        paragraphs: [
          "Keep the same five movements. When you can do 12 clean reps on every set, add a small amount of weight or a harder version, and drop back to 8 reps. Move to 3 sets on the movements that feel solid.",
          "You may start to notice everyday things getting easier: stairs, lifting the shopping, getting up off the floor.",
        ],
      },
      {
        heading: "Weeks 9 to 12: build the habit",
        paragraphs: [
          "Stay at two sessions, or add a third if you're recovering well. Keep a simple log of weights and reps, so you can see progress on paper. By now the session should feel like part of your week rather than something you have to talk yourself into.",
        ],
      },
      {
        heading: "Three rules that keep it safe",
        list: [
          "1. Pain is a stop sign. Muscle tiredness is normal; sharp or joint pain is not.",
          "2. Progress one thing at a time: weight, reps or sets, never all three at once.",
          "3. If you have a health condition or haven't exercised in a long time, check with your GP before you start.",
        ],
      },
      {
        heading: "Want a hand?",
        paragraphs: [
          [
            "If you're in Solihull or Birmingham and want someone to set this up with you and check your form, see ",
            {
              text: "personal training in Birmingham",
              href: "/personal-training-birmingham",
            },
            " or ",
            { text: "get in touch", href: "/contact" },
            ".",
          ],
        ],
      },
      {
        heading: "Sources",
        list: [
          "NHS, \"Physical activity guidelines for adults aged 19 to 64\", last reviewed 22 May 2024. https://www.nhs.uk/live-well/exercise/physical-activity-guidelines-for-adults-aged-19-to-64/ (checked 16 November 2026)",
          "NHS, \"Physical activity guidelines for older adults\", last reviewed 15 August 2024. https://www.nhs.uk/live-well/exercise/physical-activity-guidelines-older-adults/ (checked 16 November 2026)",
        ],
      },
    ],
  },
];

const ONLINE_SERVICE = {
  href: "/online-coaching",
  label: "Online Coaching Worldwide",
  blurb: "Get a custom programme, weekly check-ins and direct support from Jay wherever you train.",
};

function dateOnly(value: unknown, fallback = ""): string {
  if (typeof value !== "string" || !value) return fallback;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value.slice(0, 10) : date.toISOString().slice(0, 10);
}

function asFaq(value: unknown): BlogFAQ[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const items = value.map((item) => {
    if (!item || typeof item !== "object") return undefined;
    const entry = item as Record<string, unknown>;
    const question = typeof entry.question === "string" ? entry.question : entry.q;
    const answer = typeof entry.answer === "string" ? entry.answer : entry.a;
    return typeof question === "string" && typeof answer === "string"
      ? { question, answer }
      : undefined;
  }).filter((item): item is BlogFAQ => item !== undefined);
  return items.length ? items : undefined;
}

function asCmsPost(value: unknown): BlogPost | undefined {
  if (!value || typeof value !== "object") return undefined;
  const post = value as Record<string, unknown>;
  if (typeof post.slug !== "string" || typeof post.title !== "string") return undefined;
  const published = dateOnly(post.published_at);
  if (!published || typeof post.excerpt !== "string") return undefined;
  const related = post.related_service;
  const relatedService = related && typeof related === "object" &&
    typeof (related as BlogPost["relatedService"]).href === "string" &&
    typeof (related as BlogPost["relatedService"]).label === "string" &&
    typeof (related as BlogPost["relatedService"]).blurb === "string"
      ? related as BlogPost["relatedService"]
      : typeof related === "string" && related.trim()
        ? {
            href: related.startsWith("/") ? related : `/${related}`,
            label: related.replace(/^\/|\/$/g, "").split(/[-/]/).map((word) => word[0]?.toUpperCase() + word.slice(1)).join(" "),
            blurb: typeof post.excerpt === "string" ? post.excerpt : ONLINE_SERVICE.blurb,
          }
        : ONLINE_SERVICE;
  const sections = Array.isArray(post.sections) ? post.sections as BlogSection[] : [];
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    date: published,
    dateModified: typeof post.updated_at === "string" && post.updated_at
      ? post.updated_at
      : published,
    readTime: typeof post.read_time === "string"
      ? post.read_time
      : typeof post.read_time === "number"
        ? `${post.read_time} min read`
        : "5 min read",
    tags: Array.isArray(post.tags) ? post.tags.filter((tag): tag is string => typeof tag === "string") : [],
    metaTitle: typeof post.meta_title === "string" ? post.meta_title : post.title,
    metaDescription: typeof post.meta_description === "string" ? post.meta_description : post.excerpt,
    relatedService,
    intro: typeof post.intro === "string" ? post.intro : post.excerpt,
    sections,
    faq: asFaq(post.faq),
  };
}

const hardcodedSlugs = new Set(HARDCODED_POSTS.map((post) => post.slug));
const CMS_POSTS = (cmsPosts as unknown[])
  .map(asCmsPost)
  .filter((post): post is BlogPost => post !== undefined && !hardcodedSlugs.has(post.slug));

export const BLOG_POSTS: BlogPost[] = [...HARDCODED_POSTS, ...CMS_POSTS]
  .sort((a, b) => b.date.localeCompare(a.date));

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
