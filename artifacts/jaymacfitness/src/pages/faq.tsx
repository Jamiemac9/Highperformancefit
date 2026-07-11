import { useEffect, useState } from "react";
import { Phone, Mail, ArrowRight, ChevronDown } from "lucide-react";

type FAQItem = {
  q: string;
  direct: string;
  detail: string;
};

const PRICING: FAQItem[] = [
  {
    q: "How much does a personal trainer cost in Birmingham?",
    direct: "Sessions start from \u00a345 per hour when bought in a block. Single sessions are \u00a355. Monthly packages with payment plans are also available.",
    detail: "Pricing in Birmingham varies widely depending on experience, location and whether you're training in a commercial gym or independently. At High Performance Fit, you're paying for 13 years of experience and a programme that's built specifically for you\u2014not a generic template. Online coaching starts from \u00a349 per week, which includes your full training programme, weekly check-ins and unlimited WhatsApp support.",
  },
  {
    q: "Is online coaching cheaper than in-person training?",
    direct: "Yes. Online coaching starts from \u00a349 per week compared to \u00a345\u2013\u00a355 per in-person session, but the value comes from daily access and flexibility rather than just the price tag.",
    detail: "With online coaching you get a fully custom programme, video form reviews, weekly 15-minute check-in calls and daily WhatsApp access. Many clients actually progress faster online because they're training more frequently and getting feedback between sessions. It's not \u2018cheaper and worse\u2019\u2014it's a different model that suits busy people, travellers and those who already know their way around a gym.",
  },
  {
    q: "Do you offer payment plans?",
    direct: "Yes. Monthly direct debit options are available for all block-booking packages. You can also pay upfront by bank transfer if you prefer.",
    detail: "The most popular option is splitting a 10-session block into two monthly payments, or a 24-session transformation package across three months. There's no credit check, no interest and no contract\u2014just a simple standing order that you can cancel with 30 days notice. We set this up during your free consultation so it's one less thing to think about.",
  },
  {
    q: "What's included in the price?",
    direct: "Every session includes a fully personalised workout, real-time coaching on form and technique, programme adjustments based on your progress, and nutrition guidance.",
    detail: "You're not just renting an hour of someone's time. I track your body composition, adjust your programme every 2\u20134 weeks, review your nutrition via WhatsApp, and provide homework exercises for the days we don't train together. Online clients get all of this plus video form reviews and a training app that updates your programme automatically.",
  },
  {
    q: "Are there any hidden fees or contracts?",
    direct: "No hidden fees and no contracts. You pay for the sessions you book and you can stop at any time.",
    detail: "The price you see is the price you pay. There's no joining fee, no admin charge and no cancellation penalty (beyond the 24-hour notice policy for individual sessions). I don't believe in locking people in\u2014if the coaching is working, you'll want to continue. If it's not, you shouldn't be stuck.",
  },
  {
    q: "Can I try a session before committing to a package?",
    direct: "Yes. I offer a free 20-minute consultation and a discounted taster session so you can experience the coaching before booking a block.",
    detail: "The consultation is no-pressure\u2014we chat about your goals, training history and what's held you back. If you want to try a full session, the taster is priced at \u00a335 (normally \u00a355). About 90% of people who book a taster go on to book a package, but there's never any hard sell.",
  },
];

const SERVICES: FAQItem[] = [
  {
    q: "What's the difference between 1-to-1 and group training?",
    direct: "1-to-1 training is fully personalised to you\u2014every exercise, every weight, every rest period is tailored. Group training caps at 4\u20136 people with a shared programme but individual attention where needed.",
    detail: "In 1-to-1 sessions we can work around injuries, adjust intensity minute-by-minute, and focus on specific weaknesses. Group training is great for people who thrive on energy and accountability\u2014you'll push harder surrounded by others, and it's significantly cheaper per person. I run groups for friends, couples and colleagues who want to train together.",
  },
  {
    q: "Can you train me if I have an injury?",
    direct: "Yes. I work with clients recovering from injuries and can liaise with your physio or GP to ensure your programme is safe and effective.",
    detail: "I've trained clients post-ACL reconstruction, with chronic lower back pain, shoulder impingement and herniated discs. The key is understanding your limitations and building around them\u2014not ignoring them. I often start with movement screening and refer to a physio if needed before loading heavier weights. Recovery isn't a reason to stop training; it's a reason to train smarter.",
  },
  {
    q: "Do you provide meal plans?",
    direct: "Every package includes nutrition guidance. Full bespoke meal plans are available as an add-on if you want extra structure.",
    detail: "Most clients don't need a rigid meal plan\u2014they need education. I teach you how to build balanced meals around your preferences, budget and schedule. If you want a fully written meal plan with recipes, macros and shopping lists, that's available as a separate add-on. The goal is sustainable habits, not a 12-week crash diet you'll abandon.",
  },
  {
    q: "How long are the sessions?",
    direct: "Standard sessions are 60 minutes. 90-minute sessions are available for advanced clients or those combining strength and conditioning work.",
    detail: "A typical hour includes a 5-minute warm-up, 45\u201350 minutes of focused work and 5\u201310 minutes of cool-down and mobility. I don't waste time\u2014every minute has a purpose. For online clients, the \u2018session\u2019 is your workout, but the weekly check-in call is 15 minutes and form reviews are done via video message throughout the week.",
  },
  {
    q: "Can I train with a partner or friend?",
    direct: "Yes. Group training is available for 3\u20136 people. Partner training (2 people) is also popular and costs less per person than 1-to-1.",
    detail: "Training with a partner or friend is one of the most effective ways to stay consistent. I programme sessions that work for both of you, adjusting exercises and weights individually while keeping you moving together. Small groups of 3\u20134 friends or colleagues are also common. The energy is higher, the accountability is stronger, and the cost per person drops significantly.",
  },
  {
    q: "Do you help with nutrition and diet?",
    direct: "Yes. Nutrition guidance is included in every package. I don't just tell you what to eat\u2014I teach you how to eat for your goals.",
    detail: "Most people know roughly what they should be eating; the gap is in execution. I help you build meals around protein targets, manage portions without weighing everything, and navigate social situations and travel. For clients who want more structure, full meal plans with recipes and shopping lists are available as an add-on. The approach is always sustainable, not restrictive.",
  },
];

const LOGISTICS: FAQItem[] = [
  {
    q: "Where do you train clients in Birmingham?",
    direct: "I'm based at Foundry Gym in Kings Heath and primarily coach clients across South and Central Birmingham. Online coaching is available worldwide.",
    detail: "Foundry Gym is just off the Kings Heath High Street with free parking, good equipment and a non-intimidating atmosphere. For outdoor sessions we use Kings Heath Park and Cannon Hill Park. If you're based in Edgbaston, Moseley, Harborne or Selly Oak, you're within 10\u201320 minutes by car or bus. I also have specific area pages for each neighbourhood with local travel details.",
  },
  {
    q: "Do I need a gym membership?",
    direct: "No. Your training package includes access to Foundry Gym during your sessions. You don't need a separate membership.",
    detail: "This is one of the biggest advantages of training with an independent PT in a private facility. You show up for your session, train, and leave. No monthly gym fees, no crowded commercial gym floor, no waiting for equipment. For online clients, you can train wherever you have access to equipment\u2014home gym, commercial gym or even a hotel gym while travelling.",
  },
  {
    q: "What should I bring to my first session?",
    direct: "Comfortable training kit, indoor trainers, a water bottle and a towel. That's it\u2014everything else is provided at the gym.",
    detail: "I'll also ask you to complete a short health questionnaire before your first session and bring any relevant medical information if you have injuries or conditions. Don't worry about being \u2018gym ready\u2019\u2014I've trained people in their work clothes when they came straight from the office. Just show up willing to work.",
  },
  {
    q: "How do online sessions work?",
    direct: "You complete an intake form, receive a custom programme via our app, and train on your own schedule. I review your form via video, check in weekly by video call, and answer questions on WhatsApp daily.",
    detail: "The programme updates automatically as you progress\u2014no more guessing what to do at the gym. You film key exercises and send them to me for form feedback, usually within a few hours. The weekly check-in is 15 minutes where we review your week, adjust the plan and troubleshoot any issues. Many online clients say the daily WhatsApp access is the most valuable part\u2014they've never had that level of support before.",
  },
  {
    q: "What if I need to cancel or reschedule?",
    direct: "Give 24 hours notice and we'll reschedule at no charge. Cancellations within 24 hours may be charged at the coach's discretion.",
    detail: "I understand that life happens\u2014work meetings run over, kids get ill, trains get cancelled. The 24-hour policy is fair and protects both of us. For regular clients with genuine emergencies, I'm flexible. I also offer a \u2018session bank\u2019 option where you can roll unused sessions into the following month if you're going on holiday or have a busy period at work.",
  },
  {
    q: "How do I book sessions?",
    direct: "Once you've had your consultation and chosen a package, you book sessions through the client portal or directly with me via WhatsApp.",
    detail: "The portal shows my real-time availability and lets you book recurring slots\u2014same day and time each week, which is what most clients prefer. You can also book ad-hoc if your schedule is unpredictable. I send reminder texts the day before and confirm any location changes if we're training outdoors.",
  },
];

const RESULTS: FAQItem[] = [
  {
    q: "How quickly will I see results?",
    direct: "Most clients notice changes in energy and strength within 2\u20133 weeks. Visible body composition changes typically show within 6\u20138 weeks with consistent training and nutrition.",
    detail: "The timeline depends on your starting point, consistency and how closely you follow the nutrition guidance. Someone training 3x per week and eating well will see faster results than someone training once and winging their diet. I track progress photos and body composition every 4 weeks so you can see changes that the mirror might miss day-to-day. The first result is usually sleeping better and feeling less sluggish\u2014that's your body adapting.",
  },
  {
    q: "What if I've never trained before?",
    direct: "Absolutely no problem. Most of my clients started as complete beginners. The only requirement is a willingness to show up and work.",
    detail: "I teach every exercise from scratch\u2014proper form, breathing, tempo and why we're doing it. Beginners often progress fastest because everything is new stimulus. I start with fundamental movement patterns (squat, hinge, push, pull, carry) and build from there. There's no expectation that you already know how to use gym equipment. In fact, I'd rather teach you correctly from the start than unteach bad habits.",
  },
  {
    q: "Can you help me lose weight?",
    direct: "Yes. Weight loss is one of the most common goals I work with, and I take a sustainable approach that prioritises fat loss while preserving muscle.",
    detail: "I don't do crash diets or \u20186-week transformations\u2019 that leave you heavier than when you started. The focus is on creating a moderate calorie deficit through nutrition education and increasing your daily energy expenditure through structured training. Most clients lose 0.5\u20131kg per week, which is the safe, sustainable rate that doesn't trigger metabolic adaptation or rebound weight gain. I've helped clients lose anywhere from 5kg to 40kg.",
  },
  {
    q: "Do you work with clients outside Birmingham?",
    direct: "Yes. Through online coaching I work with clients across the UK and in five other countries. All you need is a gym or some basic home equipment.",
    detail: "Current online clients are in London, Manchester, Edinburgh, Dubai, New York and Sydney. The timezone difference is rarely an issue\u2014most communication is asynchronous via WhatsApp and the training app, and weekly check-ins are scheduled to suit both of us. The programming, nutrition guidance and accountability are identical to in-person coaching; the only difference is I'm not physically standing next to you during the session.",
  },
  {
    q: "What happens after I reach my goal?",
    direct: "We transition to maintenance coaching. This is typically 1\u20132 sessions per month to keep you accountable, tweak your programme and prevent regression.",
    detail: "The biggest mistake people make is stopping completely once they hit their target. Maintenance is where the real work happens\u2014keeping the habits you've built while adding new challenges. Many clients who started for weight loss transition to strength goals, running programmes or simply \u2018stay fit and feel good\u2019 maintenance. The goal is that you never need to \u2018start again\u2019 because you never truly stopped.",
  },
  {
    q: "How many times a week should I train with a personal trainer?",
    direct: "Most clients train with me 2\u20133 times per week and do 1\u20132 additional sessions on their own. Beginners often start with once per week and build up.",
    detail: "The sweet spot for most people is two coached sessions plus one or two self-directed workouts. This gives you enough face-to-face time to learn proper form and stay accountable, while building the independence to train confidently on your own. For online clients, the programme typically prescribes 3\u20134 workouts per week with the check-in call keeping you on track. More isn't always better\u2014consistency beats intensity every time.",
  },
];

const CATEGORIES: { label: string; items: FAQItem[] }[] = [
  { label: "Pricing", items: PRICING },
  { label: "Services", items: SERVICES },
  { label: "Logistics", items: LOGISTICS },
  { label: "Results & Expectations", items: RESULTS },
];

function CategorySection({ label, items }: { label: string; items: FAQItem[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="mb-12 md:mb-16">
      <h2 className="headline text-2xl md:text-3xl mb-6 text-[#1E90FF]">{label}</h2>
      <div className="space-y-3">
        {items.map((f, i) => {
          const isOpen = open === i;
          return (
            <div
              key={f.q}
              className={`border rounded-xl overflow-hidden bg-white/[0.02] transition-colors ${
                isOpen ? "border-[#1E90FF]/40" : "border-white/10"
              }`}
            >
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="w-full flex items-center justify-between gap-4 p-5 md:p-6 text-left hover:bg-white/[0.03] transition-colors"
                aria-expanded={isOpen}
              >
                <span className="font-bold text-base md:text-lg">{f.q}</span>
                <ChevronDown
                  className={`h-5 w-5 text-[#1E90FF] flex-shrink-0 transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`grid transition-all duration-300 ease-out ${
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="px-5 md:px-6 pt-0 pb-1 text-[#EAF2FB] font-medium leading-relaxed">
                    {f.direct}
                  </p>
                  <p className="px-5 md:px-6 pb-5 md:pb-6 text-[#C8D8E8]/75 leading-relaxed">
                    {f.detail}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Faq() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="min-h-screen bg-[#0A1628] text-white">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative pt-32 pb-20 md:pt-40 md:pb-28">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-[#1E90FF] font-bold uppercase tracking-[0.2em] text-sm mb-4">
              Questions
            </p>
            <h1 className="headline text-5xl md:text-7xl leading-none mb-6">
              FREQUENTLY ASKED
              <br />
              <span className="text-[#1E90FF]">QUESTIONS</span>
            </h1>
            <p className="text-[#C8D8E8]/75 text-lg leading-relaxed">
              Everything you need to know before starting your training journey
              with High Performance Fit.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ List */}
      <section className="py-12 md:py-20 bg-[#0D1B2A] border-t border-white/5">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl mx-auto">
          {CATEGORIES.map((cat) => (
            <CategorySection key={cat.label} label={cat.label} items={cat.items} />
          ))}
        </div>
      </section>

      {/* Still have questions */}
      <section className="py-20 md:py-28 bg-[#0A1628] border-t border-white/5">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-3xl">
          <h2 className="headline text-4xl md:text-5xl leading-none mb-6">
            STILL HAVE <span className="text-[#1E90FF]">QUESTIONS?</span>
          </h2>
          <p className="text-[#C8D8E8]/75 text-lg leading-relaxed mb-8">
            No problem. Call, text or email \u2014 I'll get back to you within 24
            hours. Or book a free consultation and we can talk it through in
            person.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="tel:+447753226214"
              className="bg-[#1E90FF] text-white font-bold uppercase tracking-wider px-8 py-4 rounded-full hover:bg-[#4DAAFF] transition-all inline-flex items-center gap-2"
            >
              <Phone className="h-4 w-4" /> Call 07753 226 214
            </a>
            <a
              href="mailto:hello@highperformancefit.co.uk"
              className="border border-white/20 text-white font-bold uppercase tracking-wider px-8 py-4 rounded-full hover:bg-white/5 transition-all inline-flex items-center gap-2"
            >
              <Mail className="h-4 w-4" /> Email Jay
            </a>
            <a
              href="/contact"
              className="border border-[#1E90FF]/40 text-[#1E90FF] font-bold uppercase tracking-wider px-8 py-4 rounded-full hover:bg-[#1E90FF]/10 transition-all inline-flex items-center gap-2"
            >
              <ArrowRight className="h-4 w-4" /> Book Free Consultation
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
